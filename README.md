
# FashionStore - Toko Fashion Online Modern (Aulia Store)

FashionStore adalah prototipe aplikasi e-commerce fashion modern yang dirancang untuk memberikan pengalaman berbelanja yang elegan, cepat, dan cerdas. Aplikasi ini menggabungkan desain kontemporer dengan integrasi AI untuk membantu pelanggan menemukan gaya terbaik mereka.

## Fitur Utama

- **Katalog Produk Dinamis**: Menampilkan koleksi fashion terbaru yang diambil secara real-time dari backend Google Apps Script.
- **Sistem Keranjang Belanja Cerdas**: Fitur tambah, hapus, dan pembaruan kuantitas item dengan sinkronisasi penyimpanan lokal (LocalStorage).
- **Rekomendasi Gaya AI**: Menggunakan teknologi Genkit dan Google Gemini untuk memberikan saran aksesori yang melengkapi item di keranjang belanja pengguna secara otomatis.
- **Proses Checkout Valid**: Formulir pengiriman yang dilengkapi dengan validasi ketat (Nama minimal 3 karakter, Email khusus Gmail, dan format nomor telepon Indonesia).
- **Integrasi Pembayaran Midtrans**: Mendukung pembayaran aman menggunakan Midtrans Snap Gateway.
- **Antarmuka Responsif & Modern**: Desain yang dioptimalkan untuk perangkat mobile (Side Drawer Menu), tablet, dan desktop menggunakan Tailwind CSS dan komponen ShadCN UI.

## Keamanan & Kesiapan Produksi (Security)

Aplikasi ini telah menerapkan standar keamanan industri untuk prototipe web modern. Berikut adalah rincian keamanan yang diimplementasikan:

### 1. Keamanan yang Sudah Terpasang:
- **Proteksi XSS (Next.js)**: Secara otomatis melakukan sanitasi pada input teks untuk mencegah serangan injeksi skrip berbahaya.
- **Enkripsi HTTPS**: Seluruh komunikasi data dilindungi oleh SSL/TLS saat dideploy ke Vercel.
- **Isolasi Data Pembayaran**: Data sensitif kartu kredit diproses langsung oleh Midtrans Snap (PCI-DSS compliant). Server aplikasi tidak pernah melihat atau menyimpan data pembayaran Anda.
- **Validasi Klien Berlapis**: Mencegah data sampah masuk ke sistem dengan pengecekan format email, telepon, dan panjang karakter secara real-time.
- **Anti-Spam Checkout**: Implementasi jeda waktu (debounce) pada tombol checkout untuk mencegah pengiriman massal (*Rate Limiting* sederhana).

### 2. Rekomendasi untuk Tahap Produksi Skala Besar:
Meskipun prototipe ini aman, untuk produksi penuh sangat disarankan untuk:
- **Validasi Sisi Server (GAS)**: Pastikan skrip Google Apps Script Anda juga melakukan validasi ulang terhadap data yang diterima untuk mencegah bypass dari alat pengembang.
- **Firebase Authentication**: Menambahkan sistem login untuk melindungi profil pengguna dan riwayat pesanan.
- **Environment Variables**: Selalu simpan Client Key Midtrans dan API Key AI di dashboard Vercel, jangan hardcoded di file publik.

## Teknologi yang Digunakan

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library UI**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **AI Tooling**: [Genkit](https://firebase.google.com/docs/genkit) dengan model Google Gemini 2.5 Flash
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Integrasi Pembayaran**: Midtrans Snap Gateway

## Deployment ke Vercel

Pastikan Anda mengatur variabel lingkungan (Environment Variables) berikut di Dashboard Vercel:

1. `GOOGLE_GENAI_API_KEY`: API Key dari Google AI Studio.
2. `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`: Client Key Midtrans (Mode Sandbox atau Production).

---
© 2024 Aulia Store. Dibangun dengan fokus pada kualitas, inovasi, dan keamanan fashion.
