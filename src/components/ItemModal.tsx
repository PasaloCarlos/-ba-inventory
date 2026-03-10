import { useState, useEffect } from 'react';
import type { Category, InventoryItem, InventoryInsert, StockStatus } from '../types/inventory';

const CATEGORIES: Category[] = [
  'Custom Hair Blends',
  'Tools',
  'Faux Locs Hair',
  'Braiding Hair',
];

const STATUSES: StockStatus[] = ['In Stock', 'Low Stock', 'No Stock'];

interface ItemModalProps {
  item: InventoryItem | null;
  defaultCategory?: Category;
  onSave: (data: InventoryInsert) => void;
  onClose: () => void;
}

export default function ItemModal({ item, defaultCategory, onSave, onClose }: ItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(defaultCategory ?? 'Custom Hair Blends');
  const [brand, setBrand] = useState('');
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<StockStatus>('In Stock');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setBrand(item.brand ?? '');
      setQty(item.qty);
      setPrice(item.price);
      setStatus(item.status);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      category,
      brand: brand || null,
      qty,
      price,
      status,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{item ? 'Edit Item' : 'Add Item'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Brand
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Optional"
            />
          </label>
          <div className="form-row">
            <label>
              Quantity
              <input
                type="number"
                min="0"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </label>
            <label>
              Price ($)
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </label>
          </div>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as StockStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <span className="value-preview">
              Value: ${(qty * price).toFixed(2)}
            </span>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {item ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
