import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { DotPattern } from "@/components/ui/grid-pattern";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { NumberTicker } from "@/components/velora/number-ticker";

/**
 * Velora Aurora Hero Section for IKAMAYOGA.
 * Centered hero with 16:9 photographic landscape background, drifting aurora,
 * dotted backdrop, announcement pill, gradient text, shimmer CTA, and glassmorphic stats.
 */
export function HeroAurora() {
  return (
    <section className="relative isolate overflow-hidden -mt-20 px-4 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36 lg:min-h-[850px] xl:min-h-[900px] flex flex-col justify-center">
      {/* 16:9 Landscape Photographic Backdrop with Smooth Fade & Tone Integration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden [mask-image:radial-gradient(ellipse_120%_100%_at_50%_45%,black_70%,transparent_100%)]"
      >
        <Image
          src="/images/hero-alumni-bg.webp"
          alt="Latar Belakang Alumni MAN 3 Sleman"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_38%] opacity-85 brightness-[1.02] contrast-[1.04] transition-transform duration-1000 ease-out"
        />
        {/* Soft Ambient Overlay: lightened scrim so photo details stay crisp while text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/10 to-[#F8FAFC]" />
        {/* Subtle Emerald Brand Glow Wash */}
        <div className="absolute inset-0 bg-radial-[at_top_center] from-emerald-500/10 via-transparent to-transparent" />
      </div>

      {/* Drifting Aurora Backdrop */}
      <AuroraBackground intensity="subtle" />

      {/* Velora Dot Pattern with Radial Mask */}
      <DotPattern
        aria-hidden
        className="absolute inset-0 -z-10 size-full fill-emerald-900/10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center">
          <Link
            href="/tentang"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-white/90 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-900 shadow-xs backdrop-blur-md transition-colors hover:bg-white hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <span>Portal Resmi Ikatan Alumni MAN 3 Sleman Yogyakarta</span>
          </Link>
        </div>

        {/* Main Heading */}
        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
          IKA<AnimatedGradientText>MAYOGA</AnimatedGradientText>
          <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 tracking-tight">
            Ikatan Alumni MAN 3 Sleman Yogyakarta
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-900 max-w-2xl mx-auto leading-relaxed">
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
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white/90 px-7 text-sm font-semibold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:bg-white hover:text-slate-900 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            Jelajahi Fitur
          </a>
        </div>

        {/* Quick Social Proof Stats in Authentic Glassmorphic Bar with Velora NumberTicker */}
        <div className="relative mt-14 sm:mt-16 mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/30 p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(15,23,42,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl ring-1 ring-slate-900/5 overflow-hidden">
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
            <div className="h-6 w-px bg-slate-400/25 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center">
                <NumberTicker value={40} suffix="+" delay={0.25} />
              </span>
              <span className="text-xs text-slate-600 font-medium leading-tight text-left">
                Lintas<br />Angkatan
              </span>
            </div>
            <div className="h-6 w-px bg-slate-400/25 hidden sm:block" />
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
