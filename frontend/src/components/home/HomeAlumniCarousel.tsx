"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { AlumniItem, getAlumniProfileUrl } from "@/data/alumniData";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { API_BASE_URL, getAssetUrl } from "@/lib/api";

interface HomeAlumniCarouselProps {
  alumniList?: AlumniItem[];
}

function resolveAvatar(avatar: string | undefined | null, name: string): string {
  if (avatar) {
    const match = avatar.match(/(avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
    if (match) return `/images/${match[0]}`;
    return getAssetUrl(avatar);
  }
  const n = (name || "").toLowerCase();
  if (n.includes("siti")) return "/images/avatar-siti.jpg";
  if (n.includes("rina")) return "/images/avatar-rina.jpg";
  if (n.includes("budi")) return "/images/avatar-budi.jpg";
  if (n.includes("farhan")) return "/images/avatar-farhan.jpg";
  if (n.includes("nurul")) return "/images/avatar-nurul.jpg";
  return "/images/avatar-ahmad.jpg";
}

export function HomeAlumniCarousel({ alumniList }: HomeAlumniCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<AlumniItem[]>(alumniList && alumniList.length > 0 ? alumniList : []);
  const [loading, setLoading] = useState(!alumniList || alumniList.length === 0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Client-side fallback fetch if SSR returned empty
  useEffect(() => {
    if (alumniList && alumniList.length > 0) {
      setItems(alumniList);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchFeaturedAlumni = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/alumni?featured=true&per_page=6`, {
          cache: "no-store",
        });
        if (res.ok && isMounted) {
          const json = await res.json();
          const list = json?.data?.data || json?.data;
          if (Array.isArray(list) && list.length > 0) {
            const mapped: AlumniItem[] = list.map((item: any) => {
              const rawName = item.user?.name || item.name || "Alumni Terdaftar";
              const generatedSlug = rawName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

              return {
                id: item.id,
                slug: item.slug || generatedSlug || item.id,
                name: rawName,
                email: item.user?.email || "",
                avatar: resolveAvatar(item.user?.avatar || item.avatar_url, rawName),
                graduationYear: item.graduation_year || 2015,
                graduationClass: item.graduation_class || "",
                alumniIdentifier: item.alumni_identifier || item.nis || "",
                isVerified: Boolean(item.is_verified || item.verified_at),
                occupation: item.profession || item.occupation || "Alumni Terdaftar",
                company: item.company || "",
                city: item.current_city || item.city || "",
                country: item.current_country || item.country || "Indonesia",
                bio: item.bio || "",
                skills: Array.isArray(item.skills)
                  ? item.skills.map((s: any) => (typeof s === "string" ? s : s.name))
                  : [],
                socialLinks: Array.isArray(item.social_links)
                  ? item.social_links.map((s: any) => ({ platform: s.platform, url: s.url }))
                  : [],
              };
            });
            setItems(mapped);
          }
        }
      } catch (e) {
        console.error("Error fetching featured alumni:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedAlumni();
    return () => {
      isMounted = false;
    };
  }, [alumniList]);

  const checkScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const atStart = el.scrollLeft <= 10;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 10;

    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);

    // Compute active index for mobile dot indicator
    const cardWidth = el.querySelector("[data-alumni-card]")?.clientWidth || 280;
    const gap = 14;
    const newIndex = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(0, newIndex), Math.max(0, items.length - 1)));
  }, [items.length]);

  useEffect(() => {
    checkScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);

    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState]);

  const scrollPrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-alumni-card]") as HTMLElement | null;
    const step = (card?.clientWidth || 280) + 14;
    el.scrollBy({ left: -step, behavior: "smooth" });
  };

  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-alumni-card]") as HTMLElement | null;
    const step = (card?.clientWidth || 280) + 14;
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-alumni-card]") as HTMLElement | null;
    const step = (card?.clientWidth || 280) + 14;
    el.scrollTo({ left: index * step, behavior: "smooth" });
  };

  if (loading && items.length === 0) {
    return (
      <div className="relative flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Alumni Pilihan</h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Terverifikasi
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 animate-pulse space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto" />
              <div className="space-y-2 text-center">
                <div className="h-3 w-32 bg-slate-200 rounded mx-auto" />
                <div className="h-2 w-24 bg-slate-100 rounded mx-auto" />
              </div>
              <div className="h-8 bg-slate-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center text-xs text-slate-500 shadow-xs">
        Belum ada profil alumni pilihan yang dipublikasikan.
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-between flex-1">
      {/* Header Controls (prev / next buttons and See All link) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Alumni Pilihan
          </h2>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Terverifikasi
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Carousel Next / Prev Controls */}
          {items.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollLeft}
                aria-label="Alumni Sebelumnya"
                className="w-7 h-7 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-emerald-700 hover:border-emerald-300 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollRight}
                aria-label="Alumni Selanjutnya"
                className="w-7 h-7 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-emerald-700 hover:border-emerald-300 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <Link
            href="/alumni"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Lihat Semua</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div
        ref={scrollRef}
        role="region"
        aria-label="Koleksi Alumni Pilihan"
        className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth pb-2 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((alumni) => (
          <div
            key={alumni.id}
            data-alumni-card
            className="shrink-0 snap-start w-[275px] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10px)] min-h-full flex flex-col"
          >
            <SpotlightCard
              radius={280}
              color="rgba(13, 148, 136, 0.15)"
              className="h-full p-4.5 rounded-2xl border-slate-200/90 hover:border-emerald-300/80 transition-all flex flex-col justify-between"
            >
              {/* Card Top: Avatar & Alumni Batch Badge */}
              <div className="flex flex-col items-center text-center space-y-3 w-full">
                {/* Year Pill & Status */}
                <div className="w-full flex items-center justify-between text-[10px]">
                  <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                    Alumni {alumni.graduationYear || "Mayoga"}
                  </span>
                  {alumni.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 fill-emerald-100 text-emerald-600" />
                      <span>Terverifikasi</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <span>Anggota</span>
                    </span>
                  )}
                </div>

                {/* Avatar with Halo Ring */}
                <div className="relative mt-1">
                  <div className="relative w-18 h-18 rounded-full overflow-hidden border-2 border-white shadow-xs ring-2 ring-emerald-500/20 bg-slate-100">
                    <Image
                      src={resolveAvatar(alumni.avatar, alumni.name)}
                      alt={alumni.name}
                      fill
                      unoptimized
                      sizes="72px"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/avatar-ahmad.jpg";
                      }}
                      className="object-cover"
                    />
                  </div>
                  {/* Online / Active status pulse dot */}
                  <span className="absolute bottom-0.5 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                </div>

                {/* Name & Occupation */}
                <div className="space-y-1 w-full px-1">
                  <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 group-hover/spotlight:text-emerald-700 transition-colors">
                    {alumni.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-700 font-medium line-clamp-1">
                    <Briefcase className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{alumni.occupation || "Alumni Terdaftar"}</span>
                  </div>
                  {alumni.company ? (
                    <p className="text-[10px] text-slate-500 truncate">
                      {alumni.company}
                    </p>
                  ) : null}
                  {alumni.city ? (
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 pt-0.5">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{alumni.city}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Card Footer: CTA Action Button */}
              <div className="w-full pt-4 mt-2 border-t border-slate-100">
                <Link
                  href={getAlumniProfileUrl(alumni)}
                  className="w-full py-1.5 px-3 inline-flex items-center justify-center gap-1 text-xs font-semibold text-emerald-700 hover:text-white bg-emerald-50/60 hover:bg-emerald-600 border border-emerald-200/80 hover:border-emerald-600 rounded-xl transition-all duration-200 shadow-2xs"
                >
                  <span>Lihat Profil</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </SpotlightCard>
          </div>
        ))}
      </div>

      {/* Pagination Dot Indicators (visible on mobile & tablet) */}
      {items.length > 1 && (
        <div className="flex sm:hidden items-center justify-center gap-1.5 pt-3">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Lihat alumni slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-5 bg-emerald-600"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
