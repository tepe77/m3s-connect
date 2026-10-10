import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { NumberTicker } from "@/components/velora/number-ticker";

/**
 * Hero Section for IKAMAYOGA.
 * Photographic backdrop without color filters or distortion,
 * centered headline and CTAs, and a floating Social Proof card
 * overlapping the bottom boundary into the section below.
 */
export function HeroAurora() {
  return (
    <section className="relative isolate -mt-20 px-4 pt-32 pb-28 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-36 min-h-[680px] sm:min-h-[740px] lg:min-h-[800px] flex flex-col justify-center">
      {/* 16:9 Photographic Backdrop with subtle dark scrim for crisp text contrast */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      >
        <Image
          src="/images/hero-alumni-new.jpg"
          alt="Latar Belakang Alumni MAN 3 Sleman"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Elegant Dark Cinematic Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/20 to-gray-950/50" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center">
          <Link
            href="/tentang"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-300 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-900/80 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <span>Portal Resmi Ikatan Alumni MAN 3 Sleman Yogyakarta</span>
          </Link>
        </div>

        {/* Main Heading */}
        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
          IKA<AnimatedGradientText>MAYOGA</AnimatedGradientText>
          <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight drop-shadow-sm">
            Ikatan Alumni MAN 3 Sleman Yogyakarta
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-sm">
          Jalin kembali silaturahmi, berbagi cerita perjalanan, temukan peluang kolaborasi & karir, serta rawat rekam jejak madrasah dalam satu platform terpadu.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <ShimmerButton href="/register">
            <span>Gabung Sekarang</span>
            <ArrowRight className="size-4" />
          </ShimmerButton>

          <a
            href="#fitur"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            Jelajahi Fitur
          </a>
        </div>
      </div>

      {/* Floating Social Proof Bar overlapping the boundary between Hero and next section */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl">
        <div className="rounded-2xl border border-white/80 bg-white/95 p-4 sm:p-5 shadow-[0_12px_40px_0_rgba(15,23,42,0.12),inset_0_1px_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl ring-1 ring-slate-900/5 overflow-hidden">
          {/* Top edge glossy highlight refraction */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
          />
          <div className="relative flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-700">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center">
                <NumberTicker value={15000} suffix="+" delay={0.1} />
              </span>
              <span className="text-xs text-slate-600 font-medium leading-tight text-left">
                Alumni<br />Terdaftar
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300/70 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center">
                <NumberTicker value={40} suffix="+" delay={0.25} />
              </span>
              <span className="text-xs text-slate-600 font-medium leading-tight text-left">
                Lintas<br />Angkatan
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300/70 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center">
                <NumberTicker value={100} suffix="%" delay={0.4} />
              </span>
              <span className="text-xs text-slate-600 font-medium leading-tight text-left">
                Jaringan<br />Terverifikasi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
