import Link from "next/link";
import Image from "next/image";
import { HeroAurora } from "@/components/velora/hero-aurora";
import { FeaturesIconGrid } from "@/components/velora/features-icon-grid";
import { HomeForumThreads } from "@/components/home/HomeForumThreads";
import { HomeDocumentationSection } from "@/components/home/HomeDocumentationSection";
import { HomeTestimonialsMarquee } from "@/components/home/HomeTestimonialsMarquee";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16 bg-[#F8FAFC]">
      {/* 1. Velora Aurora Hero Section */}
      <HeroAurora />

      {/* 2. Velora Features Icon Grid */}
      <FeaturesIconGrid />


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
                      alt="Peluncuran Platform IKAMAYOGA"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#0D9488] transition-colors">
                      Peluncuran Platform IKAMAYOGA Resmi Dimulai
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
            <HomeForumThreads />
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

            {/* Velora UI Apple Cards Carousel */}
            <HomeDocumentationSection />
          </div>
        </div>
      </section>

      {/* 5. Testimonial Marquee (Velora UI Component) */}
      <HomeTestimonialsMarquee />

      {/* 6. Call To Action Banner */}
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
