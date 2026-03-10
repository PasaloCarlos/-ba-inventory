import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import InventoryTable from '../components/InventoryTable';
import ItemModal from '../components/ItemModal';
import { getInventory, addItem, updateItem, deleteItem, getTotalInventoryValue } from '../lib/inventory';
import type { Category, InventoryItem, InventoryInsert } from '../types/inventory';

const CATEGORIES: Category[] = [
  'Custom Hair Blends',
  'Tools',
  'Faux Locs Hair',
  'Braiding Hair',
];

export default function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [defaultCategory, setDefaultCategory] = useState<Category>('Custom Hair Blends');
  const [search, setSearch] = useState('');

  const loadItems = useCallback(async () => {
    try {
      const data = await getInventory();
      setItems(data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAdd = (category: Category) => {
    setEditingItem(null);
    setDefaultCategory(category);
    setModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await deleteItem(id);
    await loadItems();
  };

  const handleSave = async (data: InventoryInsert) => {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await addItem(data);
    }
    setModalOpen(false);
    setEditingItem(null);
    await loadItems();
  };

  const filtered = search
    ? items.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          (i.brand ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : items;

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="dashboard">
      <Header totalValue={getTotalInventoryValue(items)} />

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="stats">
          <span className="stat">
            <strong>{items.length}</strong> items
          </span>
          <span className="stat status-low">
            <strong>{items.filter((i) => i.status === 'Low Stock').length}</strong> low
          </span>
          <span className="stat status-out">
            <strong>{items.filter((i) => i.status === 'No Stock').length}</strong> out
          </span>
        </div>
      </div>

      {CATEGORIES.map((cat) => (
        <InventoryTable
          key={cat}
          items={filtered}
          category={cat}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      ))}

      {modalOpen && (
        <ItemModal
          item={editingItem}
          defaultCategory={defaultCategory}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
