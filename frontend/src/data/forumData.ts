export interface ForumCategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  image: string;
  sortOrder: number;
  topicCount: number;
  postCount: number;
}

export interface ForumAuthor {
  id: string;
  name: string;
  avatar: string;
  graduationYear?: number;
  graduationClass?: string;
  occupation?: string;
  role: "alumni" | "admin" | "moderator";
}

export interface ForumParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  author: ForumAuthor;
  body: string;
  parentId?: string | null;
  parentAuthorName?: string | null;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  categoryColor: string;
  author: ForumAuthor;
  body: string;
  isPinned: boolean;
  isLocked: boolean;
  viewsCount: number;
  repliesCount: number;
  likesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  lastActivityAt: string;
  tags: string[];
  participants: ForumParticipant[];
  replies: ForumReply[];
}

export const FORUM_CATEGORIES: ForumCategoryData[] = [
  {
    id: "cat-1",
    name: "Diskusi Umum",
    slug: "diskusi-umum",
    description: "Ruang silaturahmi santai, kabar antar angkatan, dan obrolan bebas warga Mayoga.",
    color: "#0D9488",
    icon: "chat",
    image: "/images/hero-man3-sleman.jpg",
    sortOrder: 1,
    topicCount: 42,
    postCount: 284,
  },
  {
    id: "cat-2",
    name: "Karir & Profesi",
    slug: "karir-dan-profesi",
    description: "Lowongan kerja, info magang, review CV, dan peluang kolaborasi profesional alumni.",
    color: "#2563EB",
    icon: "briefcase",
    image: "/images/news-internasional.jpg",
    sortOrder: 2,
    topicCount: 38,
    postCount: 196,
  },
  {
    id: "cat-3",
    name: "Kegiatan & Reuni",
    slug: "kegiatan-dan-reuni",
    description: "Agenda temu kangen akbar, bakti sosial ramadan, silaturahmi angkatan, dan kepanitiaan.",
    color: "#D97706",
    icon: "calendar",
    image: "/images/news-reuni.jpg",
    sortOrder: 3,
    topicCount: 26,
    postCount: 215,
  },
  {
    id: "cat-4",
    name: "Beasiswa & Pendidikan",
    slug: "beasiswa-dan-pendidikan",
    description: "Informasi beasiswa S1/S2/S3 dalam dan luar negeri, tips seleksi, dan bimbingan studi.",
    color: "#7C3AED",
    icon: "academic",
    image: "/images/news-beasiswa.jpg",
    sortOrder: 4,
    topicCount: 31,
    postCount: 172,
  },
  {
    id: "cat-5",
    name: "Bisnis & UMKM",
    slug: "bisnis-dan-umkm",
    description: "Etalase usaha alumni, kemitraan rantai pasok, dan sharing strategi wirausaha.",
    color: "#059669",
    icon: "store",
    image: "/images/news-peluncuran.jpg",
    sortOrder: 5,
    topicCount: 20,
    postCount: 98,
  },
  {
    id: "cat-6",
    name: "Teknologi & Digital",
    slug: "teknologi-dan-inovasi",
    description: "Diskusi rekayasa perangkat lunak, AI, cloud computing, dan inisiatif digital madrasah.",
    color: "#DC2626",
    icon: "chip",
    image: "/images/doc-wisuda.jpg",
    sortOrder: 6,
    topicCount: 17,
    postCount: 89,
  },
];

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [
  {
    id: "topic-1",
    title: "Rencana Reuni Akbar Lintas Angkatan MAN 3 Sleman 2026: Pembentukan Panitia & Usulan Lokasi",
    slug: "rencana-reuni-akbar-lintas-angkatan-2026",
    categoryId: "cat-3",
    categorySlug: "kegiatan-dan-reuni",
    categoryName: "Kegiatan & Reuni",
    categoryColor: "#D97706",
    author: {
      id: "user-budi",
      name: "Budi Santoso",
      avatar: "/images/avatar-ahmad.jpg",
      graduationYear: 2018,
      graduationClass: "IPA 2",
      occupation: "Senior Backend Engineer",
      role: "alumni",
    },
    body: `Assalamu'alaikum Warahmatullahi Wabarakatuh rekan-rekan keluarga besar alumni MAN 3 Sleman (Mayoga).

Menyambut tahun 2026, ikatan alumni merencanakan perhelatan **Reuni Akbar Lintas Angkatan (1990 - 2025)** sebagai momentum mempererat tali ukhuwah dan meresmikan program beasiswa abadi alumni.

Melalui topik ini, kami membuka ruang diskusi terbuka untuk beberapa hal penting:
1. **Struktur Koordinator Angkatan:** Perwakilan 1 - 2 narahubung per angkatan.
2. **Usulan Venue Kegiatan:** Apakah lebih representatif diadakan di halaman utama kampus Mayoga atau sewa convention center di Yogyakarta?
3. **Format Agenda:** Sesi sarasehan inspiratif karir, panggung seni tradisi siswa-alumni, dan bazar UMKM alumni.

Silakan sampaikan pandangan, ide, dan kesediaan rekan-rekan untuk bergabung dalam kepanitiaan kerja. Terima kasih banyak atas dedikasinya!`,
    isPinned: true,
    isLocked: false,
    viewsCount: 1420,
    repliesCount: 4,
    likesCount: 38,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2026-10-02T08:30:00Z",
    lastActivityAt: "2026-10-06T11:45:00Z",
    tags: ["Reuni2026", "MayogaHebat", "Kepanitiaan", "Silaturahmi"],
    participants: [
      { id: "p-1", name: "Budi Santoso", avatar: "/images/avatar-ahmad.jpg" },
      { id: "p-2", name: "Siti Rahmawati", avatar: "/images/avatar-siti.jpg" },
      { id: "p-3", name: "Ahmad Fauzi", avatar: "/images/avatar-ahmad.jpg" },
      { id: "p-4", name: "Rina Oktaviani", avatar: "/images/avatar-rina.jpg" },
    ],
    replies: [
      {
        id: "reply-101",
        threadId: "topic-1",
        author: {
          id: "user-siti",
          name: "Siti Rahmawati",
          avatar: "/images/avatar-siti.jpg",
          graduationYear: 2012,
          graduationClass: "IPA 1",
          occupation: "Senior Frontend Engineer",
          role: "alumni",
        },
        body: "Wa'alaikumsalam wr wb Mas Budi. Usulan yang sangat dinantikan! Menurut pandangan saya, mengadakan sesi utama di kampus Mayoga memiliki nilai historis dan nostalgia yang sangat mendalam bagi para alumni sepuh maupun muda. Angkatan 2012 siap menjadi bagian dari tim pendaftaran dan sistem registrasi online.",
        createdAt: "2026-10-02T10:15:00Z",
        likesCount: 14,
        isLiked: false,
      },
      {
        id: "reply-102",
        threadId: "topic-1",
        author: {
          id: "user-ahmad",
          name: "Ahmad Fauzi, M.Pd.",
          avatar: "/images/avatar-ahmad.jpg",
          graduationYear: 2010,
          graduationClass: "IPA 2",
          occupation: "Dosen & Peneliti UIN",
          role: "alumni",
        },
        body: "Sepakat dengan Mbak Siti. Kampus Mayoga suasananya sekarang semakin asri setelah renovasi aula baru. Kami di angkatan 2010 siap mengoordinasikan penggalangan dana program Beasiswa Abadi untuk adik-adik siswa berprestasi yang kurang mampu.",
        parentId: "reply-101",
        parentAuthorName: "Siti Rahmawati",
        createdAt: "2026-10-03T14:20:00Z",
        likesCount: 9,
        isLiked: false,
      },
      {
        id: "reply-103",
        threadId: "topic-1",
        author: {
          id: "user-rina",
          name: "Rina Oktaviani",
          avatar: "/images/avatar-rina.jpg",
          graduationYear: 2015,
          graduationClass: "IPS 1",
          occupation: "Founder KaryaRasa Culinary",
          role: "alumni",
        },
        body: "Dari klaster wirausaha kuliner alumni, kami siap mendirikan 20 stan makanan nusantara dan kopi lokal untuk menjamu para tamu dan alumni. Mohon info jika jadwal technical meeting panitia sudah diagendakan.",
        createdAt: "2026-10-04T09:00:00Z",
        likesCount: 11,
        isLiked: false,
      },
      {
        id: "reply-104",
        threadId: "topic-1",
        author: {
          id: "user-budi",
          name: "Budi Santoso",
          avatar: "/images/avatar-ahmad.jpg",
          graduationYear: 2018,
          graduationClass: "IPA 2",
          occupation: "Senior Backend Engineer",
          role: "alumni",
        },
        body: "Alhamdulillah sambutan dari rekan-rekan luar biasa positif! InsyaAllah rapat koordinasi perdana via Google Meet akan dijadwalkan hari Sabtu malam pekan ini. Tautan undangan akan dibagikan di thread ini.",
        createdAt: "2026-10-06T11:45:00Z",
        likesCount: 6,
        isLiked: false,
      },
    ],
  },
  {
    id: "topic-2",
    title: "Lowongan Kerja: Backend Engineer & Product Specialist di Tech Nusantara (Terbuka untuk Alumni)",
    slug: "lowongan-backend-engineer-product-specialist-tech-nusantara",
    categoryId: "cat-2",
    categorySlug: "karir-dan-profesi",
    categoryName: "Karir & Profesi",
    categoryColor: "#2563EB",
    author: {
      id: "user-budi",
      name: "Budi Santoso",
      avatar: "/images/avatar-ahmad.jpg",
      graduationYear: 2018,
      graduationClass: "IPA 2",
      occupation: "Senior Backend Engineer",
      role: "alumni",
    },
    body: `Halo rekan-rekan alumni Mayoga,

Kantor kami di Tech Nusantara (Yogyakarta & Jakarta hybrid) saat ini sedang membuka kesempatan berkarir untuk dua posisi:
- **Mid/Senior Backend Engineer (Laravel / Go)**
- **Product Operations Specialist (Fresh Graduate / 1-2 tahun pengalaman)**

Kriteria utama:
- Memahami konsep clean code, RESTful API, dan basis data relasional.
- Mau belajar dan memiliki integritas tinggi.
- Bagi alumni MAN 3 Sleman, tersedia jalur referral langsung dan bimbingan teknis persiapan interview.

Bagi yang berminat, silakan kirimkan CV atau portofolio ke alamat email karir resmi atau mention saya di forum ini.`,
    isPinned: false,
    isLocked: false,
    viewsCount: 960,
    repliesCount: 3,
    likesCount: 29,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2026-10-04T13:00:00Z",
    lastActivityAt: "2026-10-06T09:12:00Z",
    tags: ["LowonganKerja", "Backend", "TechNusantara", "KarirAlumni"],
    participants: [
      { id: "p-1", name: "Budi Santoso", avatar: "/images/avatar-ahmad.jpg" },
      { id: "p-2", name: "Siti Rahmawati", avatar: "/images/avatar-siti.jpg" },
      { id: "p-5", name: "Faris Irawan", avatar: "/images/avatar-ahmad.jpg" },
    ],
    replies: [
      {
        id: "reply-201",
        threadId: "topic-2",
        author: {
          id: "user-faris",
          name: "Faris Irawan",
          avatar: "/images/avatar-ahmad.jpg",
          graduationYear: 2022,
          graduationClass: "IPA 3",
          occupation: "Mahasiswa Informatika UGM",
          role: "alumni",
        },
        body: "Terima kasih infonya Mas Budi! Untuk posisi Backend, apakah mahasiswa semester akhir yang sedang menyusun skripsi diperkenankan melamar secara remote?",
        createdAt: "2026-10-05T08:30:00Z",
        likesCount: 3,
        isLiked: false,
      },
      {
        id: "reply-202",
        threadId: "topic-2",
        author: {
          id: "user-budi",
          name: "Budi Santoso",
          avatar: "/images/avatar-ahmad.jpg",
          graduationYear: 2018,
          graduationClass: "IPA 2",
          occupation: "Senior Backend Engineer",
          role: "alumni",
        },
        body: "Bisa banget Faris, silakan sertakan keterangan status semester akhir dan tautan repositori GitHub portofolio saat mengirimkan email ya.",
        parentId: "reply-201",
        parentAuthorName: "Faris Irawan",
        createdAt: "2026-10-05T10:00:00Z",
        likesCount: 5,
        isLiked: false,
      },
      {
        id: "reply-203",
        threadId: "topic-2",
        author: {
          id: "user-siti",
          name: "Siti Rahmawati",
          avatar: "/images/avatar-siti.jpg",
          graduationYear: 2012,
          graduationClass: "IPA 1",
          occupation: "Senior Frontend Engineer",
          role: "alumni",
        },
        body: "Rekomendasi luar biasa untuk adik-adik alumni yang ingin belajar arsitektur produksi modern. Sukses selalu tim Tech Nusantara!",
        createdAt: "2026-10-06T09:12:00Z",
        likesCount: 7,
        isLiked: false,
      },
    ],
  },
  {
    id: "topic-3",
    title: "Panduan & Tips Lolos Beasiswa LPDP / AAS untuk Alumni Mayoga: Dari Esai hingga Wawancara",
    slug: "panduan-tips-lolos-beasiswa-lpdp-aas-alumni-mayoga",
    categoryId: "cat-4",
    categorySlug: "beasiswa-dan-pendidikan",
    categoryName: "Beasiswa & Pendidikan",
    categoryColor: "#7C3AED",
    author: {
      id: "user-ahmad",
      name: "Ahmad Fauzi, M.Pd.",
      avatar: "/images/avatar-ahmad.jpg",
      graduationYear: 2010,
      graduationClass: "IPA 2",
      occupation: "Dosen & Peneliti UIN",
      role: "alumni",
    },
    body: `Banyak rekan alumni menanyakan bagaimana menyusun rencana studi dan esai kontribusi yang kuat untuk seleksi beasiswa pascasarjana.

Berikut beberapa poin krusial yang perlu diperhatikan:
1. **Linearitas & Urgensi Riset:** Pastikan masalah yang ingin diselesaikan terhubung erat dengan latar belakang profesional Anda.
2. **Kontribusi Nyata:** Hindari narasi normatif; jelaskan langkah konkret pasca-studi di Indonesia.
3. **Persiapan Bahasa:** Jangan tunda tes IELTS/TOEFL hingga mepet deadline.

Kami bersama tim alumni awardee LPDP bersedia mengadakan sesi bedah esai (mock review) secara cuma-cuma untuk adik-adik alumni yang sedang menyiapkan berkas tahun ini.`,
    isPinned: false,
    isLocked: false,
    viewsCount: 880,
    repliesCount: 2,
    likesCount: 44,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2026-10-03T16:00:00Z",
    lastActivityAt: "2026-10-05T20:15:00Z",
    tags: ["Beasiswa", "LPDP", "Pendidikan", "S2LuarNegeri"],
    participants: [
      { id: "p-3", name: "Ahmad Fauzi", avatar: "/images/avatar-ahmad.jpg" },
      { id: "p-4", name: "Rina Oktaviani", avatar: "/images/avatar-rina.jpg" },
    ],
    replies: [
      {
        id: "reply-301",
        threadId: "topic-3",
        author: {
          id: "user-rina",
          name: "Rina Oktaviani",
          avatar: "/images/avatar-rina.jpg",
          graduationYear: 2015,
          graduationClass: "IPS 1",
          occupation: "Founder KaryaRasa Culinary",
          role: "alumni",
        },
        body: "Program bedah esai ini sangat bermanfaat Pak Dosen Ahmad. Waktu saya mendaftar hibah bisnis, bimbingan narasi dari senior sangat menentukan kelolosan proposal.",
        createdAt: "2026-10-04T11:20:00Z",
        likesCount: 6,
        isLiked: false,
      },
      {
        id: "reply-302",
        threadId: "topic-3",
        author: {
          id: "user-ahmad",
          name: "Ahmad Fauzi, M.Pd.",
          avatar: "/images/avatar-ahmad.jpg",
          graduationYear: 2010,
          graduationClass: "IPA 2",
          occupation: "Dosen & Peneliti UIN",
          role: "alumni",
        },
        body: "Betul sekali Mbak Rina. Silakan bagi yang berminat mengunggah draft esai di sub-forum pendidikan ini untuk kami berikan masukan konstruktif.",
        parentId: "reply-301",
        parentAuthorName: "Rina Oktaviani",
        createdAt: "2026-10-05T20:15:00Z",
        likesCount: 8,
        isLiked: false,
      },
    ],
  },
  {
    id: "topic-4",
    title: "Pedoman Etika & Tata Tertib Berdiskusi di Forum Komunitas Resmi M3S Connect",
    slug: "pedoman-etika-tata-tertib-berdiskusi-forum-m3s-connect",
    categoryId: "cat-1",
    categorySlug: "diskusi-umum",
    categoryName: "Diskusi Umum",
    categoryColor: "#0D9488",
    author: {
      id: "user-admin",
      name: "Administrator M3S",
      avatar: "/images/hero-man3-sleman.jpg",
      role: "admin",
    },
    body: `Selamat datang di Forum Komunitas Resmi MAN 3 Sleman (M3S Connect).

Untuk menjaga ruang diskusi yang santun, produktif, dan menjunjung nilai kekeluargaan madrasah, berikut beberapa pedoman umum:
- **Saling Menghargai:** Hargai perbedaan pendapat dan dilarang menyebarkan ujaran kebencian, fitnah, maupun isu SARA.
- **Topik Relevan:** Tempatkan postingan sesuai kategori yang tepat (Karir, Reuni, Bisnis, atau Pendidikan).
- **Hindari Spam & Promosi Ilegal:** Promosi usaha diizinkan pada kategori Bisnis & UMKM dengan etika yang baik.
- **Laporkan Pelanggaran:** Gunakan tombol laporkan jika menemukan konten yang melanggar norma komunitas.

Terima kasih atas peran aktif rekan-rekan semua dalam mewujudkan forum yang bermanfaat.`,
    isPinned: true,
    isLocked: true,
    viewsCount: 2150,
    repliesCount: 0,
    likesCount: 52,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2026-09-28T07:00:00Z",
    lastActivityAt: "2026-09-28T07:00:00Z",
    tags: ["AturanForum", "PanduanKomunitas", "Moderasi"],
    participants: [
      { id: "p-admin", name: "Administrator M3S", avatar: "/images/hero-man3-sleman.jpg" },
    ],
    replies: [],
  },
  {
    id: "topic-5",
    title: "Etalase Produk Alumni: Pendataan UMKM & Suplier Bahan Baku di Wilayah DIY - Jateng",
    slug: "etalase-produk-alumni-pendataan-umkm-suplier-diy-jateng",
    categoryId: "cat-5",
    categorySlug: "bisnis-dan-umkm",
    categoryName: "Bisnis & UMKM",
    categoryColor: "#059669",
    author: {
      id: "user-rina",
      name: "Rina Oktaviani",
      avatar: "/images/avatar-rina.jpg",
      graduationYear: 2015,
      graduationClass: "IPS 1",
      occupation: "Founder KaryaRasa Culinary",
      role: "alumni",
    },
    body: `Mari saling dukung usaha sesama alumni Mayoga!

Bagi rekan-rekan yang memiliki usaha kuliner, kerajinan tangan, konveksi seragam, jasa konsultasi, atau produk pertanian lokal:
Silakan balas thread ini dengan format:
- **Nama Usaha & Bidang:**
- **Lokasi & Kontak / Akun Media Sosial:**
- **Peluang Kerjasama / Kebutuhan Suplai:**

Nantinya data ini akan kami rekap ke dalam direktori bisnis alumni agar lebih mudah saling berbelanja dan menjalin kemitraan.`,
    isPinned: false,
    isLocked: false,
    viewsCount: 620,
    repliesCount: 2,
    likesCount: 27,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2026-10-05T14:10:00Z",
    lastActivityAt: "2026-10-06T12:30:00Z",
    tags: ["UMKMAlumni", "Kemitraan", "Kuliner", "BisnisMayoga"],
    participants: [
      { id: "p-4", name: "Rina Oktaviani", avatar: "/images/avatar-rina.jpg" },
      { id: "p-2", name: "Siti Rahmawati", avatar: "/images/avatar-siti.jpg" },
    ],
    replies: [
      {
        id: "reply-501",
        threadId: "topic-5",
        author: {
          id: "user-siti",
          name: "Siti Rahmawati",
          avatar: "/images/avatar-siti.jpg",
          graduationYear: 2012,
          graduationClass: "IPA 1",
          occupation: "Senior Frontend Engineer",
          role: "alumni",
        },
        body: "Saya bantu promosikan usaha keluarga: 'Batik Tulis Mayoga Klasik' spesialis seragam batik madrasah dan kemeja sutra halus di Sleman. Senang sekali bisa saling support sesama alumni!",
        createdAt: "2026-10-05T18:40:00Z",
        likesCount: 8,
        isLiked: false,
      },
      {
        id: "reply-502",
        threadId: "topic-5",
        author: {
          id: "user-rina",
          name: "Rina Oktaviani",
          avatar: "/images/avatar-rina.jpg",
          graduationYear: 2015,
          graduationClass: "IPS 1",
          occupation: "Founder KaryaRasa Culinary",
          role: "alumni",
        },
        body: "Keren sekali Mbak Siti! Cocok banget untuk seragam panitia Reuni Akbar nanti. Sudah saya catat kontaknya.",
        parentId: "reply-501",
        parentAuthorName: "Siti Rahmawati",
        createdAt: "2026-10-06T12:30:00Z",
        likesCount: 4,
        isLiked: false,
      },
    ],
  },
  {
    id: "topic-6",
    title: "Pengembangan Sistem Arsip Digital & Perpustakaan Mayoga: Panggilan Relawan Developer",
    slug: "pengembangan-sistem-arsip-digital-perpustakaan-mayoga",
    categoryId: "cat-6",
    categorySlug: "teknologi-dan-inovasi",
    categoryName: "Teknologi & Digital",
    categoryColor: "#DC2626",
    author: {
      id: "user-budi",
      name: "Budi Santoso",
      avatar: "/images/avatar-ahmad.jpg",
      graduationYear: 2018,
      graduationClass: "IPA 2",
      occupation: "Senior Backend Engineer",
      role: "alumni",
    },
    body: `Pihak madrasah berencana mendigitalkan ribuan koleksi buku langka dan arsip sejarah angkatan Mayoga sejak awal berdirinya.

Kami berinisiatif membentuk tim relawan pengembang sistem berbasis open-source (Next.js, Laravel, dan PostgreSQL).
Kebutuhan relawan:
- UI/UX Designer
- Frontend Developer
- Backend & DevOps Engineer
- Digital Archivist / Content Contributor

Pekerjaan bersifat volunter / amal jariyah untuk kemajuan almamater. Bagi yang berminat meluangkan waktu luang, mari berkolaborasi bersama.`,
    isPinned: false,
    isLocked: false,
    viewsCount: 740,
    repliesCount: 1,
    likesCount: 35,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2026-10-05T09:00:00Z",
    lastActivityAt: "2026-10-06T08:20:00Z",
    tags: ["OpenSource", "DigitalMadrasah", "Inovasi", "RelawanTech"],
    participants: [
      { id: "p-1", name: "Budi Santoso", avatar: "/images/avatar-ahmad.jpg" },
      { id: "p-2", name: "Siti Rahmawati", avatar: "/images/avatar-siti.jpg" },
    ],
    replies: [
      {
        id: "reply-601",
        threadId: "topic-6",
        author: {
          id: "user-siti",
          name: "Siti Rahmawati",
          avatar: "/images/avatar-siti.jpg",
          graduationYear: 2012,
          graduationClass: "IPA 1",
          occupation: "Senior Frontend Engineer",
          role: "alumni",
        },
        body: "Saya siap berkontribusi di bagian Frontend dan komponen antarmuka ramah aksesibilitas. Project yang sangat mulia untuk masa depan madrasah!",
        createdAt: "2026-10-06T08:20:00Z",
        likesCount: 12,
        isLiked: false,
      },
    ],
  },
];

