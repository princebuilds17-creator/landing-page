# PRINCE LAB — Digital Project Studio & Tech Brand Platform

> **Tagline:** *Learn. Build. Share.*  
> **Identitas Visual:** Dark Tech Premium (`#101116`, `#1B1C25`, `#F5F5F7`, `#9B8AFF`, aksen sekunder `#72E6B1`).

Website resmi dan platform manajemen konten untuk **PRINCE LAB**, sebuah personal tech brand sekaligus digital project studio yang dirancang khusus bagi mahasiswa IT (*IT students*) dan pengembang pemula. Platform ini mengusung pendekatan rekayasa perangkat lunak yang transparan: mempelajari konsep dasar, membangun modul/produk nyata, dan membagikan prosesnya melalui kanal sosial terdistribusi.

---

## 🌟 Fitur Utama

### 1. Website Publik
- **Beranda (`/`)**:
  - Hero dengan wordmark, tagline *Learn. Build. Share.*, serta positioning statement terverifikasi.
  - Bagian filosofi dan ruang belajar "Tentang PRINCE LAB".
  - **Ekosistem Brand PRINCE**: Menjelaskan keterhubungan antara studio rekayasa, kanal personal founder (`@prince.builds`), kanal rilis resmi (`@princee.lab`), dan katalog terbuka.
  - **Proyek Pilihan**: Menampilkan proyek terkurasi berstatus `published`.
  - **Content Cards Terdistribusi**: Kartu konten Instagram multi-publisher dengan thumbnail, ringkasan, dan tautan keluar langsung ke postingan spesifik.
  - Footer lengkap dengan hak cipta dan navigasi cepat.
- **Katalog Proyek (`/projects`)**:
  - Daftar lengkap proyek aktif yang telah dipublikasikan.
  - Filter kategori (*Web Development*, *Design System*, *Backend Fundamentals*, dsb.).
  - Empty state informatif jika belum ada proyek terbit.
- **Detail Proyek (`/projects/[slug]`)**:
  - Spesifikasi arsitektur teknis, ringkasan, dan modul sistem.
  - Media ilustrasi dengan atribut *alt text* aksesibel (standar WCAG 2.2 AA).
  - Tautan eksternal terverifikasi ke demo atau repositori.
  - Content cards terkait yang langsung terhubung ke Instagram rilis fitur.
  - **Proteksi Privasi:** Proyek berstatus draft otomatis mengembalikan `404 Not Found` pada rute publik untuk mencegah kebocoran data.
- **Halaman 404 (`not-found.tsx`)**:
  - Desain dark tech konsisten dengan tautan cepat kembali ke beranda dan katalog.

### 2. Dashboard Admin Studio
- **Autentikasi Aman (`/admin/login`)**:
  - Proteksi sesi berbasis cookie server-side `HttpOnly` (`prince_admin_session`).
  - *Rate-limiting* mitigasi serangan *brute force* (maksimal 5 percobaan gagal).
  - Pesan error generik yang tidak membocorkan keberadaan akun.
- **Ringkasan Studio (`/admin`)**:
  - Metrik riil jumlah proyek *published* vs *draft*.
  - Metrik jumlah *content cards* *published* vs *draft*.
  - Penghitung kunjungan halaman dan pelacak klik keluar (*outbound click*) ke Instagram.
  - Akses cepat pembuatan proyek baru dan content card.
- **Manajemen Proyek (`/admin/projects`)**:
  - Tabel dan kartu responsif (otomatis beralih ke layout kartu pada layar HP `< 768px`).
  - Pengurutan urutan tampil (*sort order*) menggunakan **tombol keyboard-accessible (Naik / Turun)** tanpa ketergantungan pada *drag-and-drop*.
  - Dialog konfirmasi hapus aman dengan deteksi relasi (menolak menghapus proyek yang masih terhubung dengan content card untuk mencegah penghapusan diam-diam).
- **Form Proyek (`/admin/projects/new` & `/admin/projects/[id]/edit`)**:
  - Field nama proyek, generator slug otomatis, ringkasan, dokumentasi Markdown, gambar, alt text, kategori, external URL, dan status publikasi (*Draft* / *Published*).
  - Peringatan saat meninggalkan form dengan perubahan yang belum disimpan (*Unsaved changes protection*).
  - Input pengguna tetap terjaga jika terjadi kesalahan validasi server.
- **Manajemen Content Cards (`/admin/content`)**:
  - Pengelolaan kartu Instagram dengan pemisahan nama akun *publisher* (contoh: `@princee.lab`, `@prince.builds`) dan URL postingan spesifik.
  - Validasi ketat format URL Instagram (protokol HTTPS dan domain resmi `instagram.com`).
  - Dropdown tautan proyek (opsional). Card yang ditautkan ke proyek draft otomatis disembunyikan dari halaman publik.
- **Pratinjau Draft (`/admin/preview`)**:
  - Area khusus administrator dengan *sticky contextual banner* untuk menguji coba tampilan publik dari konten berstatus draft sebelum diterbitkan.
  - Terproteksi dari mesin pencari dengan direktif `noindex, nofollow`.

---

## 🎨 Spesifikasi Desain & Aksesibilitas

- **Palet Warna**:
  - Canvas / Latar Utama: `#101116`
  - Surface / Kartu Kontainer: `#1B1C25`
  - Surface Elevated / Modal: `#232533`
  - Teks Utama: `#F5F5F7` (Kontras > 12:1)
  - Teks Sekunder / Muted: `#9DA3B4`
  - Aksen Utama (Violet): `#9B8AFF`
  - Aksen Sekunder / Status Sukses (Mint): `#72E6B1`
  - Status Draft (Amber): `#E5C07B`
  - Status Bahaya (Coral): `#FF6B6B`
