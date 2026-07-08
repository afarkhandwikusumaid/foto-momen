# 📸 Foto Momen

Web photobooth interaktif yang cepat, ceria, dan ekspresif — dibuat untuk Gen Z yang ingin menangkap momen seru secara instan dan langsung membagikannya.

**Link Website:** [fotomomen.studio](https://fotomomen.studio)

---

## ✨ Tentang Proyek

Foto Momen adalah aplikasi photobooth digital berbasis browser (tanpa perlu install apapun) yang dirancang agar pengalaman dari mendarat di landing page sampai mengambil foto pertama terasa instan dan tanpa hambatan. Fokus utamanya:

- **Instan** — cepat, responsif, minim gesekan.
- **Ekspresif** — memberi ruang bagi pengguna untuk berkreasi lewat frame, filter, dan efek.
- **Playful** — penuh warna, micro-interaction, dan feedback visual yang menyenangkan (confetti, animasi, dsb).

Target pengguna utama adalah Gen Z yang ingin mengabadikan momen saat acara, kumpul bareng teman, atau untuk dibagikan ke media sosial — baik dari HP maupun desktop.

## 🚀 Fitur Utama

- 📷 **Capture langsung dari webcam** menggunakan `react-webcam`.
- 🖼️ **Export hasil foto** ke format gambar (JPEG/PNG) maupun **GIF** (`gifenc`, `jpeg-js`, `pngjs`).
- 🔗 **Bagikan hasil foto lewat QR Code** (`qrcode`) sehingga mudah diakses dari perangkat lain.
- 🎉 **Micro-interaction & animasi** dengan `framer-motion` dan efek confetti (`canvas-confetti`) untuk memperkuat kesan playful.
- 🗄️ **Penyimpanan & galeri foto** menggunakan **Supabase** sebagai backend.
- 🔐 **Admin dashboard** yang dilindungi password sederhana untuk mengelola data.
- 🔔 Notifikasi/dialog interaktif dengan `sweetalert2`.
- 📱 **Responsif penuh** — nyaman digunakan dengan satu tangan di HP (portrait) maupun di layar lebar desktop.

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| UI Library | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / Data | Supabase (`@supabase/supabase-js`) |
| Animasi | Framer Motion, canvas-confetti |
| Media Processing | react-webcam, gifenc, jpeg-js, pngjs |
| Lainnya | qrcode, sweetalert2, lucide-react |
| Deployment | Vercel |

## 🎨 Design System

Proyek ini punya design system tersendiri — lihat [`DESIGN.md`](./DESIGN.md) untuk detail lengkap warna, tipografi, komponen, dan aturan visual ("The Playful Portal"). Ringkasnya:

- **Warna utama:** Electric Blue `#1d90ff`, dengan aksen Neon Cyan `#06b6d4` dan Vivid Violet `#8b5cf6`.
- **Tipografi:** Poppins (display & body), Space Mono (label/monospace).
- **Bentuk:** tombol kapsul (`rounded-full`), panel kartu dengan efek glassmorphism.
- **Prinsip:** *Show, Don't Tell* — minim teks, maksimal visual.

Konteks produk dan target pengguna lebih lengkap ada di [`PRODUCT.md`](./PRODUCT.md).

## 📦 Instalasi & Menjalankan Secara Lokal

### Prasyarat

- [Node.js](https://nodejs.org/) (disarankan versi LTS terbaru)
- Akun & project [Supabase](https://supabase.com/) (untuk fitur penyimpanan foto)

### Langkah-langkah

1. **Clone repo ini**

   ```bash
   git clone https://github.com/afarkhandwikusumaid/foto-momen.git
   cd foto-momen
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Siapkan environment variables**

   Salin `.env.example` menjadi `.env.local`, lalu isi dengan kredensial milikmu:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL="URL_SUPABASE_KAMU"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="ANON_KEY_SUPABASE_KAMU"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   NEXT_PUBLIC_ADMIN_PASSWORD="password_admin_kamu"
   ```

4. **Setup database Supabase**

   Jalankan isi file [`supabase_schema.sql`](./supabase_schema.sql) di SQL Editor project Supabase kamu untuk membuat tabel yang dibutuhkan.

5. **Jalankan development server**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

### Script yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server development (dengan Turbopack) |
| `npm run build` | Build untuk production |
| `npm run start` | Menjalankan hasil build production |
| `npm run lint` | Menjalankan linter |
| `npm run clean` | Menghapus folder `.next` |

## 📁 Struktur Proyek (Ringkas)

```
foto-momen/
├── public/              # Aset statis
├── src/                 # Source code aplikasi (komponen, halaman, logic)
├── supabase_schema.sql  # Skema database Supabase
├── DESIGN.md            # Design system lengkap
├── PRODUCT.md           # Product brief & target pengguna
├── metadata.json
└── vercel.json           # Konfigurasi deployment Vercel
```

## 🌐 Deployment

Aplikasi ini di-deploy menggunakan [Vercel](https://vercel.com/). Untuk deploy versi sendiri, hubungkan repo ini ke Vercel dan tambahkan environment variables yang sama seperti di atas pada dashboard project Vercel.

## 🤝 Kontribusi

Proyek ini masih dikembangkan secara personal. Saran dan masukan tetap terbuka lewat *Issues* atau *Pull Request*.

## 📄 Lisensi

Belum ditentukan lisensinya. Hubungi pemilik repo untuk informasi penggunaan lebih lanjut.
