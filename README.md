# km-feb24-jakarta-23
 
# Pizza Sales Dashboard

**Pizza Sales Dashboard** adalah sebuah proyek berbasis web yang dirancang untuk memvisualisasikan data penjualan pizza. Ini mencakup berbagai jenis grafik untuk mewakili statistik penjualan dan memungkinkan pengguna untuk menyaring data berdasarkan bulan, serta mencari item pizza tertentu.

## Fitur

### Grafik

Dashboard ini mencakup grafik-garifik berikut:
- **Orders Per Day**: Grafik garis yang menampilkan jumlah total pesanan setiap hari dalam seminggu.
- **Pizza Sold By Category**: Grafik batang yang menampilkan total kuantitas pizza yang terjual untuk setiap kategori.
- **Sales Donut Chart Per Size**: Grafik donat yang mengilustrasikan distribusi penjualan berdasarkan ukuran pizza.
- **Top Pizza By Revenue**: Grafik batang yang menampilkan 5 pizza teratas berdasarkan pendapatan.
- **Bottom Pizza By Revenue**: Grafik batang yang menampilkan 5 pizza terbawah berdasarkan pendapatan.

### Penyaringan

- **Month Filter**: Pengguna dapat menyaring data dengan memilih bulan tertentu dari menu dropdown. Grafik akan diperbarui sesuai bulan yang dipilih.

### Pencarian

- **Search Input**: Pengguna dapat mencari item pizza tertentu menggunakan kolom input pencarian. Tabel akan diperbarui untuk menampilkan item yang sesuai.

## Cara Menggunakan

1. Buka dashboard di peramban web Anda.
2. Gunakan penyaring bulan untuk memilih bulan tertentu atau biarkan "All" untuk melihat data untuk semua bulan.
3. Gunakan kolom input pencarian untuk mencari item pizza tertentu.

## Ketergantungan

Proyek ini bergantung pada dependensi berikut:
- [Chart.js](https://www.chartjs.org/) untuk membuat grafik.
- [FontAwesome](https://fontawesome.com/) untuk ikon.

## Sumber Data

Data penjualan pizza diambil dari file JSON bernama `pizza.json`.