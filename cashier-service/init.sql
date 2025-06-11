-- init.sql

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS posdb;
USE posdb;

-- Buat tabel cashiers
CREATE TABLE IF NOT EXISTS cashiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Opsional) Insert data awal
INSERT INTO cashiers (name, email, password)
VALUES 
  ('Admin Kasir', 'admin@pos.com', 'admin123'),
  ('Kasir 1', 'kasir1@pos.com', 'kasir123');
