
# FashionStore - Toko Fashion Online Modern (Aulia Store)

FashionStore adalah prototipe aplikasi e-commerce fashion modern yang dirancang untuk memberikan pengalaman berbelanja yang elegan, cepat, dan cerdas. Aplikasi ini menggabungkan desain kontemporer dengan integrasi AI untuk membantu pelanggan menemukan gaya terbaik mereka.

## Fitur Utama

- **Katalog Produk Dinamis**: Menampilkan koleksi fashion terbaru yang diambil secara real-time dari backend Google Apps Script.
- **Sistem Keranjang Belanja Cerdas**: Fitur tambah, hapus, dan pembaruan kuantitas item dengan sinkronisasi penyimpanan lokal (LocalStorage).
- **Rekomendasi Gaya AI**: Menggunakan teknologi Genkit dan Google Gemini untuk memberikan saran aksesori yang melengkapi item di keranjang belanja pengguna secara otomatis.
- **Proses Checkout Valid**: Formulir pengiriman yang dilengkapi dengan validasi ketat (Nama minimal 3 karakter, Email khusus Gmail, dan format nomor telepon Indonesia).
- **Integrasi Pembayaran Midtrans**: Mendukung pembayaran aman menggunakan Midtrans Snap Gateway.
- **Antarmuka Responsif & Modern**: Desain yang dioptimalkan untuk perangkat mobile (Side Drawer Menu), tablet, dan desktop menggunakan Tailwind CSS dan komponen ShadCN UI.
- **Galeri Koleksi**: Ruang visual untuk mengeksplorasi tren fashion terbaru melalui kategori galeri yang dapat difilter.

## Keamanan (Security)

Aplikasi ini telah menerapkan standar keamanan dasar untuk prototipe web modern:
1. **Enkripsi Data (HTTPS)**: Seluruh komunikasi data antara pengguna dan server dilindungi dengan enkripsi SSL/TLS.
2. **Proteksi XSS**: Menggunakan React yang secara otomatis mensterilkan input teks untuk mencegah serangan injeksi skrip.
3. **Pembayaran Terjamin**: Data sensitif pembayaran diproses langsung oleh Midtrans Snap, sehingga informasi kartu kredit/debit tidak pernah disimpan di server aplikasi.
4. **Validasi Input**: Validasi ketat di sisi klien memastikan data yang dikirim ke backend memiliki format yang benar.
5. **Request Sanitization**: Setiap data yang dikirim melalui formulir checkout dibersihkan (*trimmed*) dan disiapkan untuk mencegah manipulasi data dasar.

*Catatan untuk Produksi: Sangat disarankan untuk menambahkan sistem otentikasi (Firebase Auth) dan validasi sisi server (Server-side validation) yang lebih kuat di Google Apps Script untuk mencegah bypass data.*

## Teknologi yang Digunakan

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Library UI**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **AI Tooling**: [Genkit](https://firebase.google.com/docs/genkit) dengan model Google Gemini 2.5 Flash
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Notifikasi**: [SweetAlert2](https://sweetalert2.github.io/)
- **Integrasi Backend**: Google Apps Script API & Midtrans Payment Gateway

## Deployment ke Vercel

Aplikasi ini siap dideploy ke Vercel. Pastikan Anda mengatur variabel lingkungan (Environment Variables) berikut di Dashboard Vercel:

1. `GOOGLE_GENAI_API_KEY`: API Key dari Google AI Studio untuk fitur rekomendasi gaya.
2. `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`: Client Key Midtrans Anda (pastikan juga diatur di `src/app/layout.tsx`).

## Cara Menjalankan Secara Lokal

1. **Instalasi Dependensi**:
   ```bash
   npm install
   ```
2. **Server Pengembangan**:
   ```bash
   npm run dev
   ```
3. **Akses Aplikasi**:
   Buka [http://localhost:9002](http://localhost:9002) pada browser Anda.

---
© 2024 Aulia Store. Dibangun dengan fokus pada kualitas dan inovasi fashion.
