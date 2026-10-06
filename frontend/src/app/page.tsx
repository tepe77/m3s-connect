import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 py-8 md:py-12">
      {/* 1. Hero Section */}
      <section aria-labelledby="hero-title" className="relative">
        <Container size="wide">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs md:text-sm font-bold tracking-widest text-[#2BA8A2] uppercase">
              Komunitas Alumni MAN 3 Sleman (Mayoga)
            </p>
            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-tight"
            >
              CONNECT. SHARE. GROW. REMEMBER.
            </h1>
            <p className="text-lg md:text-xl text-[#64748B] font-normal leading-relaxed">
              One community. Thousands of journeys. Ruang temu digital untuk saling terhubung, bertukar inspirasi, dan merawat jejak langkah para alumni madrasah.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/alumni"
                className="inline-flex items-center justify-center min-h-[48px] px-6 text-base font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2] focus-visible:ring-offset-2"
              >
                Eksplorasi Direktori Alumni
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center min-h-[48px] px-6 text-base font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2] focus-visible:ring-offset-2"
              >
                Gabung Komunitas
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Community Introduction */}
      <section className="bg-white border-y border-[#E2E8F0] py-12 md:py-16">
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Database Terstruktur
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Temukan teman satu angkatan, rekan satu kelas, dan lintas generasi berdasarkan tahun kelulusan, profesi, maupun kota domisili dengan perlindungan privasi yang jelas.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Jejaring Profesional
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Buka ruang kolaborasi karir, kesempatan kerja, bimbingan mentorship, dan pengembangan wirausaha sesama lulusan MAN 3 Sleman.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Arsip & Kisah Inspiratif
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Dokumentasi perjalanan hidup alumni dan dinamika madrasah terdokumentasi rapi agar terus menjadi teladan bagi adik-adik angkatan.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Latest News */}
      <section>
        <Container size="wide">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Kabar Berita</h2>
              <p className="text-sm text-[#64748B]">Informasi resmi kegiatan dan kabar sekolah</p>
            </div>
            <Link
              href="/news"
              className="text-sm font-semibold text-[#2BA8A2] hover:underline"
            >
              Lihat Semua Berita
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="bg-white p-6 rounded-lg border border-[#E2E8F0] hover:border-[#2BA8A2]/50 transition-colors">
              <span className="text-xs font-semibold text-[#2BA8A2] uppercase tracking-wider block mb-2">
                Kabar Alumni
              </span>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                <Link href="/news" className="hover:text-[#2BA8A2] transition-colors">
                  Peluncuran Perdana Portal Digital M3S Connect
                </Link>
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Platform resmi komunikasi dan kolaborasi alumni MAN 3 Sleman resmi diluncurkan untuk mempererat silaturahmi dan memfasilitasi pertukaran peluang karir.
              </p>
              <div className="text-xs text-[#64748B]">
                Dipublikasikan pada 6 Oktober 2026
              </div>
            </article>

            <article className="bg-white p-6 rounded-lg border border-[#E2E8F0] hover:border-[#2BA8A2]/50 transition-colors">
              <span className="text-xs font-semibold text-[#2BA8A2] uppercase tracking-wider block mb-2">
                Prestasi Madrasah
              </span>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                <Link href="/news" className="hover:text-[#2BA8A2] transition-colors">
                  Siswa MAN 3 Sleman Meraih Medali Olimpiade Sains Nasional
                </Link>
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Dukungan dan pembinaan berkelanjutan dari dewan guru serta ikatan alumni berbuah prestasi membanggakan di tingkat nasional.
              </p>
              <div className="text-xs text-[#64748B]">
                Dipublikasikan pada 2 Oktober 2026
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* 4. Alumni Stories */}
      <section className="bg-[#FFFFFF] border-y border-[#E2E8F0] py-12 md:py-16">
        <Container size="wide">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Kisah Alumni</h2>
              <p className="text-sm text-[#64748B]">Jejak perjalanan, perjuangan, dan inspirasi hidup</p>
            </div>
            <Link
              href="/stories"
              className="text-sm font-semibold text-[#2BA8A2] hover:underline"
            >
              Lihat Kisah Lainnya
            </Link>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-8 md:p-10">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold text-[#2BA8A2] tracking-wider uppercase">
                Sorotan Cerita
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
                Dari Bangku Mayoga Menuju Panggung Rekayasa Perangkat Lunak Skala Internasional
              </h3>
              <p className="text-base text-[#64748B] leading-relaxed">
                Cerita bagaimana kedisiplinan riset dan nilai spiritualitas yang dipelajari selama di MAN 3 Sleman membentuk pola pikir kritis dalam memecahkan masalah komputasi modern.
              </p>
              <div className="pt-2 text-sm font-medium text-[#0F172A]">
                Budi Santoso, Angkatan 2018 (IPA 2)
              </div>
              <div className="pt-2">
                <Link
                  href="/stories"
                  className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#2BA8A2] hover:text-[#238B86]"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Latest Discussions */}
      <section>
        <Container size="wide">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Diskusi Hangat</h2>
              <p className="text-sm text-[#64748B]">Obrolan terbaru di forum komunitas</p>
            </div>
            <Link
              href="/forum"
              className="text-sm font-semibold text-[#2BA8A2] hover:underline"
            >
              Kunjungi Forum
            </Link>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-sm bg-[#2BA8A2]/10 text-[#2BA8A2] mb-1">
                  Kegiatan & Reuni
                </span>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  <Link href="/forum" className="hover:text-[#2BA8A2] transition-colors">
                    Rencana Reuni Akbar Lintas Angkatan MAN 3 Sleman 2026
                  </Link>
                </h3>
                <p className="text-xs text-[#64748B]">
                  Dimulai oleh Budi Santoso (2018) • 12 balasan • Terakhir aktif 1 jam lalu
                </p>
              </div>
              <Link
                href="/forum"
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-1.5 text-xs font-semibold text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-md shrink-0"
              >
                Ikut Diskusi
              </Link>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-sm bg-[#2BA8A2]/10 text-[#2BA8A2] mb-1">
                  Karir & Profesi
                </span>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  <Link href="/forum" className="hover:text-[#2BA8A2] transition-colors">
                    Lowongan Magang Software Engineer dan Product Specialist untuk Mahasiswa Tingkat Akhir
                  </Link>
                </h3>
                <p className="text-xs text-[#64748B]">
                  Dimulai oleh Siti Rahmawati (2019) • 8 balasan • Terakhir aktif 3 jam lalu
                </p>
              </div>
              <Link
                href="/forum"
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-1.5 text-xs font-semibold text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-md shrink-0"
              >
                Ikut Diskusi
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Upcoming Events */}
      <section className="bg-white border-y border-[#E2E8F0] py-12 md:py-16">
        <Container size="wide">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Agenda & Kegiatan</h2>
              <p className="text-sm text-[#64748B]">Pertemuan alumni yang akan datang</p>
            </div>
            <Link
              href="/events"
              className="text-sm font-semibold text-[#2BA8A2] hover:underline"
            >
              Lihat Semua Agenda
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-4">
              <div className="text-xs font-bold text-[#2BA8A2] uppercase tracking-wider">
                14 Hari Lagi • Daring (Zoom)
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                Webinar Karir Alumni: Membangun Portofolio Global di Era Digital
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Sesi sharing bersama para alumni praktisi industri teknologi dan bisnis internasional tentang strategi karir dan etika profesional.
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#64748B] font-medium">
                  Kuota: Maks. 200 Peserta
                </span>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-md"
                >
                  Daftar RSVP
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-4">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Desember 2026 • Kampus MAN 3 Sleman
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                Temu Kangen & Silaturahmi Akbar Lintas Angkatan
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Pertemuan luring untuk seluruh angkatan dari lulusan awal hingga angkatan termuda. Rincian kepanitiaan dan waktu pelaksanaan segera diumumkan.
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#64748B] font-medium">
                  Status: Tahap Perencanaan
                </span>
                <Link
                  href="/forum"
                  className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-semibold text-[#0F172A] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] rounded-md"
                >
                  Pantau di Forum
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Community Statistics */}
      <section>
        <Container size="wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-lg bg-white border border-[#E2E8F0]">
              <div className="text-3xl md:text-4xl font-extrabold text-[#2BA8A2]">30+</div>
              <div className="text-xs md:text-sm font-medium text-[#64748B] mt-1">
                Tahun Angkatan Lulusan
              </div>
            </div>

            <div className="p-6 rounded-lg bg-white border border-[#E2E8F0]">
              <div className="text-3xl md:text-4xl font-extrabold text-[#2BA8A2]">24+</div>
              <div className="text-xs md:text-sm font-medium text-[#64748B] mt-1">
                Kota Domisili Alumni
              </div>
            </div>

            <div className="p-6 rounded-lg bg-white border border-[#E2E8F0]">
              <div className="text-3xl md:text-4xl font-extrabold text-[#2BA8A2]">100%</div>
              <div className="text-xs md:text-sm font-medium text-[#64748B] mt-1">
                Verifikasi Anggota Sah
              </div>
            </div>

            <div className="p-6 rounded-lg bg-white border border-[#E2E8F0]">
              <div className="text-3xl md:text-4xl font-extrabold text-[#2BA8A2]">Aman</div>
              <div className="text-xs md:text-sm font-medium text-[#64748B] mt-1">
                Kontrol Privasi Data Mandiri
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Join CTA */}
      <section>
        <Container size="wide">
          <div className="rounded-2xl bg-[#0F172A] text-white p-8 md:p-14 text-center max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Apakah Anda Alumni MAN 3 Sleman?
            </h2>
            <p className="text-base md:text-lg text-[#E2E8F0] max-w-2xl mx-auto leading-relaxed">
              Daftarkan diri Anda, lengkapi profil angkatan, dan bantu rekan alumni lainnya menemukan Anda kembali dalam satu wadah komunitas yang saling mendukung.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center min-h-[48px] px-8 text-base font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Daftar Sebagai Alumni Sekarang
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
