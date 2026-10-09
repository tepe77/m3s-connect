"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Camera,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlbumItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  count: string;
  category: string;
  image: string;
  description: string;
  photos: string[];
}

export function ArchiveGalleryView({ initialAlbums }: { initialAlbums: AlbumItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [activeAlbum, setActiveAlbum] = useState<AlbumItem | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  // Extract unique categories
  const categories = [
    "Semua",
    ...Array.from(new Set(initialAlbums.map((a) => a.category).filter(Boolean))),
  ];

  const filteredAlbums =
    selectedCategory === "Semua"
      ? initialAlbums
      : initialAlbums.filter((a) => a.category === selectedCategory);

  const activePhotos = activeAlbum?.photos?.length
    ? activeAlbum.photos
    : activeAlbum
    ? [activeAlbum.image]
    : [];

  const handleNextPhoto = useCallback(() => {
    if (activePhotos.length === 0) return;
    setPreviewIndex((prev) => (prev + 1) % activePhotos.length);
  }, [activePhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (activePhotos.length === 0) return;
    setPreviewIndex((prev) => (prev - 1 + activePhotos.length) % activePhotos.length);
  }, [activePhotos.length]);

  // Keyboard navigation for modal lightbox
  useEffect(() => {
    if (!activeAlbum) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveAlbum(null);
      } else if (e.key === "ArrowRight") {
        handleNextPhoto();
      } else if (e.key === "ArrowLeft") {
        handlePrevPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAlbum, handleNextPhoto, handlePrevPhoto]);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => {
          const count =
            cat === "Semua"
              ? initialAlbums.length
              : initialAlbums.filter((a) => a.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                selectedCategory === cat
                  ? "bg-[#0D9488] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-[#0D9488]"
              )}
            >
              <span>{cat}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  selectedCategory === cat
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Asymmetric Bento Grid Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 auto-rows-fr">
        {filteredAlbums.map((album, idx) => {
          const cycleIdx = idx % 6;

          // Helper to trigger album modal
          const openAlbum = () => {
            setActiveAlbum(album);
            setPreviewIndex(0);
          };

          // 1. Bento Showcase Hero Card (Span 8 cols, 2 rows)
          if (cycleIdx === 0) {
            return (
              <div
                key={album.id}
                onClick={openAlbum}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 lg:col-span-8 lg:row-span-2 min-h-[460px] md:min-h-[490px]"
              >
                <Image
                  src={album.image}
                  alt={album.title}
                  fill
                  priority={idx === 0}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0D9488] text-white shadow-xs backdrop-blur-md">
                      <Sparkles className="size-3.5" />
                      <span>{album.category}</span>
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-200 border border-amber-400/30 backdrop-blur-xs">
                      Dokumentasi Utama
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/55 text-white border border-white/10 backdrop-blur-md">
                    <Camera className="size-3.5 text-emerald-400" />
                    <span>{album.count}</span>
                  </span>
                </div>

                {/* Bottom Content with Photo Strip */}
                <div className="relative z-10 space-y-3 pt-24 sm:pt-28">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Calendar className="size-3.5 text-emerald-400" />
                    <span>{album.date}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                    {album.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-xl leading-relaxed">
                    {album.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/15">
                    {/* Mini photo preview strip */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {(album.photos || [album.image]).slice(0, 4).map((p, pIdx) => (
                          <div
                            key={pIdx}
                            className="relative size-7 sm:size-8 rounded-full border-2 border-slate-900 overflow-hidden"
                          >
                            <Image src={p} alt="" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-medium text-slate-300">
                        {album.photos?.length || 1} Momen Terarsip
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                      <span>Buka Album</span>
                      <ArrowRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // 2. Bento Side Card 1 (Span 4 cols, compact cinematic overlay)
          if (cycleIdx === 1) {
            return (
              <div
                key={album.id}
                onClick={openAlbum}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between p-5 lg:col-span-4 min-h-[230px]"
              >
                <Image
                  src={album.image}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0D9488] text-white backdrop-blur-md">
                    {album.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white border border-white/10 backdrop-blur-md">
                    <Camera className="size-3 text-emerald-400" />
                    <span>{album.count}</span>
                  </span>
                </div>

                <div className="relative z-10 space-y-1.5 pt-12">
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <Calendar className="size-3 text-emerald-400" />
                    <span>{album.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {album.title}
                  </h3>
                  <div className="pt-1 flex items-center justify-between text-xs font-semibold text-emerald-300">
                    <span>Lihat Foto</span>
                    <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          }

          // 3. Bento Side Card 2 (Span 4 cols, clean modern frosted card)
          if (cycleIdx === 2) {
            return (
              <div
                key={album.id}
                onClick={openAlbum}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between p-5 lg:col-span-4 min-h-[230px]"
              >
                {/* Decorative subtle top accent gradient */}
                <div className="absolute -top-12 -right-12 size-36 rounded-full bg-emerald-100/60 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#0D9488] border border-emerald-200">
                    {album.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                    <Layers className="size-3 text-[#0D9488]" />
                    <span>{album.count}</span>
                  </span>
                </div>

                <div className="relative z-10 flex items-center gap-4 py-2">
                  <div className="relative size-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-xs">
                    <Image
                      src={album.image}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-slate-500 mb-0.5">{album.date}</div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#0D9488] transition-colors line-clamp-2">
                      {album.title}
                    </h3>
                  </div>
                </div>

                <div className="relative z-10 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0D9488]">
                  <span className="text-slate-500 text-[11px] font-normal line-clamp-1">
                    {album.description}
                  </span>
                  <span className="inline-flex items-center gap-1 shrink-0 ml-2 group-hover:translate-x-1 transition-transform">
                    <span>Buka</span>
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            );
          }

          // 4, 5, 6: Bento Row 2 Cards (Span 4 cols each with varied visual rhythm)
          const isDarkOverlay = cycleIdx === 4;

          return (
            <div
              key={album.id}
              onClick={openAlbum}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between lg:col-span-4 min-h-[350px]",
                isDarkOverlay
                  ? "border-slate-800 bg-slate-950 text-white hover:border-emerald-400 p-6"
                  : "border-slate-200/80 bg-white text-slate-900 hover:border-emerald-300"
              )}
            >
              {isDarkOverlay ? (
                <>
                  <Image
                    src={album.image}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0D9488] text-white backdrop-blur-md">
                      {album.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white border border-white/10 backdrop-blur-md">
                      <Camera className="size-3 text-emerald-400" />
                      <span>{album.count}</span>
                    </span>
                  </div>

                  <div className="relative z-10 space-y-2 pt-20">
                    <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <Calendar className="size-3 text-emerald-400" />
                      <span>{album.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {album.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-emerald-300">
                      <span>Buka Galeri Foto</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Vertical Split Bento Card: Photo Top + Clean Content Bottom */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={album.image}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold backdrop-blur-md">
                      {album.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold backdrop-blur-md flex items-center gap-1">
                      <Camera className="size-3 text-emerald-400" />
                      <span>{album.count}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Calendar className="size-3 text-[#0D9488]" />
                        <span>{album.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0D9488] transition-colors line-clamp-2">
                        {album.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0D9488]">
                      <span>Buka Album</span>
                      <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-500">Belum ada dokumentasi pada kategori ini.</p>
        </div>
      )}

      {/* Enhanced Modal & Photo Lightbox with Next / Prev Navigation */}
      {activeAlbum && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveAlbum(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-bold text-emerald-400">{activeAlbum.category}</span>
                  <span>•</span>
                  <span>{activeAlbum.date}</span>
                  <span>•</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                    {activeAlbum.count}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1 truncate">
                  {activeAlbum.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveAlbum(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body: Active Photo Preview with Prev / Next Controls */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-black/90 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                {activePhotos.length > 0 && (
                  <Image
                    src={activePhotos[previewIndex] || activeAlbum.image}
                    alt={`${activeAlbum.title} - Foto ${previewIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                )}

                {/* Left Navigation Arrow */}
                {activePhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevPhoto();
                    }}
                    className="absolute left-3 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 transition-transform active:scale-90 cursor-pointer"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                )}

                {/* Right Navigation Arrow */}
                {activePhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPhoto();
                    }}
                    className="absolute right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 transition-transform active:scale-90 cursor-pointer"
                    aria-label="Foto Selanjutnya"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                )}

                {/* Photo Counter Pill */}
                {activePhotos.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 border border-white/15 text-white text-xs font-semibold backdrop-blur-md">
                    {previewIndex + 1} / {activePhotos.length}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeAlbum.description}
                </p>
              </div>

              {/* Photo Thumbnails Gallery Strip */}
              {activePhotos.length > 1 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Semua Foto ({activePhotos.length})
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5">
                    {activePhotos.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPreviewIndex(idx)}
                        className={cn(
                          "relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                          previewIndex === idx
                            ? "border-emerald-400 ring-2 ring-emerald-400/40 scale-95 opacity-100"
                            : "border-transparent opacity-60 hover:opacity-100 hover:border-emerald-400/50"
                        )}
                      >
                        <Image
                          src={photoUrl}
                          alt={`${activeAlbum.title} - Foto ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-white/10 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
              <span>Gunakan tombol panah kiri / kanan untuk berpindah foto</span>
              <button
                type="button"
                onClick={() => setActiveAlbum(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
