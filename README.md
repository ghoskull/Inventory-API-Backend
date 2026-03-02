# Inventory Management API

Aplikasi manajemen inventory berbasis web dengan backend Express.js dan MongoDB, dilengkapi dengan autentikasi JWT, fitur CRUD, paginasi, dan laporan agregasi. Proyek ini dibuat sebagai tugas dan portofolio dengan latar belakang Industrial Engineering & Business Analytics.

## 🚀 Fitur

### Autentikasi & Pengguna
- Registrasi dan login dengan JWT (token disimpan di cookie HTTP-only)
- Logout
- Proteksi endpoint write (hanya user terautentikasi yang dapat menambah, mengubah, menghapus item)

### Manajemen Inventory (CRUD)
- Tambah item baru
- Lihat semua item dengan paginasi
- Lihat detail item berdasarkan `itemCode` atau MongoDB `_id`
- Ubah data item
- Hapus item

### Laporan & Analitik (Aggregation Pipeline)
- **Total nilai inventory per supplier** – menghitung total `quantity * unitPrice` untuk setiap pemasok.
- **Item dengan stok di bawah threshold** – menampilkan item yang jumlahnya kurang dari ambang batas (bisa diatur via query).
- **Ringkasan inventory** – total item, total kuantitas, total nilai, dan rata-rata harga.

### Tampilan Web (EJS)
- Halaman daftar item dengan pagination
- Form tambah/edit item
- Halaman detail item
- Halaman login & registrasi
- Halaman laporan (menampilkan hasil agregasi dalam tabel)

### API Publik & Terproteksi
- Endpoint publik untuk membaca data dan laporan
- Endpoint terproteksi untuk operasi tulis (membutuhkan token)

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **Autentikasi**: JWT, bcryptjs
- **Template Engine**: EJS
- **Lainnya**: nanoid (untuk itemCode unik), dotenv, cookie-parser, method-override

## 📦 Instalasi dan Menjalankan Proyek

### Prasyarat
- Node.js (v14 atau lebih baru)
- npm atau yarn
- Akun MongoDB Atlas (atau MongoDB lokal)

### Langkah-langkah

1. **Clone repositori**
   ```bash
   git clone https://github.com/ghoskull/Inventory-API-Backend.git
   cd Inventory-API-Backend
2. Install dependensi:
    npm install
3. Buat file .env berdasarkan .env.example
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory
    PORT=5000
    JWT_SECRET=your_super_secret_key
4. Jalankan server:
    npm run dev
5. Buka browser di http://localhost:5000



🌐 Tampilan Web
Halaman web tersedia di:

/ – Daftar item

/login – Login

/register – Register

/items/new – Tambah item (perlu login)

/items/:itemCode/edit – Edit item (perlu login)

/items/:itemCode – Detail item

/reports – Laporan