const XLSX = require('C:/Users/carlosfigueroa/AppData/Local/Temp/node_modules/xlsx');
const wb = XLSX.readFile('C:/Users/carlosfigueroa/Downloads/BA inventory .xlsx');
const ws = wb.Sheets['Inventory Checklist'];
const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

const items = [];

for (let r = 5; r < data.length; r++) {
  const row = data[r];

  // Custom Hair Blends: name=col1, qty=col3, price=col4
  const chbName = String(row[1] || '').trim();
  if (chbName) {
    items.push({
      name: chbName,
      category: 'Custom Hair Blends',
      brand: null,
      qty: Number(row[3]) || 0,
      price: Number(row[4]) || 0,
      status: Number(row[3]) > 0 ? 'In Stock' : 'No Stock',
    });
  }

  // Tools: name=col8, qty=col10, price=col11
  const toolName = String(row[8] || '').trim();
  if (toolName) {
    items.push({
      name: toolName,
      category: 'Tools',
      brand: null,
      qty: Number(row[10]) || 0,
      price: Number(row[11]) || 0,
      status: Number(row[10]) > 0 ? 'In Stock' : 'No Stock',
    });
  }

  // Faux Locs Hair: name=col22, brand=col24, qty=col25, price=col26, status=col28
  const flName = String(row[22] || '').trim();
  if (flName && !flName.startsWith('OLD INVENTORY')) {
    const flStatus = String(row[28] || '').trim();
    items.push({
      name: flName,
      category: 'Faux Locs Hair',
      brand: String(row[24] || '').trim() || null,
      qty: Number(row[25]) || 0,
      price: Number(row[26]) || 0,
      status: ['In Stock', 'Low Stock', 'No Stock'].includes(flStatus) ? flStatus : 'In Stock',
    });
  }

  // Braiding Hair: name=col31, brand=col33, qty=col34, price=col35, status=col37
  const bhName = String(row[31] || '').trim();
  if (bhName && !bhName.startsWith('OLD INVENTORY') && !bhName.startsWith('COLOR HAIR')) {
    const bhStatus = String(row[37] || '').trim();
    items.push({
      name: bhName,
      category: 'Braiding Hair',
      brand: String(row[33] || '').trim() || null,
      qty: Number(row[34]) || 0,
      price: Number(row[35]) || 0,
      status: ['In Stock', 'Low Stock', 'No Stock'].includes(bhStatus) ? bhStatus : 'In Stock',
    });
  }
}

// Generate SQL
console.log('-- Import from Excel: ' + items.length + ' items\n');
console.log('INSERT INTO inventory (name, category, brand, qty, price, status) VALUES');

const values = items.map((item) => {
  const name = item.name.replace(/'/g, "''");
  const brand = item.brand ? "'" + item.brand.replace(/'/g, "''") + "'" : 'NULL';
  return `  ('${name}', '${item.category}', ${brand}, ${item.qty}, ${item.price}, '${item.status}')`;
});

console.log(values.join(',\n') + ';');
