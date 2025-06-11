const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('dev')); // log format singkat: method, URL, status, respon time

// Routing ke masing-masing service
app.use('/products', createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
}));

app.use('/sales', createProxyMiddleware({
  target: process.env.SALES_SERVICE_URL,
  changeOrigin: true,
}));

app.use('/cashiers', createProxyMiddleware({
  target: process.env.CASHIER_SERVICE_URL,
  changeOrigin: true,
}));

app.use('/inventory', createProxyMiddleware({
  target: process.env.INVENTORY_SERVICE_URL,
  changeOrigin: true,
}));

app.use('/receipts', createProxyMiddleware({
  target: process.env.RECEIPT_SERVICE_URL,
  changeOrigin: true,
}));

app.listen(8080, () => {
  console.log('✅ API Gateway running on port 8080');
});
