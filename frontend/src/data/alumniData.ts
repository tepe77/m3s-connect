export interface AlumniSocialLink {
  platform: "linkedin" | "github" | "instagram" | "twitter" | "website";
  url: string;
}

export interface AlumniEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  description?: string;
}

export interface AlumniExperience {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description?: string;
}

export interface AlumniItem {
  id: string;
  name: string;
  avatar: string;
  graduationYear: number;
  graduationClass: string;
  alumniIdentifier: string;
  isVerified: boolean;
  occupation: string;
  company: string;
  city: string;
  country: string;
  bio: string;
  skills: string[];
  socialLinks: AlumniSocialLink[];
  educations?: AlumniEducation[];
  experiences?: AlumniExperience[];
}

export const ALUMNI_ITEMS: AlumniItem[] = [
  {
    id: "alumni-1",
    name: "Siti Nurhaliza, S.T.",
    avatar: "/images/avatar-siti.jpg",
    graduationYear: 2012,
    graduationClass: "IPA 1",
    alumniIdentifier: "M3S-2012-0081",
    isVerified: true,
    occupation: "Software Engineer",
    company: "Tokopedia",
    city: "Jakarta Selatan",
    country: "Indonesia",
    bio: "Pengembang aplikasi web dan antarmuka berkinerja tinggi. Senang berbagi ilmu seputar teknologi dan aktif membimbing adik-adik angkatan dalam persiapan karir rekayasa perangkat lunak.",
    skills: ["React", "Next.js", "TypeScript", "Web Performance", "UI Architecture"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/sitinurhaliza" },
      { platform: "github", url: "https://github.com/sitinurhaliza" },
      { platform: "instagram", url: "https://instagram.com/sitinurhaliza" },
      { platform: "website", url: "https://sitinurhaliza.dev" },
    ],
    educations: [
      {
        institution: "Institut Teknologi Bandung",
        degree: "S1",
        fieldOfStudy: "Teknik Informatika",
        startYear: 2012,
        endYear: 2016,
        description: "Lulus dengan predikat sangat memuaskan, fokus riset sistem web terdistribusi.",
      },
      {
        institution: "MAN 3 Sleman (Mayoga)",
        degree: "Madrasah Aliyah",
        fieldOfStudy: "Jurusan IPA",
        startYear: 2009,
        endYear: 2012,
        description: "Aktif dalam kelompok ilmiah remaja dan olimpiade komputer.",
      },
    ],
    experiences: [
      {
        position: "Software Engineer",
        company: "Tokopedia",
        location: "Jakarta Selatan",
        startDate: "2019",
        endDate: null,
        isCurrent: true,
        description: "Mengembangkan platform frontend berskala jutaan pengguna harian.",
      },
      {
        position: "Junior Frontend Developer",
        company: "Digital Studio Asia",
        location: "Bandung",
        startDate: "2016",
        endDate: "2019",
        isCurrent: false,
        description: "Membangun portal aplikasi web interaktif untuk berbagai klien institusi.",
      },
    ],
  },
  {
    id: "alumni-2",
    name: "Ahmad Fauzi, M.Pd.",
    avatar: "/images/avatar-ahmad.jpg",
    graduationYear: 2010,
    graduationClass: "IPA 2",
    alumniIdentifier: "M3S-2010-0034",
    isVerified: true,
    occupation: "Dosen & Peneliti",
    company: "UIN Sunan Kalijaga",
    city: "Yogyakarta",
    country: "Indonesia",
    bio: "Dosen bidang kurikulum pendidikan sains dan teknologi madrasah. Aktif dalam kepanitiaan ikatan alumni, riset edukasi nasional, dan pengabdian masyarakat.",
    skills: ["Kurikulum Madrasah", "Metodologi Riset", "Pendidikan Sains", "Public Speaking", "Pengabdian Masyarakat"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/ahmadfauzi" },
      { platform: "twitter", url: "https://x.com/ahmadfauzi" },
      { platform: "website", url: "https://ahmadfauzi.id" },
    ],
    educations: [
      {
        institution: "Universitas Negeri Yogyakarta",
        degree: "S2",
        fieldOfStudy: "Magister Pendidikan Sains",
        startYear: 2014,
        endYear: 2017,
        description: "Tesis tentang integrasi teknologi digital pada pembelajaran sains madrasah.",
      },
      {
        institution: "UIN Sunan Kalijaga Yogyakarta",
        degree: "S1",
        fieldOfStudy: "Pendidikan Fisika",
        startYear: 2010,
        endYear: 2014,
        description: "Lulusan terbaik fakultas tarbiyah angkatan 2010.",
      },
      {
        institution: "MAN 3 Sleman (Mayoga)",
        degree: "Madrasah Aliyah",
        fieldOfStudy: "Jurusan IPA",
        startYear: 2007,
        endYear: 2010,
        description: "Ketua OSIS periode 2008/2009.",
      },
    ],
    experiences: [
      {
        position: "Dosen Tetap Fakultas Tarbiyah",
        company: "UIN Sunan Kalijaga",
        location: "Yogyakarta",
        startDate: "2018",
        endDate: null,
        isCurrent: true,
        description: "Mengampu mata kuliah kurikulum, evaluasi pembelajaran, dan media edukasi digital.",
      },
      {
        position: "Ketua Panitia Reuni Akbar 2025",
        company: "Ikatan Alumni MAN 3 Sleman",
        location: "Sleman",
        startDate: "2024",
        endDate: "2025",
        isCurrent: false,
        description: "Mengoordinasikan perhelatan akbar reuni lintas angkatan 1990 hingga 2024.",
      },
    ],
  },
  {
    id: "alumni-3",
    name: "Rina Oktaviani, S.E.",
    avatar: "/images/avatar-rina.jpg",
    graduationYear: 2015,
    graduationClass: "IPS 1",
    alumniIdentifier: "M3S-2015-0112",
    isVerified: true,
    occupation: "Entrepreneur (Founder)",
    company: "KaryaRasa Culinary",
    city: "Yogyakarta",
    country: "Indonesia",
    bio: "Membangun ekosistem UMKM kuliner nusantara berbasis bahan pangan lokal berkualitas. Terbuka lebar untuk kolaborasi wirausaha bersama keluarga besar alumni MAN 3 Sleman.",
    skills: ["Business Development", "F&B Management", "Digital Marketing", "Brand Strategy", "UMKM Mentoring"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/rinaoktaviani" },
      { platform: "instagram", url: "https://instagram.com/karyarasa.id" },
      { platform: "website", url: "https://karyarasa.id" },
    ],
    educations: [
      {
        institution: "Universitas Gadjah Mada",
        degree: "S1",
        fieldOfStudy: "Ilmu Ekonomi & Manajemen Bisnis",
        startYear: 2015,
        endYear: 2019,
        description: "Fokus riset kewirausahaan kreatif dan strategi pemasaran digital produk lokal.",
      },
      {
        institution: "MAN 3 Sleman (Mayoga)",
        degree: "Madrasah Aliyah",
        fieldOfStudy: "Jurusan IPS",
        startYear: 2012,
        endYear: 2015,
        description: "Juara kompetisi bisnis rencana wirausaha tingkat pelajar DIY.",
      },
    ],
    experiences: [
      {
        position: "Founder & CEO",
        company: "KaryaRasa Culinary",
        location: "Yogyakarta",
        startDate: "2020",
        endDate: null,
        isCurrent: true,
        description: "Memimpin rantai gerai kuliner dan kemitraan suplai bahan baku petani lokal.",
      },
    ],
  },
  {
    id: "alumni-4",
    name: "Budi Santoso, S.Kom.",
    avatar: "/images/avatar-ahmad.jpg",
    graduationYear: 2018,
    graduationClass: "IPA 2",
    alumniIdentifier: "M3S-2018-0042",
    isVerified: true,
    occupation: "Senior Backend Engineer",
    company: "Tech Nusantara",
    city: "Yogyakarta",
    country: "Indonesia",
    bio: "Fokus pada arsitektur mikroservis terdistribusi, basis data PostgreSQL, dan sistem perpesanan berkecepatan tinggi. Senang berkontribusi pada pengembangan sistem teknologi madrasah.",
    skills: ["Laravel", "PostgreSQL", "Redis", "Docker", "Go", "Next.js"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/budisantoso" },
      { platform: "github", url: "https://github.com/budisantoso" },
      { platform: "twitter", url: "https://x.com/budisantoso" },
    ],
    educations: [
      {
        institution: "Universitas Gadjah Mada",
        degree: "S1",
        fieldOfStudy: "Teknologi Informasi",
        startYear: 2018,
        endYear: 2022,
        description: "Lulus Cumlaude dengan fokus riset arsitektur cloud terdesentralisasi.",
      },
      {
        institution: "MAN 3 Sleman (Mayoga)",
        degree: "Madrasah Aliyah",
        fieldOfStudy: "Jurusan IPA",
        startYear: 2015,
        endYear: 2018,
        description: "Aktif di ekstrakurikuler robotika dan teknologi informasi.",
      },
    ],
    experiences: [
      {
        position: "Senior Backend Engineer",
        company: "Tech Nusantara",
        location: "Yogyakarta",
        startDate: "2022",
        endDate: null,
        isCurrent: true,
        description: "Mengembangkan backend API mikroservis dan integrasi payment gateway terpadu.",
      },
    ],
  },
  {
    id: "alumni-5",
    name: "Dewi Lestari, S.Psi.",
    avatar: "/images/avatar-rina.jpg",
    graduationYear: 2016,
    graduationClass: "IPS 2",
    alumniIdentifier: "M3S-2016-0067",
    isVerified: true,
    occupation: "People & Culture Lead",
    company: "Inovasi Talenta Asia",
    city: "Jakarta Pusat",
    country: "Indonesia",
    bio: "Praktisi psikologi organisasi dan pengembangan potensi SDM muda. Menyediakan bimbingan persiapan karir dan wawancara bagi lulusan baru madrasah.",
    skills: ["Talent Acquisition", "Career Coaching", "Organizational Behavior", "HR Strategy"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/dewilestari" },
      { platform: "instagram", url: "https://instagram.com/dewilestari" },
    ],
    educations: [
      {
        institution: "Universitas Indonesia",
        degree: "S1",
        fieldOfStudy: "Psikologi Industri & Organisasi",
        startYear: 2016,
        endYear: 2020,
        description: "Fokus pada pengembangan kompetensi kerja generasi Z di industri teknologi.",
      },
    ],
    experiences: [
      {
        position: "People & Culture Lead",
        company: "Inovasi Talenta Asia",
        location: "Jakarta Pusat",
        startDate: "2021",
        endDate: null,
        isCurrent: true,
        description: "Mengelola strategi talenta, retensi karyawan, dan program pelatihan kepemimpinan.",
      },
    ],
  },
  {
    id: "alumni-6",
    name: "dr. Farhan Hakim",
    avatar: "/images/avatar-siti.jpg",
    graduationYear: 2014,
    graduationClass: "IPA 1",
    alumniIdentifier: "M3S-2014-0019",
    isVerified: true,
    occupation: "Dokter Residen Pediatri",
    company: "RSUP Dr. Sardjito",
    city: "Sleman",
    country: "Indonesia",
    bio: "Menjalani pendidikan spesialis kesehatan anak. Aktif sebagai koordinator tim kesehatan pada setiap gelaran bakti sosial alumni Mayoga.",
    skills: ["Kedokteran Anak", "Layanan Kesehatan Komunitas", "Konsultasi Medis", "Relawan Kemanusiaan"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/farhanhakim" },
      { platform: "instagram", url: "https://instagram.com/dr.farhanhakim" },
      { platform: "twitter", url: "https://x.com/farhanhakim" },
    ],
    educations: [
      {
        institution: "Fakultas Kedokteran UGM",
        degree: "Profesi Dokter",
        fieldOfStudy: "Pendidikan Dokter & Spesialis Pediatri",
        startYear: 2014,
        endYear: 2020,
        description: "Lulus dengan predikat dokter teladan pelayanan primer.",
      },
    ],
    experiences: [
      {
        position: "Dokter Residen Anak",
        company: "RSUP Dr. Sardjito",
        location: "Yogyakarta",
        startDate: "2021",
        endDate: null,
        isCurrent: true,
        description: "Melayani perawatan anak rawat inap, intensif, dan posyandu kemanusiaan.",
      },
    ],
  },
];
