export interface NewsComment {
  id: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  avatarUrl?: string;
  createdAt: string;
  content: string;
  isVerifiedAlumni?: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: {
    name: string;
    slug: string;
  };
  subCategory: {
    name: string;
    slug: string;
  };
  tags: string[];
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  contentImages: {
    url: string;
    caption: string;
    alt: string;
  }[];
  contentHtml: string[];
  comments: NewsComment[];
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-1",
    slug: "reuni-akbar-alumni-man-3-sleman-2025",
    title: "Reuni Akbar Alumni MAN 3 Sleman 2025 Berlangsung Meriah",
    excerpt: "Ribuan alumni dari berbagai angkatan hadir dalam acara Reuni Akbar yang digelar di halaman MAN 3 Sleman, mempererat silaturahmi dan merajut kolaborasi masa depan.",
    category: {
      name: "Kegiatan Alumni",
      slug: "kegiatan-alumni",
    },
    subCategory: {
      name: "Reuni & Silaturahmi",
      slug: "reuni-silaturahmi",
    },
    tags: [
      "ReuniAkbar2025",
      "AlumniMayoga",
      "MAN3Sleman",
      "SilaturahmiAlumni",
      "KeluargaBesarM3S",
    ],
    publishedAt: "12 Mei 2025",
    readTime: "4 menit baca",
    author: {
      name: "Humas Ikatan Alumni M3S",
      role: "Divisi Publikasi & Dokumentasi",
      avatar: "/images/avatar-ahmad.jpg",
    },
    thumbnail: "/images/news-reuni.jpg",
    contentImages: [
      {
        url: "/images/news-reuni.jpg",
        caption: "Suasana kehangatan ribuan alumni MAN 3 Sleman dari berbagai angkatan saat pembukaan acara Reuni Akbar 2025.",
        alt: "Foto bersama Reuni Akbar Alumni MAN 3 Sleman di halaman kampus madrasah",
      },
      {
        url: "/images/doc-baksos.jpg",
        caption: "Penyerahan cenderamata bakti sosial dan donasi beasiswa pendidikan dari perwakilan alumni kepada almamater.",
        alt: "Dokumentasi penyerahan donasi bakti alumni",
      },
    ],
    contentHtml: [
      "Suasana penuh kehangatan dan rasa haru mewarnai halaman kampus MAN 3 Sleman pada hari Minggu, 12 Mei 2025. Lebih dari 1.500 alumni dari angkatan 1990 hingga lulusan terbaru 2024 berkumpul kembali dalam gelaran akbar Reuni Akbar Alumni MAN 3 Sleman bertajuk 'Satu Alumni, Seribu Cerita, Satu Tujuan'.",
      "Acara dibuka secara resmi oleh Kepala Madrasah didampingi jajaran pengurus ikatan alumni. Dalam sambutannya, beliau menyampaikan apresiasi mendalam atas kontribusi nyata yang terus diberikan oleh para alumni di berbagai sektor, baik di dunia profesional, akademis, wirausaha, maupun pengabdian sosial kemasyarakatan.",
      "Tidak hanya sekadar temu kangen mengenang masa-masa putih abu-abu di madrasah, Reuni Akbar 2025 juga diisi dengan peluncuran program Dana Abadi Pendidikan Beasiswa Mayoga serta inisiasi jejaring mentoring karir lintas angkatan.",
      "Para peserta reuni disuguhi berbagai stan kilas balik foto lawas, bincang santai inspiratif, serta panggung seni kolaborasi antar angkatan yang disambut antusias oleh seluruh hadirin.",
      "Ketua Panitia Pelaksana, Ahmad Fauzi, M.Pd. (Alumni 2010), menegaskan bahwa momentum reuni ini menjadi pijakan awal dari integrasi digital komunitas alumni melalui peluncuran platform M3S Connect, yang mempermudah koordinasi kegiatan dan pendataan anggota ke depannya.",
    ],
    comments: [
      {
        id: "c-1",
        authorName: "Budi Santoso",
        authorEmail: "budi.santoso@alumni.m3s.id",
        avatarUrl: "/images/avatar-ahmad.jpg",
        createdAt: "12 Mei 2025 pukul 19:40",
        content: "Alhamdulillah acara berjalan dengan sangat lancar dan penuh kenangan. Senang sekali bisa bertemu kembali dengan bapak ibu guru serta teman-teman seangkatan.",
        isVerifiedAlumni: true,
      },
      {
        id: "c-2",
        authorName: "Siti Nurhaliza",
        authorEmail: "siti.nurhaliza@tokopedia.com",
        avatarUrl: "/images/avatar-siti.jpg",
        createdAt: "13 Mei 2025 pukul 08:15",
        content: "Terima kasih untuk panitia yang sudah menyiapkan acara sebaik ini. Usul untuk reuni berikutnya diadakan sesi panel sharing karir teknologi secara khusus.",
        isVerifiedAlumni: true,
      },
      {
        id: "c-3",
        authorName: "Rina Oktaviani",
        authorEmail: "rina@karyarasa.id",
        avatarUrl: "/images/avatar-rina.jpg",
        createdAt: "13 Mei 2025 pukul 11:20",
        content: "Stand UMKM alumni juga ramai peminat. Bangga menjadi bagian dari keluarga besar MAN 3 Sleman!",
        isVerifiedAlumni: true,
      },
    ],
  },
  {
    id: "news-2",
    slug: "program-beasiswa-alumni-berprestasi",
    title: "Program Beasiswa untuk Alumni Berprestasi",
    excerpt: "Ikatan Alumni MAN 3 Sleman resmi meluncurkan program beasiswa jenjang pendidikan tinggi bagi alumni dan siswa berprestasi yang membutuhkan dukungan operasional studi.",
    category: {
      name: "Beasiswa & Pendidikan",
      slug: "beasiswa-pendidikan",
    },
    subCategory: {
      name: "Bantuan Studi Sarjana",
      slug: "bantuan-studi-sarjana",
    },
    tags: [
      "BeasiswaAlumni",
      "PrestasiMayoga",
      "PendidikanTinggi",
      "DanaAbadi",
      "MayogaPeduli",
    ],
    publishedAt: "8 Mei 2025",
    readTime: "3 menit baca",
    author: {
      name: "Tim Beasiswa Mayoga Peduli",
      role: "Badan Otonom Beasiswa M3S",
      avatar: "/images/avatar-siti.jpg",
    },
    thumbnail: "/images/news-beasiswa.jpg",
    contentImages: [
      {
        url: "/images/news-beasiswa.jpg",
        caption: "Simbolis penyerahan sertifikat beasiswa kepada mahasiswa berprestasi lulusan MAN 3 Sleman di kampus UGM.",
        alt: "Penerima beasiswa alumni MAN 3 Sleman berfoto bersama",
      },
      {
        url: "/images/news-internasional.jpg",
        caption: "Sesi sosialisasi seleksi beasiswa luar negeri dan persiapan berkas pendaftaran.",
        alt: "Sosialisasi beasiswa alumni",
      },
    ],
    contentHtml: [
      "Sebagai wujud kepedulian antargenerasi, Ikatan Alumni MAN 3 Sleman membuka pendaftaran Beasiswa Alumni Berprestasi gelombang perdana tahun akademik 2025/2026. Program ini didanai melalui skema donasi teratur dan infak pendidikan para alumni.",
      "Beasiswa ini mencakup tunjangan biaya operasional perkuliahan, bimbingan akademik dari alumni mentor senior, serta fasilitas jejaring magang kerja di berbagai perusahaan mitra komunitas.",
      "Kriteria penerima difokuskan pada mahasiswa aktif yang memiliki rekam jejak akademik cemerlang, aktif berorganisasi, serta memerlukan dukungan finansial tambahan.",
      "Pendaftaran dapat diakses secara daring melalui platform M3S Connect hingga tanggal 30 Mei 2025.",
    ],
    comments: [
      {
        id: "c-4",
        authorName: "Farhan Hakim",
        authorEmail: "farhan@student.ugm.ac.id",
        createdAt: "9 Mei 2025 pukul 10:30",
        content: "Terima kasih banyak atas program beasiswa ini. Sangat membantu adik-adik angkatan yang sedang menempuh semester akhir perkuliahan.",
        isVerifiedAlumni: true,
      },
    ],
  },
  {
    id: "news-3",
    slug: "alumni-man-3-sleman-sukses-kancah-internasional",
    title: "Alumni MAN 3 Sleman Sukses di Kancah Internasional",
    excerpt: "Kiprah membanggakan ditunjukkan lulusan madrasah yang tampil sebagai pembicara pada forum teknologi dan riset global di tingkat dunia.",
    category: {
      name: "Prestasi Alumni",
      slug: "prestasi-alumni",
    },
    subCategory: {
      name: "Kiprah Global",
      slug: "kiprah-global",
    },
    tags: [
      "InspirasiAlumni",
      "KancahInternasional",
      "TeknologiGlobal",
      "MayogaMendunia",
      "KiprahAlumni",
    ],
    publishedAt: "5 Mei 2025",
    readTime: "5 menit baca",
    author: {
      name: "Redaksi M3S Connect",
      role: "Editor Berita Karir",
      avatar: "/images/avatar-rina.jpg",
    },
    thumbnail: "/images/news-internasional.jpg",
    contentImages: [
      {
        url: "/images/news-internasional.jpg",
        caption: "Reza Pratama, alumnus MAN 3 Sleman, saat menyampaikan paparan kunci di International Education & Tech Summit.",
        alt: "Alumnus MAN 3 Sleman di mimbar konferensi internasional",
      },
      {
        url: "/images/news-peluncuran.jpg",
        caption: "Diskusi meja bundar bersama perwakilan delegasi berbagai negara peserta konferensi.",
        alt: "Diskusi panel internasional",
      },
    ],
    contentHtml: [
      "Pendidikan komprehensif berbasis nilai agama dan wawasan sains di MAN 3 Sleman terus melahirkan generasi unggul yang diakui di kancah internasional. Kali ini kabar membanggakan datang dari salah satu alumnus yang diundang memaparkan riset kecerdasan buatan dalam forum ilmiah internasional.",
      "Dalam sesi presentasinya, dipaparkan bagaimana implementasi teknologi adaptif dapat mempercepat pemerataan akses pendidikan berkualitas di negara berkembang.",
      "Kunci dari capaian ini berakar pada ketekunan belajar, budaya membaca, dan bimbingan guru-guru madrasah yang selalu mendorong eksplorasi keilmuan tanpa batas.",
    ],
    comments: [],
  },
  {
    id: "news-4",
    slug: "peluncuran-platform-m3s-connect-resmi-dimulai",
    title: "Peluncuran Platform M3S Connect Resmi Dimulai",
    excerpt: "Portal terpadu alumni MAN 3 Sleman kini hadir untuk memfasilitasi pendataan digital, forum komunikasi, direktori karir, dan arsip kenangan madrasah.",
    category: {
      name: "Informasi Komunitas",
      slug: "informasi-komunitas",
    },
    subCategory: {
      name: "Portal Digital",
      slug: "portal-digital",
    },
    tags: [
      "M3SConnect",
      "TransformasiDigital",
      "AlumniMayoga",
      "DatabaseAlumni",
      "InovasiMadrasah",
    ],
    publishedAt: "1 Mei 2025",
    readTime: "3 menit baca",
    author: {
      name: "Tim Pengembang M3S Connect",
      role: "Divisi Teknologi Informasi Komunitas",
      avatar: "/images/avatar-ahmad.jpg",
    },
    thumbnail: "/images/news-peluncuran.jpg",
    contentImages: [
      {
        url: "/images/news-peluncuran.jpg",
        caption: "Peluncuran resmi platform digital M3S Connect dihadiri oleh perwakilan pengurus angkatan dan dewan pembina madrasah.",
        alt: "Demonstrasi aplikasi M3S Connect pada tablet di ruang presentasi",
      },
      {
        url: "/images/doc-wisuda.jpg",
        caption: "Integrasi data kelulusan memudahkan alumni melakukan verifikasi akun mandiri secara cepat dan terjamin keamanannya.",
        alt: "Dokumentasi arsip angkatan madrasah",
      },
    ],
    contentHtml: [
      "Era digital menuntut kemudahan konektivitas yang cepat, aman, dan berkesinambungan. Menjawab kebutuhan tersebut, Ikatan Alumni MAN 3 Sleman secara resmi merilis platform digital M3S Connect.",
      "Platform ini dirancang khusus dengan berbagai fitur unggulan, antara lain direktori pencarian alumni terverifikasi, forum diskusi tematik, ruang kabar berita madrasah, serta dokumentasi galeri kegiatan.",
      "Seluruh alumni dihimbau untuk segera membuat akun, memutakhirkan riwayat karir dan domisili, agar jaringan silaturahmi semakin solid.",
    ],
    comments: [],
  },
];
