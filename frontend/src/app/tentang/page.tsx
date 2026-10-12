import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Users,
  GraduationCap,
  HeartHandshake,
  BookOpen,
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building2,
  Mail,
  Network,
  HelpCircle,
  Sparkles,
  Award,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Tentang IKAMAYOGA | Ikatan Alumni MAN 3 Sleman",
  description:
    "Mengenal sejarah, nilai perjuangan, empat pilar gerakan, dan simpul jejaring resmi Ikatan Alumni MAN 3 Sleman (Mayoga).",
};

const FAQ_ITEMS = [
  {
    value: "faq-1",
    question: "Bagaimana cara alumni mendaftar dan memverifikasi profil di direktori?",
    answer:
      "Alumni dapat mendaftar mandiri melalui halaman Registrasi. Anda cukup mengisi identitas diri, tahun kelulusan, dan nomor kontak aktif. Data akan diverifikasi secara otomatis atau divalidasi oleh koordinator angkatan dan moderator admin berdasarkan buku induk kelulusan almamater.",
  },
  {
    value: "faq-2",
    question: "Apakah ada iuran wajib bagi seluruh anggota IKAMAYOGA?",
    answer:
      "Tidak ada iuran wajib. Seluruh fasilitas direktori alumni, forum diskusi, dan jejaring warta dapat diakses secara terbuka bagi seluruh alumni terverifikasi. Untuk pendanaan program beasiswa dan bakti sosial almamater, pendanaan bersifat donasi sukarela (Mayoga Peduli).",
  },
  {
    value: "faq-3",
    question: "Bagaimana jika saya ingin menghubungi koordinator angkatan saya?",
    answer:
      "Anda dapat menelusuri sesama alumni di menu Direktori Alumni dengan memfilter berdasarkan tahun angkatan Anda, atau mengirimkan pesan langsung ke sekretariat humas agar kami hubungkan dengan perwakilan koordinator leting yang aktif.",
  },
  {
    value: "faq-4",
    question: "Apakah alumni dapat mengajukan kerja sama magang atau beasiswa untuk almamater?",
    answer:
      "Sangat terbuka! Kami mendorong alumni yang berkiprah di perusahaan, instansi, atau kampus untuk membuka pintu mentorship, beasiswa, maupun workshop bagi adik-adik siswa MAN 3 Sleman melalui koordinasi tim kemitraan IKAMAYOGA.",
  },
];

