const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

async function connectWithRetry() {
  for (let i = 0; i < 10; i++) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log('✅ MySQL is ready');
      break;
    } catch (err) {
      console.log('MySQL not ready yet. Retrying in 5 seconds...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry().then(() => {
  app.get('/cashiers', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM cashiers');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Database error');
    }
  });

  app.listen(8000, () => {
    console.log('Cashier service running on port 8000 container, 8004 host');
  });
});
