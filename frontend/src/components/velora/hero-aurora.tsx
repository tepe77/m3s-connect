import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { DotPattern } from "@/components/ui/grid-pattern";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { ShimmerButton } from "@/components/velora/shimmer-button";

/**
 * Velora Aurora Hero Section for IKAMAYOGA.
 * Centered hero with drifting aurora, dotted backdrop, announcement pill,
 * gradient text, and primary shimmer CTA.
 */
export function HeroAurora() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-16 sm:py-24 lg:py-28">
      {/* Drifting Aurora Backdrop */}
      <AuroraBackground intensity="medium" />

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
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-900 shadow-xs backdrop-blur-xs transition-colors hover:bg-white hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <span>Portal Resmi Ikatan Alumni MAN 3 Sleman Yogyakarta</span> 
          </Link>
        </div>

        {/* Main Heading */}
        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
          IKA<AnimatedGradientText>MAYOGA</AnimatedGradientText>
          <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 tracking-tight">
            Ikatan Alumni MAN 3 Sleman Yogyakarta
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
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
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs backdrop-blur-xs transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            Jelajahi Fitur
          </a>
        </div>

        {/* Quick Social Proof Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 border-t border-slate-200/60 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900">15.000+</span>
            <span className="text-xs text-slate-500 font-medium leading-tight text-left">
              Alumni<br />Terdaftar
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900">40+</span>
            <span className="text-xs text-slate-500 font-medium leading-tight text-left">
              Lintas<br />Angkatan
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900">100%</span>
            <span className="text-xs text-slate-500 font-medium leading-tight text-left">
              Jaringan<br />Terverifikasi
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