export default function TentangPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 md:py-16">
      <Container size="default">
        {/* Section Header / Manifesto */}
        <div className="max-w-3xl mb-12 space-y-4">
          <Badge variant="emerald" className="px-3 py-1 text-xs gap-1.5 font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Profil Resmi Almamater</span>
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Menjaga Akar Madrasah, Merawat Sinergi Lintas Generasi.
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            IKAMAYOGA adalah wadah kebersamaan bagi ribuan alumni MAN 3 Sleman (Mayoga). 
            Berpijak pada nilai keislaman, tradisi riset, dan kehangatan Yogyakarta, organisasi ini menghubungkan 
            kiprah alumni dari masa ke masa untuk almamater dan kemaslahatan masyarakat.
          </p>
        </div>

        {/* Narrative & Visual Split Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Story & Identity */}
          <Card className="lg:col-span-7 border-[#E2E8F0] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                  Jejak Langkah
                </span>
                <Badge variant="secondary" className="text-[11px] font-medium">
                  Est. Tradisi Yogyakarta
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-[#0F172A] mt-1.5">
                Rumah Bagi Ribuan Cerita dan Pengabdian
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-5 text-[#334155]">
              <p className="text-sm sm:text-base leading-relaxed">
                Beralamat di Jalan Magelang Km. 4 Mlati Sleman, MAN 3 Sleman (yang memiliki akar sejarah panjang 
                dari masa PGAN hingga madrasah riset modern) telah mengantarkan generasi demi generasi menapaki 
                dunia perguruan tinggi dan ranah profesional.
              </p>

              <p className="text-sm sm:text-base leading-relaxed">
                IKAMAYOGA lahir bukan sekadar sebagai media temu kangen seremonial, melainkan jembatan sinergi yang 
                terstruktur. Melalui platform digital ini, alumni senior dapat membimbing adik-adik yang baru lulus, 
                para profesional dapat saling bertukar peluang karir, dan almamater senantiasa mendapatkan masukan 
                serta dukungan nyata bagi pengembangan sarana madrasah.
              </p>

              <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-center sm:text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/30">
                  <div className="text-2xl font-black text-[#0D9488]">35+</div>
                  <div className="text-xs font-medium text-[#64748B] mt-0.5">Angkatan Lulusan</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-center sm:text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/30">
                  <div className="text-2xl font-black text-[#0F172A]">10.000+</div>
                  <div className="text-xs font-medium text-[#64748B] mt-0.5">Alumni Tersebar</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-center sm:text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/30">
                  <div className="text-2xl font-black text-[#0D9488]">5 Simpul</div>
                  <div className="text-xs font-medium text-[#64748B] mt-0.5">Wilayah & Korwil</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Editorial Visual Card */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="overflow-hidden border-[#E2E8F0] shadow-xs">
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                  src="/images/hero-man3-sleman.jpg"
                  alt="Kampus MAN 3 Sleman Yogyakarta"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <Badge variant="emerald" className="bg-emerald-500/90 text-white border-0 text-[11px] gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>Kampus Almamater</span>
                    </Badge>
                    <div className="text-sm font-semibold leading-snug pt-1">
                      Jl. Magelang Km. 4, Mlati, Sleman, D.I. Yogyakarta
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 text-xs text-emerald-900 leading-relaxed flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-[#0D9488]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <strong className="font-semibold block text-[#0D9488]">Pusat Verifikasi Terintegrasi</strong>
                <span>Data alumni diverifikasi secara berlapis berdasarkan nomor angkatan, buku induk kelulusan, dan pengesahan koordinator untuk menjamin jejaring yang aman dan kredibel.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Empat Pilar Gerakan (Using Shadcn Card + Velora Accent) */}
        <section className="mb-16">
          <div className="mb-8 space-y-2">
            <Badge variant="emerald" className="px-3 py-1 text-xs">
              Arah & Komitmen
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Empat Pilar Gerakan IKAMAYOGA
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
              Bukan sekadar rumusan teks di atas kertas, melainkan empat bidang aksi nyata yang dihidupkan 
              bersama oleh seluruh elemen alumni.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pilar 1 */}
            <Card className="border-[#E2E8F0] shadow-xs hover:border-emerald-400 hover:shadow-md transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0D9488] flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/50 border-emerald-200">
                    Pilar 01
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A] pt-2">
                  Ukhuwah Lintas Generasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                  Menjembatani komunikasi antara alumni angkatan senior hingga lulusan termuda. Melalui temu 
                  alumni berkala, reuni akbar, dan ruang diskusi forum, silaturahmi tetap terjaga hangat 
                  meski telah berjarak tahun dan benua.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Pilar 2 */}
            <Card className="border-[#E2E8F0] shadow-xs hover:border-sky-400 hover:shadow-md transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[11px] font-semibold text-sky-800 bg-sky-50/50 border-sky-200">
                    Pilar 02
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A] pt-2">
                  Sinergi Karir & Riset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                  Membangun ekosistem profesional yang saling menopang. Menghadirkan program mentorship kampus, 
                  rekomendasi magang, pertukaran peluang industri, serta riset bersama sesuai keahlian multi-bidang alumni.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Pilar 3 */}
            <Card className="border-[#E2E8F0] shadow-xs hover:border-amber-400 hover:shadow-md transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[11px] font-semibold text-amber-800 bg-amber-50/50 border-amber-200">
                    Pilar 03
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A] pt-2">
                  Bakti Almamater & Beasiswa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                  Wujud balas budi kepada madrasah melalui penggalangan dana beasiswa bagi adik-adik siswa 
                  berprestasi yang membutuhkan, sumbangsih buku perpustakaan, dan peningkatan sarana prasarana sekolah.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Pilar 4 */}
            <Card className="border-[#E2E8F0] shadow-xs hover:border-purple-400 hover:shadow-md transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[11px] font-semibold text-purple-800 bg-purple-50/50 border-purple-200">
                    Pilar 04
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A] pt-2">
                  Arsip Sejarah & Jejak Prestasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                  Mendokumentasikan rekam jejak guru-guru tercinta, warta karya inspiratif alumni, 
                  serta arsip prestasi madrasah agar menjadi referensi dan keteladanan bagi generasi penerus.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Simpul Jejaring & Koordinasi */}
        <Card className="border-[#E2E8F0] shadow-xs mb-16">
          <CardHeader>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              <Network className="w-3.5 h-3.5" />
              <span>Struktur Desentralisasi</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">
              Bagaimana Komunitas Kami Terhubung
            </CardTitle>
            <CardDescription className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
              Untuk mengelola ribuan anggota di dalam dan luar negeri, IKAMAYOGA beroperasi secara terdesentralisasi 
              melalui tiga simpul komunikasi.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
              <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2 hover:bg-white hover:border-emerald-300 transition-colors">
                <Badge variant="emerald" className="text-[10px]">
                  Simpul 01
                </Badge>
                <h4 className="font-bold text-[#0F172A] text-base">Pengurus Pusat</h4>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Berkoordinasi langsung dengan pihak madrasah di kampus Mayoga, merumuskan agenda tahunan, 
                  serta mengelola legalitas dan platform digital.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2 hover:bg-white hover:border-sky-300 transition-colors">
                <Badge variant="blue" className="text-[10px]">
                  Simpul 02
                </Badge>
                <h4 className="font-bold text-[#0F172A] text-base">Koordinator Angkatan</h4>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Perwakilan aktif di tiap tahun kelulusan yang bertugas memvalidasi data teman seangkatan 
                  dan mengkoordinasikan kegiatan temu leting.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2 hover:bg-white hover:border-amber-300 transition-colors">
                <Badge variant="amber" className="text-[10px]">
                  Simpul 03
                </Badge>
                <h4 className="font-bold text-[#0F172A] text-base">Koordinator Wilayah</h4>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Simpul wilayah rantau (Jabodetabek, Jawa Timur, Bandung, Luar Jawa, dan Internasional) 
                  yang menyatukan alumni di kota perantauan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Galeri Kilas Dokumentasi & Kegiatan */}
        <section className="mb-16">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <Badge variant="emerald" className="px-3 py-1 text-xs">
                Dokumentasi Komunitas
              </Badge>
              <h2 className="text-2xl font-bold text-[#0F172A] mt-2">
                Kilas Aksi & Kehangatan Mayoga
              </h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-[#0D9488] hover:text-[#0f766e]">
              <Link href="/news">
                <span>Lihat Kabar Berita</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Kartu Dokumentasi 1 */}
            <Card className="overflow-hidden border-[#E2E8F0] shadow-xs group hover:shadow-md transition-shadow">
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/images/news-reuni.jpg"
                  alt="Temu Alumni & Reuni Akbar"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-5 space-y-1.5">
                <Badge variant="emerald" className="text-[10px]">
                  Silaturahmi Akbar
                </Badge>
                <h4 className="font-bold text-[#0F172A] text-sm leading-snug pt-1">
                  Temu Kangen & Musyawarah Alumni Lintas Dasawarsa
                </h4>
                <p className="text-xs text-[#64748B] line-clamp-2">
                  Mempertemukan kembali kenangan masa putih abu-abu dan menyusun program kerja bersama.
                </p>
              </CardContent>
            </Card>

            {/* Kartu Dokumentasi 2 */}
            <Card className="overflow-hidden border-[#E2E8F0] shadow-xs group hover:shadow-md transition-shadow">
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/images/doc-baksos.jpg"
                  alt="Mayoga Peduli Sosial"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-5 space-y-1.5">
                <Badge variant="amber" className="text-[10px]">
                  Aksi Sosial
                </Badge>
                <h4 className="font-bold text-[#0F172A] text-sm leading-snug pt-1">
                  Bakti Sosial & Bantuan Siswa Mayoga Peduli
                </h4>
                <p className="text-xs text-[#64748B] line-clamp-2">
                  Penyaluran beasiswa dan paket santunan berkala untuk masyarakat dan keluarga madrasah.
                </p>
              </CardContent>
            </Card>

            {/* Kartu Dokumentasi 3 */}
            <Card className="overflow-hidden border-[#E2E8F0] shadow-xs group hover:shadow-md transition-shadow">
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/images/doc-wisuda.jpg"
                  alt="Wisuda & Kelulusan Mayoga"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-5 space-y-1.5">
                <Badge variant="blue" className="text-[10px]">
                  Generasi Penerus
                </Badge>
                <h4 className="font-bold text-[#0F172A] text-sm leading-snug pt-1">
                  Menyambut Adik-Adik Lulusan Baru ke Dunia Alumni
                </h4>
                <p className="text-xs text-[#64748B] line-clamp-2">
                  Orientasi kampus dan pendampingan karir bagi wisudawan sebelum melangkah ke perguruan tinggi.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive FAQ Section (Shadcn Accordion) */}
        <section className="mb-16">
          <Card className="border-[#E2E8F0] shadow-xs p-6 sm:p-8">
            <div className="mb-6 space-y-2">
              <Badge variant="emerald" className="px-3 py-1 text-xs gap-1.5 font-semibold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Tanya Jawab</span>
              </Badge>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
                Informasi penting seputar keanggotaan, verifikasi akun, dan program kegiatan IKAMAYOGA.
              </p>
            </div>

            <Accordion type="single" defaultValue="faq-1" className="w-full">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-[#0F172A] hover:text-[#0D9488]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </section>

        {/* Sekretariat & Dual CTA Card */}
        <Card className="border-[#E2E8F0] shadow-xs p-6 sm:p-10 bg-linear-to-br from-white to-slate-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <Badge variant="emerald" className="px-3 py-1 text-xs gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Sekretariat Resmi</span>
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                Pusat Informasi & Sekretariat IKAMAYOGA
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Kompleks Kampus MAN 3 Sleman, Jl. Magelang Km. 4, Sinduadi, Mlati, Kabupaten Sleman, 
                Daerah Istimewa Yogyakarta 55284.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#64748B] pt-1">
                <Mail className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Email resmi: <a href="mailto:kontak@mayoga.sch.id" className="text-[#0D9488] hover:underline font-semibold">kontak@mayoga.sch.id</a></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <Button asChild variant="outline" size="lg" className="rounded-xl font-bold">
                <Link href="/kontak">Hubungi Pengurus</Link>
              </Button>
              <Button asChild variant="emerald" size="lg" className="rounded-xl font-bold shadow-xs">
                <Link href="/register" className="inline-flex items-center gap-2">
                  <span>Daftar / Verifikasi Alumni</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
