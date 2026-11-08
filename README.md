# Muh. Rafli Ichsan — Minimalist Editorial Web Portfolio

Personal portfolio website untuk **Muh. Rafli Ichsan** (Fullstack Web Developer) yang dibangun dengan estetika *digital editorial magazine / typographic journal* dan animasi scroll sinematik yang halus.

---

## 🏛️ Arsitektur & Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, v14+) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan palet hangat editorial `#F2EFE9` & ink black `#0E0E0E`
- **Animation Engine**: [GSAP](https://greensock.com/) + ScrollTrigger + `@gsap/react` (`useGSAP`)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis) (tersinkronisasi penuh dengan `gsap.ticker`)
- **Overlay & Route Transition**: [Framer Motion](https://www.framer.com/motion/)
- **Typography**: `Instrument Serif` (Italic Display), `Inter Tight` (Sans Body), `JetBrains Mono` (Data & Meta) via `next/font/google`

---

## 🚀 Cara Menjalankan

### 1. Masuk ke Direktori Proyek
```bash
cd "C:\Users\ichsan\.gemini\antigravity\scratch\rafli-portfolio"
```

### 2. Instalasi Dependency
```bash
npm install
```

### 3. Jalankan Local Development Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 4. Build Production
```bash
npm run build
npm run start
```

---

## ✏️ Cara Mengganti Konten
Semua data teks, profil, statistik, pengalaman kerja, daftar prestasi, keahlian, studi kasus proyek, karya poster, dan link kontak tersimpan terpusat di satu file:
👉 `data/profile.ts`

Cukup cari placeholder bertanda `[ISI: ...]` dan ganti dengan data pribadi Anda:
- Nama sekolah & tahun lulus SMK RPL
- Nama perusahaan/klien saat ini
- Detail posisi & periode magang Transisi Media dan Pake-POS
- Link URL live demo & repositori GitHub proyek
- Alamat email, LinkedIn, dan akun media sosial

---

## 🌐 Cara Deploy ke Vercel
1. Unggah folder proyek ini ke repositori GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of editorial portfolio"
   git remote add origin https://github.com/Sanlinex/portfolio.git
   git branch -M main
   git push -u origin main
   ```
2. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
3. Klik **"Add New..."** → **"Project"** dan pilih repositori tersebut.
4. Framework Preset akan otomatis terdeteksi sebagai **Next.js**.
5. Klik **"Deploy"**. Dalam ~60 detik, website portofolio editorial Anda sudah online di domain gratis `https://your-name.vercel.app` atau domain kustom Anda.
