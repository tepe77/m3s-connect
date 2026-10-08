import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlowingEffect } from "@/components/velora/glowing-effect";

const FEATURES = [
  {
    title: "Berita",
    description: "Informasi terbaru seputar MAN 3 Sleman dan alumni.",
    href: "/news",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Forum Diskusi",
    description: "Diskusikan berbagai topik bersama alumni lainnya.",
    href: "/forum",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    title: "Info Rekam Jejak Alumni",
    description: "Temukan jejak karir dan pencapaian alumni.",
    href: "/alumni",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Riwayat Alumni",
    description: "Lihat perjalanan dan profil alumni MAN 3 Sleman.",
    href: "/stories",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Testimoni",
    description: "Kisah inspiratif dari alumni kebanggaan.",
    href: "#testimoni",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
  {
    title: "Dokumentasi",
    description: "Galeri foto dan video kegiatan alumni.",
    href: "/archive",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

/**
 * Six feature cards in a three-column grid with dynamic glowing borders
 * and ambient highlights, matching Velora UI features-icon-grid block.
 */
export function FeaturesIconGrid() {
  return (
    <section id="fitur" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
      <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-12">
        <p className="text-xs sm:text-sm font-bold tracking-wide uppercase text-[#0D9488]">
          Fitur Komunitas
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
          Pusat Kolaborasi & Jejaring Alumni
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Semua modul dirancang terpadu untuk memudahkan keluarga besar alumni Mayoga saling terhubung, berbagi inspirasi, dan bertukar peluang.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon, title, description, href }) => (
          <li key={title} className="h-full">
            <Link
              href={href}
              className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-2xl"
            >
              <div className="relative h-full rounded-2xl border border-slate-200/80 p-1.5 bg-slate-50/50 transition-all duration-300 hover:border-emerald-300/80 hover:shadow-md">
                <GlowingEffect proximity={80} spread={70} />
                <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs transition-all group-hover:bg-white/95">
                  {/* Soft ambient orb in top-right */}
                  <div
                    aria-hidden
                    className="absolute -top-16 -right-16 size-40 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors"
                  />
                  <div className="relative grid size-12 place-items-center rounded-xl border border-emerald-100 bg-gradient-to-br from-brand-from/15 to-brand-to/5 text-[#0D9488] shadow-xs group-hover:scale-105 transition-transform">
                    {icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="relative text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#0D9488] transition-colors flex items-center justify-between">
                      <span>{title}</span>
                      <ArrowRight className="size-4 text-slate-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="relative text-xs sm:text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
