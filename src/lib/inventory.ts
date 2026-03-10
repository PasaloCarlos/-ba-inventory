import { supabase } from './supabase';
import type { Category, InventoryInsert, InventoryItem } from '../types/inventory';

export async function getInventory(category?: Category): Promise<InventoryItem[]> {
  let query = supabase
    .from('inventory')
    .select('*')
    .order('category')
    .order('name');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as InventoryItem[];
}

export async function addItem(item: InventoryInsert): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

export async function updateItem(id: string, updates: Partial<InventoryInsert>): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export function calculateValue(qty: number, price: number): number {
  return Math.round(qty * price * 100) / 100;
}

export function getTotalInventoryValue(items: InventoryItem[]): number {
  return Math.round(
    items.reduce((sum, item) => sum + calculateValue(item.qty, item.price), 0) * 100
  ) / 100;
}
