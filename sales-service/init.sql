CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  cashier_id INT,
  sale_time TIMESTAMP DEFAULT NOW(),
  total INT
);

CREATE TABLE IF NOT EXISTS sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INT REFERENCES sales(id),
  product_id TEXT,
  quantity INT,
  price_each INT
);
