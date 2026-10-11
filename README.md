# IKAMAYOGA

> **Alumni Community Platform for MAN 3 Sleman Yogyakarta**  
> *Tagline: Connect. Share. Grow. Remember.*

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016%20(React%2019)-black?logo=next.js)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Backend-Laravel%2012%20(PHP%208.4)-red?logo=laravel)](https://laravel.com/)
[![Filament](https://img.shields.io/badge/Admin%20Panel-Filament%20v3-orange?logo=filament)](https://filamentphp.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-blue?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Cache%20%26%20Queue-Redis%207-critical?logo=redis)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

**IKAMAYOGA** adalah platform digital terpadu untuk komunitas Ikatan Alumni MAN 3 Sleman (MAYOGA) lintas angkatan. Platform ini dirancang bukan sekadar sebagai buku profil alumni statis, melainkan sebagai ekosistem digital hidup yang memfasilitasi temu kangen, jejaring karir dan profesional, forum diskusi terkurasi, pusat warta madrasah, agenda kegiatan, galeri arsip kenangan, serta kolaborasi bisnis alumni secara terstruktur, modern, dan aman.

---

## 🎯 Prinsip Produk (Product Principles)

Berdasarkan PRD, pengembangan IKAMAYOGA mematuhi lima prinsip inti:

1. **Community First**: Antarmuka dirancang hangat, editorial, dan ramah pengguna, bukan sekadar dashboard korporat yang kaku.
2. **Privacy First**: Alumni memiliki kendali penuh atas privasi data kontak, media sosial, dan visibilitas profil (*Public*, *Alumni Only*, atau *Private*).
3. **Modular & Scalable**: Setiap fitur terisolasi dengan rapi sehingga dapat dikembangkan bertahap tanpa merombak fondasi arsitektur.
4. **Production Ready**: Standarisasi penulisan kode, penanganan error, validasi form request, keamanan CORS, dan containerization siap pakai untuk level produksi.
5. **Avoid Overengineering**: Menggunakan arsitektur *Modular Monolith* yang efisien, tanpa kerumitan microservices yang berlebihan sebelum dibutuhkan.

---

## 🚀 Fitur & Modul Utama

Sistem IKAMAYOGA terdiri dari modul-modul terpadu yang memenuhi seluruh sasaran produk:

### 1. Beranda Interaktif & Navigasi Adaptif (Hero & Navigation)
- **Aurora Hero Section**: Tampilan beranda modern dengan efek *aurora background*, *dot pattern*, dan *animated gradient text* khas Velora UI.
- **Adaptive Floating Navbar**: Navigasi transparan dengan blur saat di puncak halaman, bertransformasi mulus menjadi *floating pill navbar* saat digulir (*scroll*). Dilengkapi hamburger drawer responsif untuk perangkat mobile.
- **Icon Feature Grid**: Sorotan 6 modul utama komunitas dalam tata letak kartu yang responsif dengan efek visual *glow*.
- **Warta Pilihan & Carousel Alumni Pilihan**: Akses cepat ke berita terbaru dan profil alumni aktif langsung dari beranda.

### 2. Direktori & Profil Alumni Terverifikasi (Alumni Directory)
- **Pencarian Multi-parameter**: Filter alumni berdasarkan nama, tahun kelulusan, kelas angkatan, kota domisili, dan profesi kerja.
- **Profil Komprehensif**: Menampilkan bio, riwayat pendidikan, rekam jejak karir/pengalaman, keahlian (*skills*), tautan media sosial, serta badge verifikasi madrasah.
- **Manajemen Privasi Mandiri**: Alumni dapat mengedit data diri dan mengatur tingkat visibilitas profil secara mandiri.

### 3. Forum Diskusi Komunitas Berantai (Threaded Community Forum)
- **Pengelompokan Berbasis Kategori**: Diskusi terorganisasi dalam kanal kategori (Diskusi Umum, Peluang Karir, Info Kampus, Wirausaha, dsb.).
- **Threaded Nested Replies**: Tanggapan berantai bertingkat (*parent-child replies*) dengan garis konektor visual yang intuitif.
- **Tautan Langsung & Highlight**: Dukungan tautan langsung ke balasan tertentu (`#reply-{id}`) dengan highlight warna otomatis.
- **Fitur Interaksi**: Sistem apresiasi suka (*likes*), simpan diskusi (*bookmarks*), dan modal berbagi topik (*Share Dialog*).
- **Akses Terproteksi (Guarded Screen)**: Topik khusus anggota dilindungi tampilan *guarded blur* dengan modal interaktif yang mengarahkan tamu untuk masuk terlebih dahulu.
- **Laporan Pelanggaran**: Alumni dapat melaporkan konten spam atau ujaran tidak pantas ke tim moderator.

### 4. Warta Berita & Kabar Madrasah (News & Editorial)
- **Pusat Informasi Terkini**: Artikel berita kegiatan madrasah, prestasi siswa, dan kabar ikatan alumni.
- **Detail Berita Terstruktur**: Informasi waktu baca (*read time*), profil penulis divisi publikasi, tagar, dan kategori.
- **Komentar Interaktif**: Ruang tanggapan pembaca yang terintegrasi langsung dengan backend API.

### 5. Agenda & Manajemen Acara (Events & RSVP)
- **Jadwal Kegiatan Komunitas**: Informasi agenda reuni, webinar karir, baksos, dan workshop (luring maupun daring via Zoom/Google Meet).
- **Pendaftaran RSVP**: Konfirmasi kehadiran alumni dengan penghitung kuota peserta otomatis.

### 6. Galeri & Arsip Digital Kenangan (Digital Archive & Apple Cards)
- **Koleksi Dokumentasi Kegiatan**: Album foto kenangan tempo dulu, dokumentasi reuni akbar, dan rekam jejak madrasah.
- **Apple Cards Carousel**: Komponen kartu interaktif modern dengan dukungan navigasi geser (*scrolling carousel*) dan modal pratinjau foto resolusi tinggi.

### 7. Kisah & Testimoni Alumni (Alumni Stories & Wall of Love)
- **Infinite Testimonials Marquee**: Deretan testimoni alumni lintas generasi yang bergerak otomatis dua arah (*smooth marquee*).
- **Formulir Testimoni Interaktif**: Modal pengiriman cerita inspiratif alumni untuk kurasi publikasi.

### 8. Pesan Pribadi (Direct Messages) & Notifikasi Terpusat
- **Komunikasi Privat Asinkron**: Fasilitas kirim pesan pribadi antaralumni tanpa harus membagikan kontak personal.
- **Sistem Notifikasi Terpadu**: Indikator lonceng notifikasi untuk memantau pesan masuk dan balasan diskusi forum baru.

### 9. Panel Administrasi & Moderasi (Filament v3 Suite)
- **Dashboard Eksekutif**: Ringkasan metrik statistik pertumbuhan alumni, interaksi forum, dan laporan pengguna.
- **Verifikasi Ijazah & Alumni**: Peninjauan berkas pendaftaran alumni baru dengan alur persetujuan (*approve*) atau penolakan (*reject*).
- **Moderasi Forum & Laporan**: Penanganan tiket laporan konten dengan tindakan hapus balasan, kunci topik, atau penangguhan akun.
- **Manajemen Konten Lengkap**: Pengelolaan berita, agenda acara, kategori forum, dan galeri dokumentasi.

---

## 👥 Matriks Hak Akses (Role-Based Access Control)

| Modul / Kemampuan | Tamu (Guest) | Alumni Terdaftar | Moderator | Administrator |
| :--- | :---: | :---: | :---: | :---: |
| Akses Beranda, Berita, & Arsip Publik | ✅ | ✅ | ✅ | ✅ |
| Melihat Direktori Alumni Publik | ✅ | ✅ | ✅ | ✅ |
| Membaca Topik Forum Publik | ✅ | ✅ | ✅ | ✅ |
| Membuka Topik Khusus Member (*Guarded*) | ❌ (Blur modal) | ✅ | ✅ | ✅ |
| Membuat Topik Forum & Membalas Diskusi | ❌ | ✅ | ✅ | ✅ |
| Memberikan Suka (*Like*) & Bookmark | ❌ | ✅ | ✅ | ✅ |
| Mengirim Pesan Pribadi (*Direct Message*) | ❌ | ✅ | ✅ | ✅ |
| Mengatur Profil, Karir, & Privasi Sendiri | ❌ | ✅ | ✅ | ✅ |
| Mengirim Laporan Konten (*Report*) | ❌ | ✅ | ✅ | ✅ |
| Menutup / Mengunci Diskusi Forum | ❌ | ❌ | ✅ | ✅ |
| Menindaklanjuti Laporan Moderasi | ❌ | ❌ | ✅ | ✅ |
| Verifikasi Data & Ijazah Alumni Baru | ❌ | ❌ | ❌ | ✅ |
| Akses Penuh Panel Backend Filament | ❌ | ❌ | Khusus Moderasi | ✅ (Super Admin) |

---

## 🛠️ Arsitektur & Teknologi

```text
                                M3S CONNECT
                         Alumni Community Platform
                                     |
                       +-------------+-------------+
                       |                           |
                       v                           v
               +---------------+           +---------------+
               |    Vercel     |           |      VM       |
               |               |           |               |
               |  Next.js 16   |--- REST ->| Nginx Proxy   |
               |  React 19     |  (HTTPS)  | Laravel 12    |
               |  Tailwind v4  |           | Filament v3   |
               |  TypeScript   |           | PHP 8.4-FPM   |
               +---------------+           +-------+-------+
                                                   |
                                     +-------------+-------------+
                                     |                           |
                                     v                           v
                              +--------------+            +--------------+
                              |  PostgreSQL  |            |    Redis     |
                              |   Version 16 |            |  Version 7   |
                              +--------------+            +--------------+
```

### Frontend Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components, TypeScript)
- **Library Inti**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components & Motion**: [Velora UI](https://velora.colorlib.com/), [Radix UI Primitives](https://www.radix-ui.com/), Framer Motion
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Client Networking**: Centralized API helper dengan penanganan otomatis `NEXT_PUBLIC_API_URL`

### Backend Stack
- **Framework**: [Laravel 12](https://laravel.com/)
- **Runtime**: PHP 8.4 Alpine Linux Container
- **Panel Pengelola**: [Filament v3](https://filamentphp.com/)
- **Autentikasi API**: Laravel Sanctum
- **Kepatuhan Standar**: PSR-12, Laravel Pint, PHPUnit 11

### Database & Infrastruktur
- **Database Relasional**: PostgreSQL 16 (Primary Key UUID, indexing terstruktur
- **Cache & Session**: Redis 7
- **Kontainerisasi**: Docker & Docker Compose (Port host terisolasi ke `127.0.0.1`)
- **Reverse Proxy**: Nginx Host aaPanel dengan sertifikat SSL Let's Encrypt otomatis

---

## 📁 Struktur Direktori Repositori

```text
m3s-connect/
├── backend/                       # Layanan Backend Laravel 12 & Panel Filament
│   ├── app/                       # Model, Controller, Service, Enum, & Resource API
│   │   ├── Enums/                 # PHP Enums (Role, Status, Visibility, dsb.)
│   │   ├── Filament/              # Resource & Halaman Panel Admin Filament
│   │   ├── Http/Controllers/Api/  # REST API Controller terstruktur
│   │   └── Models/                # Eloquent Models dengan relasi UUID
│   ├── bootstrap/                 # Bootstrap aplikasi & konfigurasi Trusted Proxy
│   ├── config/                    # Konfigurasi CORS, database, auth, dsb.
│   ├── database/                  # Migrasi skema database & Seeder komprehensif
│   ├── routes/                    # Definisi rute API (v1) & Web
│   └── tests/                     # Unit & Feature Test Suite
├── frontend/                      # Aplikasi Frontend Next.js 16
│   ├── public/                    # Aset statis gambar, logo, dan foto dokumentasi
│   └── src/
│       ├── app/                   # Rute halaman Next.js App Router
│       │   ├── (auth)/            # Autentikasi modern (Login & Register)
│       │   ├── alumni/            # Direktori & Profil Detail Alumni
│       │   ├── archive/           # Galeri Arsip & Dokumentasi Foto
│       │   ├── events/            # Agenda Acara & Detail Kegiatan
│       │   ├── forum/             # Threaded Community Forum
│       │   └── news/              # Warta Berita & Kabar Madrasah
│       ├── components/            # Komponen antarmuka (Velora, UI Primitives, dsb.)
│       ├── data/                  # Schema tipe data & fallback data
│       └── lib/                   # Helper API terpusat, utils, & asset resolver
├── docker/                        # Konfigurasi Dockerfile PHP 8.4 & Nginx
├── docs/                          # Dokumentasi Kontrak Spesifikasi Produk (PRD)
│   ├── API.md                     # Kontrak REST API JSON v1
│   ├── ERD.md                     # Skema Database & Relasi Entitas
│   ├── RBAC.md                    # Matriks Wewenang & Otorisasi Peran
│   └── UI-UX.md                   # Panduan Desain & Pengalaman Pengguna
├── PROJECT_SPEC.md                # Dokumen Visi & Spesifikasi Tingkat Tinggi
├── docker-compose.yml             # Orkestrasi Docker (Postgres, Redis, PHP, Nginx)
└── README.md                      # Dokumentasi Utama Repositori
```

---

## 💻 Panduan Instalasi Lokal (Local Development)

### Prasyarat
- [Node.js](https://nodejs.org/) v20+ dan npm
- [Docker Desktop](https://www.docker.com/) atau Docker Engine + Docker Compose
- [PHP](https://www.php.net/) 8.2+ dan [Composer](https://getcomposer.org/) (opsional jika menjalankan langsung via host)

### 1. Kloning Repositori
```bash
git clone https://github.com/tepe77/m3s-connect.git
cd m3s-connect
```

### 2. Jalankan Layanan Docker
Jalankan PostgreSQL, Redis, Backend PHP-FPM, dan Nginx container:
```bash
docker compose up -d --build
```

### 3. Inisialisasi Backend Laravel
Masuk ke container backend untuk instalasi dependensi dan migrasi basis data:
```bash
# Salin konfigurasi environment
cp backend/.env.example backend/.env

# Install dependensi Composer di dalam container
docker compose exec backend composer install

# Buat Application Key
docker compose exec backend php artisan key:generate

# Pastikan permission folder storage dan cache terbuka
docker compose exec backend chmod -R 777 storage bootstrap/cache

# Jalankan migrasi dan seeding data awal
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan db:seed --force
docker compose exec backend php artisan storage:link
```

### 4. Jalankan Frontend Next.js
Buka terminal baru di direktori `frontend`:
```bash
cd frontend
npm install
npm run dev
```

Aplikasi frontend akan aktif di `http://localhost:3000`.

---

## 🌐 Endpoint & Akun Bawaan (Default Credentials)

### Port & Endpoint Lokal

| Layanan | Alamat Lokal | Keterangan |
| :--- | :--- | :--- |
| **Frontend Web** | `http://localhost:3000` | Antarmuka pengguna Next.js 16 |
| **REST API Backend** | `http://localhost:8000/api/v1` | Endpoint API Publik & Anggota |
| **Panel Admin Filament** | `http://localhost:8000/admin` | Dashboard pengelola madrasah |
| **PostgreSQL** | `localhost:5432` (127.0.0.1) | Basis data relasional utama |
| **Redis** | `localhost:6380` (127.0.0.1) | Cache & session broker |

### Akun Bawaan Seeding (Demo Credentials)

| Peran (Role) | Alamat Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@m3s-connect.id` | `Password123!` | Akses penuh Panel Filament & Sistem |
| **Moderator** | `moderator@m3s-connect.id` | `Password123!` | Moderasi forum & tiket laporan |
| **Alumni (Contoh 1)** | `siti.nurhaliza@alumni.m3s.id` | `Password123!` | Profil alumni verified (IT/Software) |
| **Alumni (Contoh 2)** | `ahmad.fauzi@alumni.m3s.id` | `Password123!` | Profil alumni verified (Akademisi) |

---

## 🚀 Panduan Deployment Produksi

### Arsitektur Subdomain
- **Frontend**: `alumni.mayoga.sch.id` (Dihosting di Vercel)
- **Backend API**: `api-alumni.mayoga.sch.id` (Dihosting di VM aaPanel via Docker)

### 1. Setup Frontend di Vercel
1. Import repositori GitHub `tepe77/m3s-connect` ke Vercel.
2. Tentukan **Root Directory**: `frontend`.
3. Tambahkan **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://api-alumni.mayoga.sch.id/api/v1
   NEXT_PUBLIC_BACKEND_URL=https://api-alumni.mayoga.sch.id
   ```
4. Tambahkan custom domain `alumni.mayoga.sch.id` dan arahkan CNAME ke `cname.vercel-dns.com`.

### 2. Setup Backend di VM
1. Clone repositori ke `/www/wwwroot/m3s-connect` di VM.
2. Konfigurasikan file `.env` di root dan `backend/.env` dengan `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://api-alumni.mayoga.sch.id`, dan kredensial database.
3. Jalankan container:
   ```bash
   docker compose up -d --build
   docker compose exec backend composer install --no-dev --optimize-autoloader
   docker compose exec backend php artisan key:generate
   docker compose exec backend php artisan migrate --force
   docker compose exec backend php artisan db:seed --force
   docker compose exec backend php artisan storage:link
   ```
4. Di dashboard aaPanel:
   - Buat Website baru dengan domain `api-alumni.mayoga.sch.id` (PHP version: static).
   - Terbitkan sertifikat SSL Let's Encrypt (Force HTTPS aktif).
   - Buat **Reverse Proxy** mengarah ke `http://127.0.0.1:8000` dengan target domain `$host`.

---

## 🧪 Validasi & Pengujian Mutu (Testing)

Pengujian dilakukan untuk menjamin kepatuhan tipe data dan keandalan fungsional API:

```bash
# Uji fungsional & integrasi backend Laravel
cd backend
php artisan test

# Validasi linting & formatting kode PHP
./vendor/bin/pint --test

# Validasi integritas TypeScript & compile frontend Next.js
cd ../frontend
npx tsc --noEmit
```

---
## 📄 Lisensi & Kontribusi

Sistem ini dikembangkan khusus sebagai platform resmi **Ikatan Alumni MAN 3 Sleman Yogyakarta (IKAMAYOGA)**. Seluruh hak cipta dan kepemilikan kode dilindungi untuk kemaslahatan keluarga besar alumni madrasah.
