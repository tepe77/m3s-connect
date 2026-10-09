"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Mail,
  MessagesSquare,
  HelpCircle,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlurFade } from "@/components/velora/blur-fade";
import { SpotlightCard } from "@/components/velora/spotlight-card";

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Bagaimana alur pendaftaran dan verifikasi akun alumni di IKAMAYOGA?",
    answer:
      "Alumni dapat mendaftar dengan menekan tombol 'Daftar' di pojok kanan atas, lalu mengisi nama lengkap, alamat email aktif, angkatan kelulusan, serta kata sandi. Setelah form dikirimkan, tim verifikator madrasah akan mencocokkan data Anda dengan buku induk alumni madrasah. Setelah disetujui, lencana terverifikasi (Verified Alumni) akan aktif di profil Anda.",
    category: "Akun & Keanggotaan",
  },
  {
    question: "Bagaimana jika saya lupa NISN atau nomor alumni saat melengkapi data profil?",
    answer:
      "Kolom NISN bersifat opsional. Anda tetap dapat melanjutkan registrasi dan menggunakan akun secara normal. Verifikasi keabsahan data alumni dilakukan melalui nama lengkap, tahun kelulusan, peminatan/jurusan (IPA/IPS/Keagamaan), serta konfirmasi koordinator angkatan.",
    category: "Akun & Keanggotaan",
  },
  {
    question: "Apakah nomor telepon atau email pribadi saya dapat dilihat bebas di direktori publik?",
    answer:
      "Tidak. Privasi data seluruh alumni dijaga ketat. Secara default, nomor telepon dan email tersembunyi. Pengunjung direktori yang ingin menghubungi Anda dapat menggunakan fitur kirim pesan asinkron di dalam sistem, sehingga kontak pribadi Anda tidak terekspos ke publik.",
    category: "Keamanan & Privasi",
  },
  {
    question: "Bagaimana cara membuat topik diskusi baru di Forum Komunitas?",
    answer:
      "Setelah masuk ke akun Anda, kunjungi menu Forum lalu klik tombol 'Buat Topik Baru'. Pilih kategori yang sesuai (Diskusi Umum, Karir & Peluang Kerja, Bisnis & UMKM, Info Madrasah, atau Agenda Reuni). Pastikan tulisan santun dan mematuhi etika berdiskusi demi menjaga kenyamanan keluarga besar alumni.",
    category: "Fitur Forum",
  },
  {
    question: "Apakah alumni diperkenankan membagikan informasi lowongan kerja atau program magang?",
    answer:
      "Sangat diperkenankan. Kategori forum 'Karir & Peluang Kerja' dan rubrik berita secara khusus disediakan untuk menyebarkan informasi rekrutmen, magang mahasiswa, hingga penawaran bimbingan karir (mentoring) dari alumni senior kepada lulusan yang baru menyelesaikan studi.",
    category: "Karir & Kolaborasi",
  },
  {
    question: "Bagaimana cara menyalurkan donasi, beasiswa, atau program kepedulian bagi almamater?",
    answer:
      "IKAMAYOGA mengelola program Dana Abadi Beasiswa Alumni secara berkala untuk siswa berprestasi yang membutuhkan. Anda dapat melihat informasi rincian program melalui Halaman Berita atau menghubungi Sekretariat Pengurus melalui Halaman Kontak untuk informasi nomor rekening resmi donasi madrasah.",
    category: "Kontribusi Almamater",
  },
  {
    question: "Bagaimana cara mengkoordinasikan agenda Reuni Angkatan melalui platform ini?",
    answer:
      "Panitia reuni angkatan dapat menggunakan fitur Direktori Alumni untuk mencari dan menghubungi teman satu angkatan berdasarkan filter tahun kelulusan. Selain itu, Anda juga dapat mempublikasikan agenda reuni di Forum agar diliput dalam dokumentasi kegiatan resmi.",
    category: "Kegiatan & Reuni",
  },
];

const CONTACT_LINKS = [
  {
    icon: MessagesSquare,
    label: "Hubungi Sekretariat",
    detail: "Layanan informasi & koordinasi pengurus",
    href: "/kontak",
  },
  {
    icon: BookOpen,
    label: "Panduan Pengguna",
    detail: "Tata cara lengkap penggunaan fitur",
    href: "/panduan",
  },
  {
    icon: Mail,
    label: "Email Resmi",
    detail: "sekretariat@alumni.mayoga.sch.id",
    href: "mailto:sekretariat@alumni.mayoga.sch.id",
  },
];

export function FaqTwoColumn() {
  return (
    <section className="px-4 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Sticky Column: Intro & Quick Help Card */}
        <div className="lg:col-span-5">
          <BlurFade className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#0D9488] text-xs font-semibold shadow-2xs">
              <HelpCircle className="size-3.5" />
              <span>Pusat Bantuan & Tanya Jawab</span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Pertanyaan yang Sering Diajukan
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Temukan jawaban cepat terkait akun alumni, proses verifikasi, privasi direktori, dan panduan berpartisipasi di ekosistem digital IKAMAYOGA.
            </p>

            <SpotlightCard className="mt-8 p-3 bg-white/95 border border-slate-200/90 shadow-sm">
              <div className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Butuh Bantuan Lain?
              </div>
              <ul className="divide-y divide-slate-100">
                {CONTACT_LINKS.map(({ icon: Icon, label, detail, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group/contact flex items-center gap-3.5 rounded-xl p-3 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-emerald-50/70 text-[#0D9488] transition-colors group-hover/contact:bg-[#0D9488] group-hover/contact:text-white">
                        <Icon aria-hidden className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs sm:text-sm font-semibold text-slate-800 group-hover/contact:text-[#0D9488]">
                          {label}
                        </span>
                        <span className="block text-[11px] sm:text-xs text-slate-500 truncate">
                          {detail}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 text-slate-400 transition-transform group-hover/contact:-translate-y-0.5 group-hover/contact:translate-x-0.5 group-hover/contact:text-[#0D9488]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </BlurFade>
        </div>

        {/* Right Column: Accordion Questions */}
        <div className="lg:col-span-7">
          <BlurFade delay={0.1}>
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <Accordion type="multiple" defaultValue={["item-0"]} className="divide-y divide-slate-100">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`item-${i}`} className="border-b border-slate-100 last:border-none">
                    <AccordionTrigger className="gap-3 py-4 sm:py-5 text-sm sm:text-base font-bold text-slate-800 hover:text-[#0D9488]">
                      <span className="flex items-start gap-3 sm:gap-4 text-left">
                        <span
                          aria-hidden
                          className="mt-0.5 font-mono text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-snug">{faq.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-4 pl-9 sm:pl-11 pr-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
