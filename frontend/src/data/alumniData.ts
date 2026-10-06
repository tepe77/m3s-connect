export interface AlumniSocialLink {
  platform: "linkedin" | "github" | "instagram" | "twitter" | "website";
  url: string;
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
    bio: "Pengembang aplikasi web dan antarmuka berkinerja tinggi. Senang berbagi ilmu seputar teknologi dan mentoring adik-adik angkatan.",
    skills: ["React", "Next.js", "TypeScript", "Web Performance"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/sitinurhaliza" },
      { platform: "github", url: "https://github.com/sitinurhaliza" },
      { platform: "instagram", url: "https://instagram.com/sitinurhaliza" },
      { platform: "website", url: "https://sitinurhaliza.dev" },
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
    bio: "Dosen bidang kurikulum pendidikan sains dan teknologi madrasah. Aktif dalam kepanitiaan ikatan alumni dan riset edukasi nasional.",
    skills: ["Kurikulum Madrasah", "Metodologi Riset", "Pendidikan Sains", "Public Speaking"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/ahmadfauzi" },
      { platform: "twitter", url: "https://x.com/ahmadfauzi" },
      { platform: "website", url: "https://ahmadfauzi.id" },
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
    bio: "Membangun ekosistem UMKM kuliner nusantara berbasis bahan pangan lokal. Terbuka untuk kolaborasi bisnis bersama alumni MAN 3 Sleman.",
    skills: ["Business Development", "F&B Management", "Digital Marketing", "Brand Strategy"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/rinaoktaviani" },
      { platform: "instagram", url: "https://instagram.com/karyarasa.id" },
      { platform: "website", url: "https://karyarasa.id" },
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
    bio: "Fokus pada arsitektur mikroservis terdistribusi, basis data PostgreSQL, dan sistem perpesanan berkecepatan tinggi.",
    skills: ["Laravel", "PostgreSQL", "Redis", "Docker", "Go"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/budisantoso" },
      { platform: "github", url: "https://github.com/budisantoso" },
      { platform: "twitter", url: "https://x.com/budisantoso" },
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
    bio: "Praktisi psikologi organisasi dan pengembangan potensi SDM muda. Menyediakan konsultasi persiapan karir bagi lulusan baru madrasah.",
    skills: ["Talent Acquisition", "Career Coaching", "Organizational Behavior", "HR Strategy"],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/dewilestari" },
      { platform: "instagram", url: "https://instagram.com/dewilestari" },
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
  },
];
