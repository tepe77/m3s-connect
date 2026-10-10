# M3S Connect (IKAMAYOGA)

> **Platform Komunitas & Ekosistem Digital Alumni MAN 3 Sleman Yogyakarta**

M3S Connect adalah platform terpadu untuk menghubungkan alumni MAN 3 Sleman (MAYOGA) lintas angkatan. Platform ini memfasilitasi interaksi komunitas, jejaring karir dan bisnis, diskusi berantai, dokumentasi kegiatan, serta pengelolaan data alumni secara terstruktur dan aman.

---

## 🚀 Fitur Utama

- **Portal Komunitas & Hero Interaktif**: Antarmuka beranda modern dengan navigasi adaptif (*frosted glassmorphism* & *compact floating pill*), statistik anggota, serta sorotan fitur utama.
- **Forum Diskusi Berantai (*Threaded Forum*)**:
  - Pengelompokan topik berbasis kategori.
  - Tanggapan diskusi berantai multi-tingkat (*parent-child replies*) dengan indikator konektor visual.
  - Tautan langsung ke balasan tertentu (`#reply-{id}`) dengan highlight otomatis.
  - Fitur berbagi topik (*Share Modal*) ke berbagai kanal media sosial dan salin tautan.
- **Akses Terproteksi & Guard Screen**: Topik khusus anggota dilindungi dengan tampilan *guarded blur* dan modal interaktif yang memandu pengunjung untuk login.
- **Pesan Pribadi (*Direct Messages*)**: Jalur komunikasi privat antaralumni secara langsung.
- **Sistem Notifikasi Terpusat**: Pemberitahuan instan untuk balasan diskusi forum maupun pesan pribadi, dengan indikator status baca (*read/unread*).
- **Panel Administrasi (*Filament Admin*)**: Dashboard pengelola untuk verifikasi data alumni, moderasi konten, dan manajemen peran (*role-based access control*).

---

## 🛠️ Tech Stack & Arsitektur

Platform dibangun menggunakan arsitektur **Decoupled / Modular Monolith** dengan pemisahan yang bersih antara antarmuka pengguna (Frontend) dan layanan data (Backend API).

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Komponen & Primitives**: [Radix UI](https://www.radix-ui.com/) (Dialog, Popover, Select, Tabs, Tooltip, Dropdown Menu)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Desain & Interaksi**: Modern Glassmorphism, Micro-animations, Accessible semantic markup

### Backend
- **Framework**: [Laravel 12](https://laravel.com/)
- **Runtime**: PHP 8.2+
- **Autentikasi API**: Laravel Sanctum
- **Admin Panel**: [Filament v3](https://filamentphp.com/)
- **Testing**: PHPUnit 11 (Unit & Feature Test Suite)
- **Code Style**: Laravel Pint

### Database & Infrastruktur
- **Database Relasional**: PostgreSQL 16
- **Cache & Message Broker**: Redis 7
- **Kontainerisasi**: Docker & Docker Compose (Nginx, PHP-FPM, PostgreSQL, Redis)

---

## 📁 Struktur Direktori

```text
m3s-connect/
├── backend/                  # REST API Laravel 12 & Panel Filament
│   ├── app/                  # Controllers, Models, Policies, Services
│   ├── database/             # Migrasi & Schema Database
│   ├── routes/               # API & Web Routes
│   └── tests/                # Test Suite (Feature & Unit)
├── frontend/                 # Antarmuka Pengguna Next.js 16
│   ├── public/               # Asset statis, gambar, dan ikon
│   └── src/
│       ├── app/              # Halaman Next.js App Router
│       ├── components/       # Komponen UI (Forum, Layout, Velora, dsb.)
│       ├── data/             # Mock data & konfigurasi lokal
│       └── lib/              # Utilitas & helper function
├── docker/                   # Konfigurasi container Nginx & Dockerfile
├── docker-compose.yml        # Orkestrasi database & layanan pendukung
└── README.md                 # Dokumentasi utama repositori
```

---

## 💻 Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 20 atau lebih baru)
- [PHP](https://www.php.net/) (versi 8.2 atau lebih baru) & [Composer](https://getcomposer.org/)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Menjalankan Layanan Docker (Database & Cache)

Jalankan database PostgreSQL dan Redis di latar belakang:

```bash
docker compose up -d
```

### 2. Setup Backend (Laravel)

Buka terminal pada direktori `backend`:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
```

Backend API akan aktif di `http://localhost:8000`.

### 3. Setup Frontend (Next.js)

Buka terminal baru pada direktori `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Aplikasi frontend akan aktif di `http://localhost:3000`.

---

## 🌐 Endpoint & Port Default

| Layanan | Alamat / Port | Keterangan |
| :--- | :--- | :--- |
| **Frontend App** | `http://localhost:3000` | Antarmuka pengguna M3S Connect |
| **Backend API** | `http://localhost:8000/api/v1` | Endpoint REST API |
| **Filament Admin** | `http://localhost:8000/admin` | Panel pengelola dan moderasi |
| **PostgreSQL** | `localhost:5432` | Basis data utama |
| **Redis** | `localhost:6380` | Cache dan antrean sistem |

---

## 🧪 Menjalankan Pengujian (Testing)

Untuk memastikan keandalan API backend dan alur autentikasi/notifikasi:

```bash
cd backend
php artisan test
```

Untuk memvalidasi integritas tipe data TypeScript pada frontend:

```bash
cd frontend
npx tsc --noEmit
```

---

## 📄 Lisensi

Dikembangkan untuk komunitas alumni MAN 3 Sleman Yogyakarta (IKAMAYOGA).
