const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

// app.get('/sales', async (req, res) => {
//   const result = await pool.query('SELECT * FROM sales');
//   res.json(result.rows);
// });

app.get('/sales', async (req, res) => {
  const { saleId } = req.query;

  if (saleId) {
    try {
      // Ambil data transaksi
      const saleResult = await pool.query(
        'SELECT * FROM sales WHERE id = $1',
        [saleId]
      );
      const sale = saleResult.rows[0];
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // Ambil detail item penjualan
      const itemsResult = await pool.query(
        'SELECT product_id, quantity, price_each FROM sale_items WHERE sale_id = $1',
        [saleId]
      );

      res.json({
        id: sale.id,
        cashier_id: sale.cashier_id,
        sale_time: sale.sale_time,
        total: sale.total,
        items: itemsResult.rows
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve sale' });
    }
  } else {
    // Kembalikan semua data jika tanpa saleId
    const result = await pool.query('SELECT * FROM sales');
    res.json(result.rows);
  }
});


app.post('/sales', async (req, res) => {
  const { cashier_id, total, items } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const saleRes = await client.query(
      'INSERT INTO sales (cashier_id, sale_time, total) VALUES ($1, NOW(), $2) RETURNING id',
      [cashier_id, total]
    );
    const saleId = saleRes.rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO sale_items (sale_id, product_id, quantity, price_each) VALUES ($1, $2, $3, $4)',
        [saleId, item.product_id, item.quantity, item.price_each]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ saleId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Transaction failed');
  } finally {
    client.release();
  }
});

app.listen(8000, () => {
  console.log('Sales service running on port 8000 container, 8002 host');
});
