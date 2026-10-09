import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#062A24] text-white mt-auto border-t border-[#0d3f37]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Socials (Col Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center text-[#2DD4BF]">
                <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
                  <circle cx="14" cy="11" r="4.5" fill="#2DD4BF" />
                  <circle cx="26" cy="11" r="4.5" fill="#14B8A6" />
                  <path
                    d="M7 29C7 23.4772 11.4772 19 17 19H18C20.5 19 22.8 20 24.5 21.6"
                    stroke="#2DD4BF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M33 29C33 23.4772 28.5228 19 23 19H22C19.5 19 17.2 20 15.5 21.6"
                    stroke="#14B8A6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white leading-tight font-sans">
                  IKA<span className="text-[#2DD4BF]">MAYOGA</span>
                </span>
                <span className="text-xs text-white/60 font-normal leading-tight">
                  Ikatan Alumni MAYOGA
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              Wadah interaksi digital keluarga besar alumni Madrasah Aliyah Negeri 3 Sleman Yogyakarta untuk mempererat silaturahmi, memfasilitasi karir, dan berkolaborasi membangun madrasah.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-[#2DD4BF] hover:border-[#2DD4BF] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-[#2DD4BF] hover:border-[#2DD4BF] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-[#2DD4BF] hover:border-[#2DD4BF] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-[#2DD4BF] hover:border-[#2DD4BF] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigasi (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">Navigasi</h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/" className="hover:text-[#2DD4BF] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#2DD4BF] transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-[#2DD4BF] transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-[#2DD4BF] transition-colors">
                  Alumni
                </Link>
              </li>
              <li>
                <Link href="/archive" className="hover:text-[#2DD4BF] transition-colors">
                  Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-[#2DD4BF] transition-colors">
                  Tentang
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Bantuan (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">Bantuan</h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/faq" className="hover:text-[#2DD4BF] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/panduan" className="hover:text-[#2DD4BF] transition-colors">
                  Panduan Pengguna
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-[#2DD4BF] transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Jaga Koneksi, Bangun Masa Depan (Col Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Jaga Koneksi, Bangun Masa Depan
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              IKAMAYOGA adalah jembatan untuk terus terhubung, berbagi, dan berkontribusi bagi almamater tercinta.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>© 2026 IKAMAYOGA. All rights reserved.</div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-rose-400">❤️</span>
            <span>for MAN 3 Sleman Yogyakarta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
