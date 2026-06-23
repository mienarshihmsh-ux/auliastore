# FashionStore - Toko Fashion Online Modern

FashionStore adalah prototipe aplikasi e-commerce fashion modern yang dirancang untuk memberikan pengalaman berbelanja yang elegan, cepat, dan cerdas. Aplikasi ini menggabungkan desain kontemporer dengan integrasi AI untuk membantu pelanggan menemukan gaya terbaik mereka.

## Fitur Utama

- **Katalog Produk Dinamis**: Menampilkan koleksi fashion terbaru yang diambil secara real-time dari backend Google Apps Script.
- **Sistem Keranjang Belanja Cerdas**: Fitur tambah, hapus, dan pembaruan kuantitas item dengan sinkronisasi penyimpanan lokal (LocalStorage).
- **Rekomendasi Gaya AI**: Menggunakan teknologi Genkit dan Google Gemini untuk memberikan saran aksesori yang melengkapi item di keranjang belanja pengguna secara otomatis.
- **Proses Checkout Valid**: Formulir pengiriman yang dilengkapi dengan validasi ketat (Nama minimal 3 karakter, Email khusus Gmail, dan format nomor telepon Indonesia).
- **Integrasi Pembayaran Midtrans**: Mendukung pembayaran aman menggunakan Midtrans Snap Gateway.
- **Antarmuka Responsif & Modern**: Desain yang dioptimalkan untuk perangkat mobile, tablet, dan desktop menggunakan Tailwind CSS dan komponen ShadCN UI.
- **Galeri Koleksi**: Ruang visual untuk mengeksplorasi tren fashion terbaru melalui kategori galeri yang dapat difilter.

## Teknologi yang Digunakan

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Library UI**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **AI Tooling**: [Genkit](https://firebase.google.com/docs/genkit) dengan model Google Gemini 2.5 Flash
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Notifikasi**: [SweetAlert2](https://sweetalert2.github.io/)
- **Integrasi Backend**: Google Apps Script API & Midtrans Payment Gateway

## Cara Menjalankan Aplikasi

1.  **Instalasi Dependensi**:
    Aplikasi akan secara otomatis menginstal paket yang diperlukan saat dijalankan di lingkungan Firebase Studio.
2.  **Server Pengembangan**:
    Jalankan perintah berikut untuk memulai server lokal:
    ```bash
    npm run dev
    ```
3.  **Akses Aplikasi**:
    Buka [http://localhost:9002](http://localhost:9002) pada browser Anda.

## Konfigurasi Penting

- **Integrasi Midtrans**: Pastikan `data-client-key` di `src/app/layout.tsx` telah diatur dengan Client Key Midtrans milik Anda.
- **Data Backend**: URL API Google Apps Script didefinisikan dalam variabel `APPS_SCRIPT_URL` pada komponen utama untuk manajemen stok dan produk.

---
© 2024 FashionStore. Dibangun dengan fokus pada kualitas dan inovasi fashion.