- **Tipografi**:
  - Font Utama: *Plus Jakarta Sans*
  - Font Teknis / Metrik: *JetBrains Mono*
- **Aksesibilitas (WCAG 2.2 AA)**:
  - *Focus-visible rings* kontras tinggi (`focus-visible:ring-2 focus-visible:ring-primary`).
  - Target sentuh minimal 44x44 px pada antarmuka mobile.
  - Dukungan preferensi pengguna `prefers-reduced-motion`.
  - Teks alternatif informatif untuk seluruh media visual.
  - Tautan eksternal dilengkapi atribut `rel="noopener noreferrer"`.
  - Bebas horizontal scroll pada resolusi terkecil (320 px).

---

## 💻 Cara Menjalankan Aplikasi

### Kebutuhan Sistem
- **Node.js**: Versi 18.x atau lebih baru (Disarankan v20+ / v24+)
- **NPM**: Versi 9.x atau lebih baru

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan di Mode Pengembangan (Development)
```bash
npm run dev
```
Buka browser pada [http://localhost:3000](http://localhost:3000).

### 3. Kompilasi & Menjalankan Mode Produksi (Production)
```bash
npm run build
npm run start
```

### 4. Menjalankan Pengujian Otomatis (Acceptance Test Suite)
Pastikan server sedang berjalan di `http://localhost:3000`, kemudian pada terminal terpisah jalankan:
```bash
node scripts/test-acceptance.mjs
```

---

## 🔐 Kredensial Administrator Default (Sandbox)

Untuk keperluan pengujian lokal, akun administrator telah disiapkan secara bawaan:
- **Email:** `admin@princelab.id`
- **Kata Sandi:** `princeAdmin2026!`

*Catatan: Pada lingkungan produksi, kredensial dan secret sesi dapat diatur melalui variabel lingkungan `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET`.*

---

## 📂 Struktur Direktori Proyek

```
Prince/
├── public/
│   └── images/
│       ├── logo.png                # Logo resmi emblem PRINCE
│       └── teaser/                 # Aset grafis peluncuran (1.png, 2.png, 3.png)
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Beranda publik (/)
│   │   ├── not-found.tsx           # Halaman 404
│   │   ├── layout.tsx              # Root Layout & Metadata
│   │   ├── globals.css             # Tema warna & utilitas aksesibilitas
│   │   ├── robots.ts               # Direktif crawler SEO
│   │   ├── sitemap.ts              # Generator Sitemap dinamis publik
│   │   ├── projects/
│   │   │   ├── page.tsx            # Katalog proyek (/projects)
│   │   │   └── [slug]/page.tsx     # Detail proyek (/projects/[slug])
│   │   ├── admin/
│   │   │   ├── page.tsx            # Ringkasan dashboard (/admin)
│   │   │   ├── login/page.tsx      # Halaman login admin (/admin/login)
│   │   │   ├── preview/page.tsx    # Mode pratinjau draft (/admin/preview)
│   │   │   ├── projects/           # Manajemen daftar & form proyek
│   │   │   └── content/            # Manajemen daftar & form content cards
│   │   └── api/                    # API Endpoints (Admin CRUD, Auth, Analytics)
│   ├── components/
│   │   ├── public/                 # Komponen publik (Navbar, Footer, ProjectCard, ContentCardItem, EcosystemSection)
│   │   ├── admin/                  # Komponen admin (AdminNavbar, DeleteConfirmModal, ReorderControls, Forms)
│   │   └── icons/                  # Ikon visual SVG (InstagramIcon, dll)
│   ├── lib/
│   │   ├── auth.ts                 # Sesi admin, HMAC-SHA256, rate-limiting
│   │   ├── storage.ts              # Data layer & persistence JSON atomik
│   │   └── validation.ts           # Validasi URL Instagram, slug, dan sanitasi
│   ├── middleware.ts               # Guard proteksi rute /admin dan /api/admin/*
│   └── types/
│       └── index.ts                # TypeScript interfaces (Project, ContentCard, dll)
├── data/
│   └── prince_lab_data.json        # File database persisten lokal
├── scripts/
│   └── test-acceptance.mjs         # Skrip pengujian kriteria penerimaan otomatis
├── WEB/
│   └── PRD-PRINCE-LAB.md           # Product Requirements Document
├── tailwind.config.ts              # Konfigurasi token desain Tailwind
└── package.json
```

---

## 📋 Catatan Data & Konfigurasi Sebelum Peluncuran Produksi

1. **Konfirmasi Proyek Nyata**: Data proyek *MotoCheck*, *Portfolio Website*, dan *PHP Native Apps* saat ini berstatus *placeholder* untuk demonstrasi arsitektur. Sebelum peluncuran produksi, admin dapat mengedit atau menggantinya melalui dashboard.
2. **Kanal Instagram Resmi**: Akun resmi studio telah dikonfigurasi ke `@princee.lab` (`https://www.instagram.com/princee.lab/`). Pastikan URL postingan final selalu diperbarui melalui dashboard admin.
3. **Variabel Lingkungan Produksi**:
   - `ADMIN_EMAIL`: Alamat email resmi administrator
   - `ADMIN_PASSWORD`: Kata sandi administrator yang kuat
   - `ADMIN_SESSION_SECRET`: Kunci enkripsi sesi minimal 32 karakter
   - `COOKIE_SECURE=true`: Mewajibkan transmisi cookie hanya melalui HTTPS di server produksi
