"use client";

import { useState } from "react";
import Image from "next/image";

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
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Extract unique categories
  const categories = ["Semua", ...Array.from(new Set(initialAlbums.map((a) => a.category).filter(Boolean)))];

  const filteredAlbums = selectedCategory === "Semua"
    ? initialAlbums
    : initialAlbums.filter((a) => a.category === selectedCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#0D9488] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-[#0D9488]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Album Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            onClick={() => {
              setActiveAlbum(album);
              setPreviewPhoto(album.photos?.[0] || album.image);
            }}
            className="group cursor-pointer bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col"
          >
            <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
              <Image
                src={album.image}
                alt={album.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{album.count}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span className="font-semibold text-[#0D9488]">{album.category}</span>
                  <span>{album.date}</span>
                </div>
                <h2 className="text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#0D9488] transition-colors">
                  {album.title}
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                  {album.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#0D9488] font-semibold">
                <span>Buka Album Galeri</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-500">Belum ada dokumentasi pada kategori ini.</p>
        </div>
      )}

      {/* Album Modal & Photo Lightbox */}
      {activeAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#0D9488]">{activeAlbum.category}</span>
                  <span>•</span>
                  <span>{activeAlbum.date}</span>
                  <span>•</span>
                  <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">{activeAlbum.count}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{activeAlbum.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveAlbum(null);
                  setPreviewPhoto(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Tutup modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Main Photo Preview */}
              <div className="relative aspect-16/9 w-full bg-slate-900 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={previewPhoto || activeAlbum.image}
                  alt={activeAlbum.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Description */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed">{activeAlbum.description}</p>
              </div>

              {/* Photo Thumbnails Gallery */}
              {activeAlbum.photos && activeAlbum.photos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Foto dalam Album ({activeAlbum.photos.length})
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                    {activeAlbum.photos.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPreviewPhoto(photoUrl)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          previewPhoto === photoUrl
                            ? "border-[#0D9488] ring-2 ring-teal-500/30 scale-95"
                            : "border-transparent hover:border-teal-300 opacity-80 hover:opacity-100"
                        }`}
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
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Arsip Digital Komunitas MAN 3 Sleman</span>
              <button
                type="button"
                onClick={() => {
                  setActiveAlbum(null);
                  setPreviewPhoto(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
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
