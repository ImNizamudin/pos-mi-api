# 🛒 POS-Mi - Microservices-based Point of Sale API System ![Status](https://img.shields.io/badge/status-development-blue)

---

## 🧠 Project Overview

**POS-Mi** adalah sistem backend Point of Sale berbasis arsitektur microservices yang dirancang untuk mendukung operasional kasir modern. Sistem ini dikembangkan dengan pendekatan REST API modular, sehingga setiap layanan (produk, inventory, penjualan, dan struk) dapat dikembangkan dan diskalakan secara terpisah.

Proyek ini mendukung kebutuhan aplikasi kasir yang cepat, ringan, dan terintegrasi, cocok untuk digunakan oleh UMKM, retail, maupun pengembangan POS berbasis web dengan frontend modern seperti Next.js.

---

## ✨ Key Features

- 🧩 **Microservice Architecture** — tiap domain (produk, stok, penjualan, struk) dibangun sebagai service mandiri.
- 🔁 **API Gateway Routing** — satu titik akses terpusat yang menangani request dari frontend.
- ⚡ **Real-Time Stock Update** — stok produk otomatis berkurang saat transaksi dilakukan.
- 📄 **Receipt Generation** — menyimpan data struk transaksi yang bisa ditampilkan ulang.
- 🗂️ **Multi-Database** — menggunakan kombinasi MongoDB, Redis, dan PostgreSQL sesuai kebutuhan service.
- 🧪 **Terintegrasi dengan Next.js Frontend** — mendukung komunikasi seamless antara frontend dan backend.

---

## 🖼️ API System Architecture Preview

> *(Gambar arsitektur API microservices akan ditambahkan di sini)*  
> _Ilustrasi: API Gateway di tengah, dengan empat microservice terhubung (Product, Inventory, Sales, Receipt)_

---

## 🏗️ Architecture & Tech Stack

| Layer              | Tools & Frameworks                        |
|--------------------|-------------------------------------------|
| **API Gateway**    | Node.js, Express, http-proxy-middleware   |
| **Product Service**| Node.js, MongoDB (mongoose)               |
| **Inventory Service**| Node.js, Redis                         |
| **Sales Service**  | Node.js, PostgreSQL (pg)                  |
| **Receipt Service**| Node.js, JSON Storage / Flat-file         |
| **Frontend (Client)**| Next.js (berkomunikasi melalui API Gateway) |

---

## 📚 API & Route Overview

### ✅ Product Service (MongoDB)
- `POST /products` — Tambah produk baru
- `GET /products` — Ambil semua produk

### ✅ Inventory Service (Redis)
- `POST /inventory` — Set stok awal produk
- `GET /inventory` — Ambil semua stok
- `POST /inventory/decrease` — Kurangi stok saat order

### ✅ Sales Service (PostgreSQL)
- `POST /sales` — Buat transaksi penjualan
- `GET /sales` — Lihat seluruh penjualan
- `GET /sales?saleId=...` — Detail satu transaksi

### ✅ Receipt Service
- `POST /receipts` — Simpan data struk transaksi

---

## ⚙️ Frontend Integration (Next.js Routes)

| Halaman         | Method / Event                                                                 |
|------------------|--------------------------------------------------------------------------------|
| `/inventory`     | `GET /products`, `GET /inventory`                                              |
| `/inventory/add` | `POST /products`, `POST /inventory`                                            |
| `/order`         | `GET /products`, `POST /sales`, `POST /inventory/decrease`, `POST /receipts`  |
| `/sales`         | `GET /sales`                                                                   |
| `/sales/receipt` | `GET /sales?saleId=...`                                                        |
| `/login`         | `setCashier()` (simpan kasir di localStorage)                                  |
| `/logout`        | `logoutCashier()` (hapus sesi dan redirect ke login)                           |

---

## ⚙️ Installation & Usage Guide

Langkah-langkah menjalankan POS-Mi API secara lokal:

```bash
# 1. Clone repositori
git clone https://github.com/yourusername/pos-mi-api.git
cd pos-mi-api

# 2. Jalankan tiap service secara mandiri atau via Docker
cd gateway/
npm install
npm run dev

# Jalankan service lain di folder masing-masing: product, inventory, sales, receipts
