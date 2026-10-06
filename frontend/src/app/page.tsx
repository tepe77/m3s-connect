import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16 bg-[#F8FAFC]">
      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#072B24]">
        {/* Background Campus Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-building.jpg"
            alt="Kampus MAN 3 Sleman"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark Green Gradient Mask (deep on left, translucent on right) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#062A24] via-[#07362E]/90 to-[#07362E]/40" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-white">
              {/* Pill Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#11473E]/90 border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-semibold backdrop-blur-xs">
                <span>Selamat Datang di</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  M3S <span className="text-[#2DD4BF]">CONNECT</span>
                </h1>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white/95">
                  Alumni Community Platform
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                Jalin kembali silaturahmi, berbagi cerita, dan tumbuh bersama keluarga besar alumni MAN 3 Sleman dalam satu platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center min-h-[46px] px-6 text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-lg transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
                >
                  <span>Gabung Sekarang</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a
                  href="#fitur"
                  className="inline-flex items-center justify-center min-h-[46px] px-6 text-sm font-semibold text-white bg-black/25 hover:bg-white/15 border border-white/30 rounded-lg transition-colors backdrop-blur-xs"
                >
                  Jelajahi Fitur
                </a>
              </div>
            </div>

            {/* Right Slanted Cursive Calligraphy */}
            <div className="lg:col-span-5 flex justify-end lg:pr-8">
              <div className="relative text-right transform -rotate-6 select-none pointer-events-none">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-light text-white/90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] leading-tight tracking-wide">
                  Satu Alumni,
                  <br />
                  Seribu Cerita,
                  <br />
                  Satu Tujuan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Quick Links Cards (6 Cards Grid) */}
      <section id="fitur" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {/* Card 1: Berita */}
          <Link
            href="/news"
            className="group bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] mb-1 group-hover:text-[#0D9488] transition-colors">
                Berita
              </h2>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Informasi terbaru seputar MAN 3 Sleman dan alumni.
              </p>
            </div>
          </Link>

          {/* Card 2: Forum Diskusi */}
          <Link
            href="/forum"
            className="group bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] mb-1 group-hover:text-[#0D9488] transition-colors">
                Forum Diskusi
              </h2>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Diskusikan berbagai topik bersama alumni lainnya.
              </p>
            </div>
          </Link>

          {/* Card 3: Info Rekam Jejak Alumni */}
          <Link
            href="/alumni"
            className="group bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] mb-1 group-hover:text-[#0D9488] transition-colors">
                Info Rekam Jejak Alumni
              </h2>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Temukan jejak karir dan pencapaian alumni.
              </p>
            </div>
          </Link>

          {/* Card 4: Riwayat Alumni */}
          <Link
            href="/stories"
            className="group bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] mb-1 group-hover:text-[#0D9488] transition-colors">
                Riwayat Alumni
              </h2>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Lihat perjalanan dan profil alumni MAN 3 Sleman.
              </p>
            </div>
          </Link>

          {/* Card 5: Testimoni */}
          <Link
            href="/stories"
            className="group bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] mb-1 group-hover:text-[#0D9488] transition-colors">
                Testimoni
              </h2>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Kisah inspiratif dari alumni kebanggaan.
              </p>
            </div>
          </Link>

          {/* Card 6: Dokumentasi */}
          <Link
            href="/archive"
            className="group bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] mb-1 group-hover:text-[#0D9488] transition-colors">
                Dokumentasi
              </h2>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Galeri foto dan video kegiatan alumni.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Section Row 1: Berita Terbaru (Left) & Alumni Pilihan (Right) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Berita Terbaru (~58% width: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Berita Terbaru</h2>
              <Link
                href="/news"
                className="text-xs font-semibold text-[#0D9488] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1">
              {/* Featured Big News Card (Span 7) */}
              <div className="sm:col-span-7 relative rounded-2xl overflow-hidden bg-slate-900 min-h-[300px] sm:min-h-full flex flex-col justify-end p-5 group shadow-xs">
                <Image
                  src="/images/news-reuni.jpg"
                  alt="Reuni Akbar Alumni MAN 3 Sleman 2025"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/80">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>12 Mei 2025</span>
                  </div>

                  <h3 className="text-base font-bold leading-snug group-hover:text-[#2DD4BF] transition-colors">
                    <Link href="/news/reuni-akbar-alumni-man-3-sleman-2025">
                      Reuni Akbar Alumni MAN 3 Sleman 2025 Berlangsung Meriah
                    </Link>
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                    Ribuan alumni dari berbagai angkatan hadir dalam acara Reuni Akbar yang digelar di halaman MAN 3 Sleman...
                  </p>
                </div>
              </div>

              {/* 3 Smaller Stacked News Items (Span 5) */}
              <div className="sm:col-span-5 flex flex-col justify-between gap-3">
                {/* Small News 1 */}
                <Link
                  href="/news/program-beasiswa-alumni-berprestasi"
                  className="group bg-white p-3 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs flex items-center gap-3 transition-all"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src="/images/news-beasiswa.jpg"
                      alt="Program Beasiswa"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#0D9488] transition-colors">
                      Program Beasiswa untuk Alumni Berprestasi
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>8 Mei 2025</span>
                    </div>
                  </div>
                </Link>

                {/* Small News 2 */}
                <Link
                  href="/news/alumni-man-3-sleman-sukses-kancah-internasional"
                  className="group bg-white p-3 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs flex items-center gap-3 transition-all"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src="/images/news-internasional.jpg"
                      alt="Alumni Sukses di Kancah Internasional"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#0D9488] transition-colors">
                      Alumni MAN 3 Sleman Sukses di Kancah Internasional
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>5 Mei 2025</span>
                    </div>
                  </div>
                </Link>

                {/* Small News 3 */}
                <Link
                  href="/news/peluncuran-platform-m3s-connect-resmi-dimulai"
                  className="group bg-white p-3 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs flex items-center gap-3 transition-all"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src="/images/news-peluncuran.jpg"
                      alt="Peluncuran Platform M3S Connect"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#0D9488] transition-colors">
                      Peluncuran Platform M3S Connect Resmi Dimulai
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>1 Mei 2025</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Alumni Pilihan (~42% width: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Alumni Pilihan</h2>
              <Link
                href="/alumni"
                className="text-xs font-semibold text-[#0D9488] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* 3 Profile Cards Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
              {/* Alumni Card 1 */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-emerald-300 transition-all flex flex-col items-center text-center justify-between">
                <div className="flex flex-col items-center space-y-3 w-full">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-xs">
                      <Image
                        src="/images/avatar-siti.jpg"
                        alt="Siti Nurhaliza, S.T."
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Active Green Dot */}
                    <span className="absolute bottom-0 right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A] leading-tight">
                      Siti Nurhaliza, S.T.
                    </h3>
                    <p className="text-[10px] text-[#64748B] mt-0.5 font-medium">Alumni 2012</p>
                    <p className="text-[11px] text-[#334155] font-normal mt-1 leading-snug">
                      Software Engineer
                      <br />
                      <span className="text-[#64748B]">at Tokopedia</span>
                    </p>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <Link
                    href="/alumni/alumni-1"
                    className="block w-full py-1.5 text-center text-xs font-semibold text-[#0D9488] border border-[#0D9488] hover:bg-[#0D9488] hover:text-white rounded-lg transition-colors"
                  >
                    Lihat Profil
                  </Link>
                </div>
              </div>

              {/* Alumni Card 2 */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-emerald-300 transition-all flex flex-col items-center text-center justify-between">
                <div className="flex flex-col items-center space-y-3 w-full">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-xs">
                      <Image
                        src="/images/avatar-ahmad.jpg"
                        alt="Ahmad Fauzi, M.Pd."
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Active Green Dot */}
                    <span className="absolute bottom-0 right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A] leading-tight">
                      Ahmad Fauzi, M.Pd.
                    </h3>
                    <p className="text-[10px] text-[#64748B] mt-0.5 font-medium">Alumni 2010</p>
                    <p className="text-[11px] text-[#334155] font-normal mt-1 leading-snug">
                      Dosen
                      <br />
                      <span className="text-[#64748B]">UIN Sunan Kalijaga</span>
                    </p>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <Link
                    href="/alumni/alumni-2"
                    className="block w-full py-1.5 text-center text-xs font-semibold text-[#0D9488] border border-[#0D9488] hover:bg-[#0D9488] hover:text-white rounded-lg transition-colors"
                  >
                    Lihat Profil
                  </Link>
                </div>
              </div>

              {/* Alumni Card 3 */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-emerald-300 transition-all flex flex-col items-center text-center justify-between">
                <div className="flex flex-col items-center space-y-3 w-full">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-xs">
                      <Image
                        src="/images/avatar-rina.jpg"
                        alt="Rina Oktaviani, S.E."
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Active Green Dot */}
                    <span className="absolute bottom-0 right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A] leading-tight">
                      Rina Oktaviani, S.E.
                    </h3>
                    <p className="text-[10px] text-[#64748B] mt-0.5 font-medium">Alumni 2015</p>
                    <p className="text-[11px] text-[#334155] font-normal mt-1 leading-snug">
                      Entrepreneur
                      <br />
                      <span className="text-[#64748B]">(Founder KaryaRasa)</span>
                    </p>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <Link
                    href="/alumni/alumni-3"
                    className="block w-full py-1.5 text-center text-xs font-semibold text-[#0D9488] border border-[#0D9488] hover:bg-[#0D9488] hover:text-white rounded-lg transition-colors"
                  >
                    Lihat Profil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section Row 2: Forum Diskusi Terbaru (Left) & Dokumentasi Terbaru (Right) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Forum Diskusi Terbaru (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Forum Diskusi Terbaru</h2>
              <Link
                href="/forum"
                className="text-xs font-semibold text-[#0D9488] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* 4 Forum Threads List */}
            <div className="space-y-3 flex-1">
              {/* Thread 1 */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs flex items-center justify-between gap-3 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src="/images/avatar-ahmad.jpg"
                      alt="Budi Santoso"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-[#0F172A] truncate hover:text-[#0D9488] transition-colors">
                      <Link href="/forum">
                        Rekomendasi kuliah jurusan IT untuk alumni MAN 3
                      </Link>
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Budi Santoso • 2 jam yang lalu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>24</span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-sky-50 text-sky-600">
                    Pendidikan
                  </span>
                </div>
              </div>

              {/* Thread 2 */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs flex items-center justify-between gap-3 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src="/images/avatar-siti.jpg"
                      alt="Rizky Maulana"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-[#0F172A] truncate hover:text-[#0D9488] transition-colors">
                      <Link href="/forum">
                        Peluang kerja di bidang pendidikan setelah lulus
                      </Link>
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Rizky Maulana • 4 jam yang lalu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>18</span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-600">
                    Karir
                  </span>
                </div>
              </div>

              {/* Thread 3 */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs flex items-center justify-between gap-3 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src="/images/avatar-rina.jpg"
                      alt="Dewi Lestari"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-[#0F172A] truncate hover:text-[#0D9488] transition-colors">
                      <Link href="/forum">
                        Cerita pengalaman bekerja di luar negeri
                      </Link>
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Dewi Lestari • 6 jam yang lalu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>32</span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-rose-50 text-rose-600">
                    Testimoni
                  </span>
                </div>
              </div>

              {/* Thread 4 */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs flex items-center justify-between gap-3 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src="/images/avatar-ahmad.jpg"
                      alt="Fajar Ramadhan"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-[#0F172A] truncate hover:text-[#0D9488] transition-colors">
                      <Link href="/forum">
                        Reuni angkatan 2018, yuk bikin grup!
                      </Link>
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Fajar Ramadhan • 8 jam yang lalu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>56</span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-purple-50 text-purple-600">
                    Kegiatan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dokumentasi Terbaru (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Dokumentasi Terbaru</h2>
              <Link
                href="/archive"
                className="text-xs font-semibold text-[#0D9488] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* 3 Gallery Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
              {/* Doc Card 1 */}
              <Link
                href="/archive"
                className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col"
              >
                <div className="relative aspect-4/3 w-full bg-slate-100">
                  <Image
                    src="/images/news-reuni.jpg"
                    alt="Reuni Akbar 2025"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 p-1 rounded-md bg-black/60 text-white backdrop-blur-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="text-xs font-bold text-[#0F172A] leading-tight truncate group-hover:text-[#0D9488] transition-colors">
                    Reuni Akbar 2025
                  </h3>
                  <p className="text-[10px] text-[#64748B]">12 Mei 2025</p>
                </div>
              </Link>

              {/* Doc Card 2 */}
              <Link
                href="/archive"
                className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col"
              >
                <div className="relative aspect-4/3 w-full bg-slate-100">
                  <Image
                    src="/images/doc-baksos.jpg"
                    alt="Kegiatan Bakti Sosial"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 p-1 rounded-md bg-black/60 text-white backdrop-blur-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="text-xs font-bold text-[#0F172A] leading-tight truncate group-hover:text-[#0D9488] transition-colors">
                    Kegiatan Bakti Sosial
                  </h3>
                  <p className="text-[10px] text-[#64748B]">20 April 2025</p>
                </div>
              </Link>

              {/* Doc Card 3 */}
              <Link
                href="/archive"
                className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col"
              >
                <div className="relative aspect-4/3 w-full bg-slate-100">
                  <Image
                    src="/images/doc-wisuda.jpg"
                    alt="Wisuda & Pelepasan Siswa"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 p-1 rounded-md bg-black/60 text-white backdrop-blur-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="text-xs font-bold text-[#0F172A] leading-tight truncate group-hover:text-[#0D9488] transition-colors">
                    Wisuda & Pelepasan Siswa
                  </h3>
                  <p className="text-[10px] text-[#64748B]">15 Juni 2024</p>
                </div>
              </Link>
            </div>

            {/* Slider Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
              <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#D7F1EC] via-[#E6F7F3] to-[#F1F9F6] border border-[#BCE4DB] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          {/* Subtle Organic Background Wave (Left) */}
          <div className="absolute left-0 top-0 bottom-0 w-48 opacity-40 pointer-events-none">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <path
                d="M0 0C50 30 70 80 40 130C20 160 0 200 0 200V0Z"
                fill="#A7E1D4"
              />
            </svg>
          </div>

          {/* Building Silhouette on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-20 pointer-events-none hidden md:block">
            <svg viewBox="0 0 250 120" fill="none" className="w-full h-full">
              <path d="M0 120 L30 60 L80 60 L100 20 L150 20 L170 60 L220 60 L250 120 Z" fill="#0D9488" />
            </svg>
          </div>

          {/* Text Content */}
          <div className="relative z-10 space-y-1.5 text-center md:text-left">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#064E3B] tracking-tight">
              Jadi Bagian dari Keluarga Besar Alumni MAN 3 Sleman
            </h2>
            <p className="text-xs sm:text-sm text-[#065F46] font-medium">
              Daftar sekarang dan nikmati semua fitur eksklusif untuk alumni.
            </p>
          </div>

          {/* CTA Button */}
          <div className="relative z-10 shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-lg shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <span>Daftar Sekarang</span>
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
