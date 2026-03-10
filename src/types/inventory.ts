export type StockStatus = 'In Stock' | 'Low Stock' | 'No Stock';

export type Category =
  | 'Custom Hair Blends'
  | 'Tools'
  | 'Faux Locs Hair'
  | 'Braiding Hair';

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  brand: string | null;
  qty: number;
  price: number;
  status: StockStatus;
  created_at: string;
  updated_at: string;
}

export type InventoryInsert = Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>;
