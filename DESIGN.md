---
name: Foto Momen
description: Web Photobooth interaktif yang cepat, ceria, dan ekspresif untuk Gen Z.
colors:
  primary: "#1d90ff"
  primary-dark: "#1e40af"
  brand-dark: "#0f172a"
  bg-light: "#f8fafc"
  cyan-accent: "#06b6d4"
  violet-accent: "#8b5cf6"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "Space Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  panel-preview:
    backgroundColor: "rgba(255, 255, 255, 0.75)"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Foto Momen

## 1. Overview

**Creative North Star: "The Playful Portal"**

Foto Momen didesain sebagai sebuah pintu gerbang interaktif yang menangkap keceriaan instan lewat warna-warni cerah, efek cahaya halus, dan navigasi yang sangat mulus. Desain ini ditujukan untuk Gen Z yang menghargai keindahan visual, kecepatan proses, dan kemudahan dalam mengekspresikan diri.

Sistem desain ini secara tegas menolak antarmuka yang kaku seperti aplikasi korporat, teks penjelasan yang terlalu panjang, dan animasi yang lamban atau berat. Sebagai gantinya, kami berfokus pada layout bergaya modern dengan tombol kapsul (*rounded-full*), pratinjau foto yang dominan, serta panel interaktif semi-transparan (*glassmorphism*).

**Key Characteristics:**
- **Energetik & Ceria**: Menggunakan perpaduan warna biru laut, cyan neon, dan sentuhan violet.
- **Snappy & Instan**: Transisi cepat dan efisien agar proses foto terasa instan.
- **Visual-First**: Penjelasan minimal, mengandalkan pratinjau grafis dan ikonografi yang intuitif.

## 2. Colors

Menggunakan warna biru elektrik sebagai jangkar utama, didukung oleh aksen cyan dan violet neon pada background gradasi dinamis untuk menciptakan kesan ceria dan hidup.

### Primary
- **Electric Blue** (#1d90ff): Warna aksi utama untuk tombol primer, elemen aktif, dan branding inti.

### Neutral
- **Brand Dark** (#0f172a): Digunakan untuk teks utama, footer, dan area dengan kontras tinggi.
- **Slate Light** (#f8fafc): Latar belakang halaman dasar, dipadukan dengan gradasi pancaran warna (*radial glow*).

### Accent
- **Neon Cyan** (#06b6d4): Warna aksen gradasi yang memancarkan energi muda dan segar.
- **Vivid Violet** (#8b5cf6): Sentuhan warna sekunder untuk kedalaman visual latar belakang.

### Named Rules
**The 10% Accent Rule.** Warna neon cyan dan violet hanya digunakan sebagai aksen latar belakang atau efek hover (maksimal 10% dari total luas permukaan layar) agar tidak membuat mata pengguna lelah.

## 3. Typography

**Display Font:** Poppins, sans-serif
**Body Font:** Poppins, sans-serif
**Label/Mono Font:** Space Mono, monospace

### Hierarchy
- **Display** (Bold, clamp(2rem, 6vw, 3.5rem), 1.1): Digunakan untuk judul utama landing page (*Hero text*).
- **Headline** (Semi-Bold, 1.75rem, 1.2): Digunakan untuk judul bagian/seksi halaman.
- **Title** (Medium, 1.25rem, 1.3): Digunakan pada header card, label menu, dan pratinjau frame.
- **Body** (Regular, 1rem, 1.5): Digunakan untuk teks panduan singkat (maksimal 65ch per baris).
- **Label** (Medium, 0.875rem, normal): Digunakan untuk keterangan tombol kecil dan tag status.

## 4. Elevation

Kedalaman antarmuka disampaikan melalui layering warna dan efek pembiasan cahaya kaca (*glassmorphism*), bukan melalui bayangan gelap yang pekat.

### Shadow Vocabulary
- **Soft Glow** (`drop-shadow(0px 8px 24px rgba(29, 144, 255, 0.12))`): Memberikan kesan elemen melayang ringan di atas cahaya latar belakang.

### Named Rules
**The Flat-By-Rest Rule.** Semua kartu dan tombol berbaring rata (*flat*) pada posisinya di kondisi diam. Efek bayangan atau kenaikan visual hanya muncul ketika kursor melakukan hover atau elemen dalam keadaan aktif.

## 5. Components

### Buttons
- **Shape:** Rounded-full (kapsul) untuk kenyamanan menekan di ponsel.
- **Primary:** Background biru elektrik, teks putih, transisi snappy 150ms dengan kurva kemudahan (`cubic-bezier(0.16, 1, 0.3, 1)`).

### Photo Cards & Panels
- **Shape:** Sudut tumpul besar (`rounded-lg` / `rounded-xl`).
- **Surface:** Efek premium glass dengan opacity putih 75%, blur latar belakang 16px, dan garis tepi tipis semi transparan (`border-white/50`).

## 6. Do's and Don'ts

### Do's
- Gunakan transisi cepat (`duration-150` atau `duration-200`) untuk respon tombol.
- Jaga area tombol interaktif tetap besar (minimal 48px tinggi/lebar) untuk kenyamanan jari.
- Pastikan teks di atas latar belakang gradasi memiliki kontras yang cukup tinggi (misalnya menambahkan overlay gelap tipis jika diperlukan).

### Don'ts
- **DILARANG** menggunakan garis pembatas tebal berwarna kusam (*dirty borders*).
- **DILARANG** menyertakan teks instruksi lebih dari 3 baris di halaman photobooth; buat visualnya menjelaskan dirinya sendiri.
- **DILARANG** menggunakan sudut tajam siku-siku (90 derajat) pada tombol utama maupun panel interaktif.
