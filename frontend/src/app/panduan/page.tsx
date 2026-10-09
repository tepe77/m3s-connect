"use client";

import * as React from "react";
import Link from "next/link";
import {
  UserCheck,
  Users,
  MessagesSquare,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { BlurFade } from "@/components/velora/blur-fade";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { cn } from "@/lib/utils";

interface GuideStep {
  stepNumber: string;
  title: string;
  description: string;
  tips?: string;
  actionText?: string;
  actionHref?: string;
}

interface GuideModule {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  steps: GuideStep[];
}

const MODULES: GuideModule[] = [
  {
    id: "verifikasi",
    name: "Akun & Verifikasi",
    icon: UserCheck,
    summary: "Langkah membuat akun, aktivasi data, hingga diverifikasi sebagai alumni resmi.",
    steps: [
      {
        stepNumber: "01",
        title: "Pendaftaran Akun Baru",
        description:
          "Kunjungi halaman registrasi lalu masukkan nama lengkap sesuai ijazah/buku induk, alamat email aktif, angkatan tahun kelulusan, dan buat kata sandi yang aman.",
        tips: "Gunakan nama lengkap asli agar memudahkan verifikator mencocokkan data pada sistem.",
        actionText: "Buka Form Pendaftaran",
        actionHref: "/register",
      },
      {
        stepNumber: "02",
        title: "Orientasi Onboarding Pengguna",
        description:
          "Setelah pertama kali masuk, Anda akan diarahkan ke panduan orientasi singkat 4 langkah untuk mengenal pilar utama platform dan memilih minat diskusi yang relevan.",
        tips: "Anda juga dapat memilih untuk melewati langkah ini dan langsung menuju Dashboard.",
      },
      {
        stepNumber: "03",
        title: "Verifikasi Berkas & Buku Induk",
        description:
          "Tim pengurus IKAMAYOGA dan administrator madrasah akan memvalidasi data Anda dengan database buku induk kelulusan. Status verifikasi dapat dipantau di profil.",
        tips: "Biasanya proses verifikasi memakan waktu 1x24 jam pada hari kerja.",
      },
      {
        stepNumber: "04",
        title: "Lencana Alumni Terverifikasi Aktif",
        description:
          "Setelah disetujui, akun Anda akan memiliki tanda centang hijau 'Verified Alumni'. Akun terverifikasi memiliki akses penuh untuk mengirim pesan langsung dan membuat thread forum.",
      },
    ],
  },
  {
    id: "profil",
    name: "Profil & Direktori",
    icon: Users,
    summary: "Mengisi portofolio profesional, riwayat karir, dan mengatur privasi kontak.",
    steps: [
      {
        stepNumber: "01",
        title: "Lengkapi Biodata & Foto Profil",
        description:
          "Buka menu Profil Anda, unggah foto profil resmi, isi ringkasan biografi singkat, domisili kota tempat tinggal saat ini, serta bidang keahlian utama.",
        actionText: "Kelola Profil Saya",
        actionHref: "/profile",
      },
      {
        stepNumber: "02",
        title: "Tambahkan Jejak Karir & Pendidikan",
        description:
          "Cantumkan perguruan tinggi tempat Anda menempuh studi lanjut, serta pengalaman profesi atau instansi tempat Anda bekerja saat ini.",
        tips: "Data karir membantu alumni lain dan almamater dalam memetakan jejaring profesional.",
      },
      {
        stepNumber: "03",
        title: "Atur Tingkat Privasi Kontak",
        description:
          "Tentukan preferensi visibilitas profil Anda: Publik (terbuka), Khusus Anggota Terdaftar, atau Privat. Anda memegang kendali penuh atas privasi nomor telepon dan email.",
      },
      {
        stepNumber: "04",
        title: "Jelajahi Direktori Alumni",
        description:
          "Gunakan fitur pencarian direktori untuk menemukan teman seangkatan, alumni berdasarkan profesi, instansi, atau domisili kota yang sama.",
        actionText: "Cari Rekan di Direktori",
        actionHref: "/alumni",
      },
    ],
  },
  {
    id: "forum",
    name: "Forum Komunitas",
    icon: MessagesSquare,
    summary: "Berpartisipasi dalam diskusi tematik, berbagi wawasan, dan mempererat silaturahmi.",
    steps: [
      {
        stepNumber: "01",
        title: "Pilih Ruang & Kategori Diskusi",
        description:
          "Kunjungi menu Forum. Pilih kategori yang tepat, seperti Diskusi Umum, Karir & Peluang Kerja, Bisnis & UMKM Alumni, Info Madrasah, atau Agenda Reuni.",
        actionText: "Buka Halaman Forum",
        actionHref: "/forum",
      },
      {
        stepNumber: "02",
        title: "Buat Topik Baru (New Thread)",
        description:
          "Tuliskan judul topik yang jelas dan deskriptif. Tambahkan isi pembahasan, tautan rujukan, atau gambar pendukung bila diperlukan.",
        tips: "Gunakan fitur tagar agar topik Anda mudah ditemukan melalui pencarian kata kunci.",
      },
      {
        stepNumber: "03",
        title: "Berinteraksi Secara Santun",
        description:
          "Berikan tanggapan yang membangun, bagikan solusi, serta gunakan tombol suka (like) dan simpan (bookmark) untuk menandai diskusi berbobot.",
        tips: "Patuhi pedoman etika komunitas dan hindari konten berbau SARA atau ujaran kebencian.",
      },
    ],
  },
  {
    id: "karir",
    name: "Karir & Mentoring",
    icon: Briefcase,
    summary: "Membuka bursa kerja internal, peluang magang, serta program bimbingan karir.",
    steps: [
      {
        stepNumber: "01",
        title: "Bagikan Peluang Kerja & Magang",
        description:
          "Alumni yang bekerja di perusahaan atau instansi dapat mempublikasikan lowongan kerja terpercaya pada forum kategori Karir & Bisnis.",
        tips: "Sertakan syarat kualifikasi, deskripsi pekerjaan, dan tautan pendaftaran resmi.",
      },
      {
        stepNumber: "02",
        title: "Program Mentoring Karir",
        description:
          "Alumni senior dapat membuka kesempatan mentoring bagi lulusan baru (fresh graduate) untuk konsultasi persiapan tes kerja, wawancara, atau beasiswa pascasarjana.",
      },
      {
        stepNumber: "03",
        title: "Pemberdayaan UMKM Alumni",
        description:
          "Promosikan produk dan jasa bisnis Anda di etalase forum untuk saling mendukung pertumbuhan ekonomi sesama alumni madrasah.",
      },
    ],
  },
  {
    id: "agenda",
    name: "Agenda & Dokumentasi",
    icon: CalendarDays,
    summary: "Mengikuti agenda reuni, kegiatan sosial almamater, dan melihat galeri kenangan.",
    steps: [
      {
        stepNumber: "01",
        title: "Publikasi Acara Reuni Angkatan",
        description:
          "Koordinator angkatan dapat mengajukan agenda temu kangen atau musyawarah angkatan agar dipublikasikan pada kalender acara resmi.",
      },
      {
        stepNumber: "02",
        title: "Dokumentasi & Galeri Foto",
        description:
          "Kunjungi menu Arsip untuk melihat dokumentasi foto reuni akbar, wisuda kelulusan, bakti sosial, dan arsip kenangan madrasah dari masa ke masa.",
        actionText: "Lihat Galeri Dokumentasi",
        actionHref: "/archive",
      },
    ],
  },
];

export default function PanduanPage() {
  const [activeTab, setActiveTab] = React.useState("verifikasi");
  const currentModule = MODULES.find((m) => m.id === activeTab) || MODULES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <BlurFade>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0D9488] text-xs font-semibold shadow-2xs">
              <BookOpen className="size-3.5" />
              <span>Pusat Edukasi & Dokumentasi Pengguna</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A]">
              Panduan Pengguna IKAMAYOGA
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Pelajari tata cara praktis untuk mengoptimalkan seluruh fitur direktori, forum, verifikasi akun, dan jejaring karir keluarga besar alumni MAN 3 Sleman Yogyakarta.
            </p>
          </BlurFade>
        </div>

        {/* Tab Navigation Pill Bar */}
        <BlurFade delay={0.1}>
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {MODULES.map((module) => {
              const Icon = module.icon;
              const isSelected = activeTab === module.id;
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActiveTab(module.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-[#0D9488] text-white shadow-sm ring-2 ring-[#0D9488]/30"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 shadow-2xs"
                  )}
                >
                  <Icon className={cn("size-4", isSelected ? "text-white" : "text-[#0D9488]")} />
                  <span>{module.name}</span>
                </button>
              );
            })}
          </div>
        </BlurFade>

        {/* Active Module Content */}
        <div className="space-y-8">
          {/* Module Banner Card */}
          <BlurFade delay={0.15}>
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#062A24] to-[#0A3D33] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2DD4BF] uppercase tracking-wider">
                  <Sparkles className="size-3.5" />
                  <span>Modul Panduan Terpilih</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {currentModule.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {currentModule.summary}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20">
                  {currentModule.steps.length} Langkah Utama
                </span>
              </div>
            </div>
          </BlurFade>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentModule.steps.map((step, idx) => (
              <BlurFade key={step.stepNumber} delay={0.2 + idx * 0.05}>
                <div className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0D9488] border border-emerald-100">
                        Langkah {step.stepNumber}
                      </span>
                      <CheckCircle2 className="size-4 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>

                    {step.tips && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] sm:text-xs text-slate-600 flex items-start gap-2.5">
                        <span className="text-emerald-600 font-bold shrink-0">💡 Tips:</span>
                        <span>{step.tips}</span>
                      </div>
                    )}
                  </div>

                  {step.actionText && step.actionHref && (
                    <div className="pt-5 mt-4 border-t border-slate-100">
                      <Link
                        href={step.actionHref}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:underline"
                      >
                        <span>{step.actionText}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </BlurFade>
            ))}
          </div>

          {/* Bottom Help Banner */}
          <BlurFade delay={0.35}>
            <SpotlightCard className="p-8 sm:p-10 bg-white border border-slate-200/90 text-center max-w-3xl mx-auto rounded-3xl mt-12 shadow-sm">
              <div className="size-12 rounded-2xl bg-emerald-50 text-[#0D9488] flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <HelpCircle className="size-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A]">
                Masih Memiliki Pertanyaan Lain?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Kunjungi halaman FAQ untuk pertanyaan populer, atau hubungi langsung sekretariat pengurus IKAMAYOGA bila Anda memerlukan bantuan teknis.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/faq"
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#0D9488] text-white hover:bg-[#0f766e] transition-colors shadow-2xs"
                >
                  Buka Halaman FAQ
                </Link>
                <Link
                  href="/kontak"
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
                >
                  Hubungi Sekretariat
                </Link>
              </div>
            </SpotlightCard>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