// LocalStorage helpers for reactive state & user interaction persistence
const STORAGE_KEY_TOPICS = "m3s_forum_topics_v1";

export function getStoredTopics(): ForumTopic[] {
  if (typeof window === "undefined") return INITIAL_FORUM_TOPICS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOPICS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(INITIAL_FORUM_TOPICS));
      return INITIAL_FORUM_TOPICS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FORUM_TOPICS;
  }
}

export function saveStoredTopics(topics: ForumTopic[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(topics));
    window.dispatchEvent(new Event("m3s_forum_change"));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function addTopic(newTopic: Omit<ForumTopic, "id" | "viewsCount" | "repliesCount" | "likesCount" | "createdAt" | "lastActivityAt" | "participants" | "replies">): ForumTopic {
  const topics = getStoredTopics();
  const created: ForumTopic = {
    ...newTopic,
    id: `topic-${Date.now()}`,
    viewsCount: 1,
    repliesCount: 0,
    likesCount: 0,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    participants: [{ id: newTopic.author.id, name: newTopic.author.name, avatar: newTopic.author.avatar }],
    replies: [],
  };

  const updated = [created, ...topics];
  saveStoredTopics(updated);
  return created;
}

export function addReply(threadSlug: string, replyData: { body: string; author: ForumAuthor; parentId?: string; parentAuthorName?: string }): ForumReply | null {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return null;

  const topic = topics[topicIndex];
  const newReply: ForumReply = {
    id: `reply-${Date.now()}`,
    threadId: topic.id,
    author: replyData.author,
    body: replyData.body,
    parentId: replyData.parentId,
    parentAuthorName: replyData.parentAuthorName,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    isLiked: false,
  };

  const hasParticipant = topic.participants.some((p) => p.name === replyData.author.name);
  const updatedParticipants = hasParticipant
    ? topic.participants
    : [...topic.participants, { id: replyData.author.id, name: replyData.author.name, avatar: replyData.author.avatar }].slice(0, 5);

  const updatedTopic: ForumTopic = {
    ...topic,
    repliesCount: topic.repliesCount + 1,
    lastActivityAt: new Date().toISOString(),
    participants: updatedParticipants,
    replies: [...topic.replies, newReply],
  };

  topics[topicIndex] = updatedTopic;
  saveStoredTopics(topics);
  return newReply;
}

export function toggleTopicLike(threadSlug: string): boolean {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return false;

  const topic = topics[topicIndex];
  const isLiked = !topic.isLiked;
  const likesCount = isLiked ? topic.likesCount + 1 : Math.max(0, topic.likesCount - 1);

  topics[topicIndex] = { ...topic, isLiked, likesCount };
  saveStoredTopics(topics);
  return isLiked;
}

export function toggleReplyLike(threadSlug: string, replyId: string): boolean {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return false;

  const topic = topics[topicIndex];
  const replyIndex = topic.replies.findIndex((r) => r.id === replyId);
  if (replyIndex === -1) return false;

  const reply = topic.replies[replyIndex];
  const isLiked = !reply.isLiked;
  const likesCount = isLiked ? reply.likesCount + 1 : Math.max(0, reply.likesCount - 1);

  topic.replies[replyIndex] = { ...reply, isLiked, likesCount };
  topics[topicIndex] = { ...topic };
  saveStoredTopics(topics);
  return isLiked;
}

export function toggleTopicBookmark(threadSlug: string): boolean {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return false;

  const topic = topics[topicIndex];
  const isBookmarked = !topic.isBookmarked;

  topics[topicIndex] = { ...topic, isBookmarked };
  saveStoredTopics(topics);
  return isBookmarked;
}
