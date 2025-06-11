const express = require('express');
const redis = require('redis');
require('dotenv').config();

const app = express();
app.use(express.json());

const client = redis.createClient({ url: `redis://${process.env.REDIS_HOST}:6379` });

client.connect().then(() => console.log('Connected to Redis'));

app.get('/inventory/:productId', async (req, res) => {
  const stock = await client.get(req.params.productId);
  res.json({ productId: req.params.productId, stock: parseInt(stock) || 0 });
});

app.post('/inventory', async (req, res) => {
  const { productId, stock } = req.body;
  await client.set(productId, stock);
  res.status(201).json({ message: 'Stock updated' });
});

app.post('/inventory/decrease', async (req, res) => {
  const { productId, quantity } = req.body;
  const current = parseInt(await client.get(productId)) || 0;

  if (current < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  await client.set(productId, current - quantity);
  res.json({ message: 'Stock decreased' });
});

app.listen(8000, () => {
  console.log('Inventory service running on port 8000 container, 8003 host');
});
