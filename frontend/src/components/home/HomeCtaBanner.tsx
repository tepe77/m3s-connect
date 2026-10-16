import Image from "next/image";
import Link from "next/link";

/**
 * HomeCtaBanner Component — MAYOGA Alumni Portal
 *
 * Full-background illustration with smooth gradient transition,
 * decorative vector elements, and high-contrast accessible typography.
 *
 * Purpose:
 * - Visually unifies community identity with a warm alumni campus illustration.
 * - Gradient overlay ensures WCAG AAA text legibility on the left.
 * - Responsive layout reflows gracefully on mobile, tablet, and desktop.
 */
export function HomeCtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#BCE4DB] bg-[#E8F8F2] shadow-xs">
        {/* 1. Full-Background Illustration */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <Image
            src="/images/cta-alumni-illustration.webp"
            alt="Ilustrasi Komunitas Alumni MAN 3 Sleman Yogyakarta"
            fill
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover object-[right_20%_center] sm:object-[right_28%_center] lg:object-right transition-transform duration-700 ease-out"
          />
        </div>

        {/* 2. Soft Gradient Overlay — Desktop Horizontal & Mobile Adaptive */}
        {/* Desktop & Tablet: Horizontal gradient from solid mint on the left to transparent on the right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(232,248,242,1) 0%, rgba(232,248,242,0.96) 38%, rgba(232,248,242,0.68) 62%, rgba(232,248,242,0.06) 100%)",
          }}
        />

        {/* Mobile: Adaptive multi-stop gradient ensuring text legibility while revealing illustration below */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(232,248,242,0.98) 0%, rgba(232,248,242,0.94) 52%, rgba(232,248,242,0.55) 100%)",
          }}
        />

        {/* 3. Decorative Vector Elements */}
        {/* Element A: Organic soft wave along the bottom */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-14 sm:h-20 z-2 pointer-events-none opacity-40 overflow-hidden"
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full text-[#A7E1D4]"
            fill="currentColor"
          >
            <path d="M0,40 C180,90 360,10 540,50 C720,90 900,30 1080,60 C1140,70 1180,65 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>

        {/* Element B: Subtle architectural contour lines & arches (connecting text with illustration) */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-1/3 w-1/3 z-2 pointer-events-none opacity-25 hidden lg:block overflow-hidden"
        >
          <svg viewBox="0 0 400 300" fill="none" className="w-full h-full text-[#0D9488]">
            {/* Soft architectural arch contour */}
            <path
              d="M100,300 C100,180 180,100 280,100 C380,100 460,180 460,300"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Gentle curved connector line */}
            <path
              d="M-50,220 C80,170 200,240 320,190"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Element C: Soft organic leaf & curve motif on top-left edge */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-44 h-44 z-2 pointer-events-none opacity-20 overflow-hidden"
        >
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#0D9488]">
            <circle cx="20" cy="20" r="80" stroke="currentColor" strokeWidth="1" />
            <path
              d="M0,0 C60,20 100,60 120,120 C70,110 30,70 0,0 Z"
              fill="currentColor"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* 4. Banner Content */}
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 lg:px-14 lg:py-14 max-w-xl lg:max-w-2xl flex flex-col items-start text-left">
          {/* Eyebrow */}
          <p className="text-xs sm:text-sm font-bold text-[#0D9488] tracking-wider uppercase mb-2">
            Komunitas Alumni MAYOGA
          </p>

          {/* Headline */}
          <h2
            id="cta-heading"
            className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-extrabold text-[#064E3B] tracking-tight leading-snug sm:leading-tight mb-3"
          >
            Jadi Bagian dari Keluarga Besar{" "}
            <span className="block sm:inline lg:block text-[#064E3B]">
              Alumni MAN 3 Sleman
            </span>
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-[#065F46] font-medium leading-relaxed mb-6 max-w-lg">
            Daftar sekarang dan nikmati semua fitur eksklusif untuk alumni.
          </p>

          {/* Primary CTA Button */}
          <div>
            <Link
              href="/register"
              className="group inline-flex items-center justify-center min-h-[44px] px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0F766E] active:bg-[#115E59] rounded-xl shadow-xs hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8F8F2]"
            >
              <span>Daftar Sekarang</span>
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
