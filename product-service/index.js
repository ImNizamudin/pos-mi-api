const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URL);
let db;

async function connectWithRetry(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await client.connect();
      db = client.db('pos');
      console.log('Connected to MongoDB');

      app.get('/products', async (req, res) => {
        const products = await db.collection('products').find().toArray();
        res.json(products);
      });

      app.post('/products', async (req, res) => {
        const result = await db.collection('products').insertOne(req.body);
        res.status(201).json(result.ops?.[0] || req.body);
      });

      app.listen(8000, () => {
        console.log('Product service running on port 8000 container, 8001 host');
      });

      break;
    } catch (err) {
      console.error(`MongoDB connection failed (${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('Could not connect to MongoDB. Exiting.');
        process.exit(1);
      }
    }
  }
}

connectWithRetry();
