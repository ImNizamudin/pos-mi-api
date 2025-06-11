const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/receipts', (req, res) => {
  const receipt = req.body;

  // Format receipt text
  const lines = [
    `=== STRUK PENJUALAN ===`,
    `Waktu   : ${receipt.timestamp}`,
    `Kasir   : ${receipt.cashier}`,
    `-------------------------`,
    ...receipt.items.map(
      item => `${item.product} x${item.quantity} = Rp${item.price * item.quantity}`
    ),
    `-------------------------`,
    `TOTAL   : Rp${receipt.total}`,
    `=========================\n`
  ];

  const receiptText = lines.join('\n');

  // Simpan ke file (opsional)
  const filename = path.join(__dirname, `receipts/receipt-${receipt.saleId}.txt`);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, receiptText);

  console.log(`Receipt saved: ${filename}`);
  res.status(201).json({ message: 'Receipt saved', file: filename });
});

app.listen(8000, () => {
  console.log('Receipt service running on port 8000 container, 8005 host');
});
