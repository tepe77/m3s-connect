"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface DocItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  count: string;
  category: string;
  image: string;
}

const FALLBACK_DOCS: DocItem[] = [
  {
    id: "album-1",
    slug: "reuni-akbar-2025",
    title: "Reuni Akbar 2025",
    date: "12 Mei 2025",
    count: "128 Foto",
    category: "Reuni & Temu Kangen",
    image: "/images/news-reuni.jpg",
  },
  {
    id: "album-2",
    slug: "kegiatan-bakti-sosial-penyaluran-donasi",
    title: "Kegiatan Bakti Sosial",
    date: "20 April 2025",
    count: "45 Foto",
    category: "Sosial & Pengabdian",
    image: "/images/doc-baksos.jpg",
  },
  {
    id: "album-3",
    slug: "wisuda-pelepasan-siswa-kelas-xii",
    title: "Wisuda & Pelepasan Siswa",
    date: "15 Juni 2024",
    count: "84 Foto",
    category: "Seremoni Madrasah",
    image: "/images/doc-wisuda.jpg",
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDocs() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/documentations?limit=3", {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          const list = json?.data?.data || json?.data;
          if (Array.isArray(list) && list.length > 0) {
            const mapped: DocItem[] = list.slice(0, 3).map((item: any, idx: number) => {
              const fallback = FALLBACK_DOCS[idx] || FALLBACK_DOCS[0];
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
              };
            });

            if (isMounted) {
              setItems(mapped);
            }
          }
        }
      } catch {
        // Fallback to FALLBACK_DOCS
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDocs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
      {items.map((doc) => (
        <Link
          key={doc.id}
          href="/archive"
          className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col"
        >
          <div className="relative aspect-4/3 w-full bg-slate-100">
            <Image
              src={doc.image}
              alt={doc.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs flex items-center gap-1 text-[10px] font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{doc.count}</span>
            </div>
          </div>
          <div className="p-3 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
              <span className="font-semibold text-[#0D9488] truncate">{doc.category}</span>
              <span className="shrink-0">{doc.date}</span>
            </div>
            <h3 className="text-xs font-bold text-[#0F172A] leading-tight truncate group-hover:text-[#0D9488] transition-colors">
              {doc.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
