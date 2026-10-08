"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CardsCarousel, CarouselCard } from "@/components/ui/apple-cards-carousel";

interface DocItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  count: string;
  category: string;
  image: string;
  description: string;
  location?: string;
}

const FALLBACK_DOCS: DocItem[] = [
  {
    id: "album-1",
    slug: "reuni-akbar-2025",
    title: "Reuni Akbar Mayoga 2025",
    date: "12 Mei 2025",
    count: "128 Foto",
    category: "Reuni & Temu Kangen",
    image: "/images/news-reuni.jpg",
    description: "Momen kebersamaan temu alumni lintas angkatan MAN 3 Sleman di Gedung Serbaguna Mayoga. Menghadirkan ratusan alumni dari angkatan 1990 hingga 2024 dengan berbagai agenda sharing session dan temu kangen.",
    location: "Auditorium MAN 3 Sleman, Yogyakarta",
  },
  {
    id: "album-2",
    slug: "kegiatan-bakti-sosial-penyaluran-donasi",
    title: "Bakti Sosial & Santunan Masyarakat",
    date: "20 April 2025",
    count: "45 Foto",
    category: "Sosial & Pengabdian",
    image: "/images/doc-baksos.jpg",
    description: "Inisiatif kemanusiaan alumni dan civitas madrasah untuk menyalurkan paket sembako, pemeriksaan kesehatan gratis, dan bantuan pendidikan bagi keluarga pra-sejahtera di sekitar Sleman.",
    location: "Kecamatan Mlati, Sleman",
  },
  {
    id: "album-3",
    slug: "wisuda-pelepasan-siswa-kelas-xii",
    title: "Wisuda & Pelepasan Siswa Mayoga",
    date: "15 Juni 2024",
    count: "84 Foto",
    category: "Seremoni Madrasah",
    image: "/images/doc-wisuda.jpg",
    description: "Perayaan kelulusan angkatan ke-35 MAN 3 Sleman dengan pencapaian prestasi akademik dan riset yang membanggakan. Sebanyak 92% lulusan berhasil diterima di perguruan tinggi negeri terkemuka.",
    location: "Grand Ballroom Sleman",
  },
  {
    id: "album-4",
    slug: "peluncuran-portal-m3s-connect",
    title: "Peluncuran Resmi Portal M3S Connect",
    date: "10 Januari 2026",
    count: "62 Foto",
    category: "Inovasi Digital",
    image: "/images/news-peluncuran.jpg",
    description: "Peresmian platform integrasi karir, direktori alumni, dan jejaring komunitas madrasah modern yang menghubungkan alumni seluruh Indonesia dan mancanegara.",
    location: "Virtual & Mayoga Tech Hall",
  },
  {
    id: "album-5",
    slug: "simposium-riset-inovasi-internasional",
    title: "Simposium Riset & Inovasi Sains",
    date: "05 Maret 2025",
    count: "76 Foto",
    category: "Riset & Olimpiade",
    image: "/images/news-internasional.jpg",
    description: "Dokumentasi keikutsertaan delegasi riset ilmiah remaja Mayoga dalam ajang sains dan teknologi internasional dengan pameran karya inovasi terapan.",
    location: "Kolej Vokasional & Online",
  },
  {
    id: "album-6",
    slug: "sosialisasi-program-beasiswa-alumni",
    title: "Pemberian Beasiswa Prestasi Alumni",
    date: "18 Februari 2025",
    count: "38 Foto",
    category: "Beasiswa & Bantuan",
    image: "/images/news-beasiswa.jpg",
    description: "Pemberian dana beasiswa pendidikan dan bimbingan masuk perguruan tinggi oleh Paguyuban Alumni untuk adik-adik kelas berprestasi berlatar belakang prasejahtera.",
    location: "Aula Pertemuan Perpustakaan Mayoga",
  },
];

function resolveImageUrl(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+|hero-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  if (url.startsWith("/storage/")) {
    return `http://localhost:8000${url}`;
  }
  return url;
}

export function HomeDocumentationSection() {
  const [items, setItems] = useState<DocItem[]>(FALLBACK_DOCS);

  useEffect(() => {
    let isMounted = true;

    async function fetchDocs() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/documentations?limit=8", {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          const list = json?.data?.data || json?.data;
          if (Array.isArray(list) && list.length > 0) {
            const mapped: DocItem[] = list.map((item: any, idx: number) => {
              const fallback = FALLBACK_DOCS[idx % FALLBACK_DOCS.length];
              const dateFormatted = item.event_date
                ? new Date(item.event_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : fallback.date;

              const totalPhotos = item.photo_count
                ? `${item.photo_count} Foto`
                : item.photos?.length
                ? `${item.photos.length} Foto`
                : fallback.count;

              return {
                id: item.id || fallback.id,
                slug: item.slug || fallback.slug,
                title: item.title || fallback.title,
                date: dateFormatted,
                count: totalPhotos,
                category: item.category || fallback.category,
                image: resolveImageUrl(item.cover_image_url || item.cover_image, fallback.image),
                description: item.description || fallback.description,
                location: item.location || fallback.location,
              };
            });

            if (isMounted) {
              // Ensure at least 4 items so horizontal scrolling is smooth
              if (mapped.length < 4) {
                const combined = [...mapped, ...FALLBACK_DOCS.slice(mapped.length)];
                setItems(combined);
              } else {
                setItems(mapped);
              }
            }
          }
        }
      } catch {
        // Keep FALLBACK_DOCS
      }
    }

    fetchDocs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CardsCarousel label="Galeri Dokumentasi Terbaru MAN 3 Sleman">
      {items.map((doc) => (
        <CarouselCard
          key={doc.id}
          src={doc.image}
          category={doc.category}
          title={doc.title}
          date={doc.date}
          count={doc.count}
        >
          {/* Rich Content Inside Opened Modal Story */}
          <div className="space-y-4">
            {doc.location && (
              <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <svg className="w-4 h-4 text-[#0D9488] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold">{doc.location}</span>
              </div>
            )}

            <div>
              <h4 className="font-bold text-[#0F172A] mb-1.5 text-sm sm:text-base">Tentang Dokumentasi Kegiatan</h4>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                {doc.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Koleksi Foto</div>
                <div className="text-base sm:text-lg font-extrabold text-[#0D9488]">{doc.count}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Waktu Pelaksanaan</div>
                <div className="text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">{doc.date}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <Link
                href="/archive"
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] shadow-xs hover:shadow-md transition-all active:scale-98"
              >
                <span>Buka Galeri Foto Selengkapnya</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </CarouselCard>
      ))}
    </CardsCarousel>
  );
}

