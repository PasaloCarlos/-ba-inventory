import type { Category, InventoryItem } from '../types/inventory';
import { calculateValue } from '../lib/inventory';

interface InventoryTableProps {
  items: InventoryItem[];
  category: Category;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onAdd: (category: Category) => void;
}

const STATUS_CLASS: Record<string, string> = {
  'In Stock': 'status-in',
  'Low Stock': 'status-low',
  'No Stock': 'status-out',
};

export default function InventoryTable({ items, category, onEdit, onDelete, onAdd }: InventoryTableProps) {
  const categoryItems = items.filter((i) => i.category === category);
  const categoryTotal = categoryItems.reduce(
    (sum, item) => sum + calculateValue(item.qty, item.price),
    0
  );

  return (
    <div className="inventory-section">
      <div className="section-header">
        <h2>{category}</h2>
        <div className="section-meta">
          <span className="section-total">${categoryTotal.toFixed(2)}</span>
          <button className="btn-add" onClick={() => onAdd(category)}>+ Add</button>
        </div>
      </div>

      {categoryItems.length === 0 ? (
        <p className="empty">No items in this category.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoryItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.brand ?? '—'}</td>
                  <td>{item.qty}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${calculateValue(item.qty, item.price).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${STATUS_CLASS[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => onEdit(item)}>Edit</button>
                    <button className="btn-delete" onClick={() => onDelete(item.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
