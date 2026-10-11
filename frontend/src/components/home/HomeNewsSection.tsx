"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/data/newsData";
import { API_BASE_URL, getAssetUrl } from "@/lib/api";

interface HomeNewsSectionProps {
  initialNews?: NewsItem[];
}

function resolveNewsImage(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return getAssetUrl(url);
}

export function HomeNewsSection({ initialNews }: HomeNewsSectionProps) {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews && initialNews.length > 0 ? initialNews : []);
  const [loading, setLoading] = useState(!initialNews || initialNews.length === 0);

  useEffect(() => {
    if (initialNews && initialNews.length > 0) {
      setNewsList(initialNews);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/news?per_page=4`, {
          cache: "no-store",
        });
        if (res.ok && isMounted) {
          const json = await res.json();
          const list = json?.data?.data || json?.data;
          if (Array.isArray(list) && list.length > 0) {
            const mapped: NewsItem[] = list.map((item: any) => ({
              id: item.id,
              slug: item.slug,
              title: item.title,
              excerpt: item.excerpt || "",
              category: {
                name: item.category?.parent?.name || item.category?.name || "Berita",
                slug: item.category?.parent?.slug || item.category?.slug || "berita",
              },
              subCategory: {
                name: item.category?.parent ? item.category?.name : "",
                slug: item.category?.parent ? item.category?.slug : "",
              },
              tags: Array.isArray(item.tags) ? item.tags : [],
              publishedAt: item.published_at
                ? new Date(item.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "",
              readTime: item.read_time ? `${item.read_time} menit baca` : "4 menit baca",
              author: {
                name: item.author?.name || "Redaksi IKAMAYOGA",
                role: item.author?.role || "Divisi Publikasi",
                avatar: resolveNewsImage(item.author?.avatar_url || item.author?.avatar, "/images/avatar-ahmad.jpg"),
              },
              thumbnail: resolveNewsImage(item.cover_image_url || item.cover_image, "/images/news-reuni.jpg"),
              contentImages: [],
              contentHtml: [],
              comments: [],
            }));
            setNewsList(mapped);
          }
        }
      } catch (e) {
        console.error("Error fetching home news:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      isMounted = false;
    };
  }, [initialNews]);

  const featuredNews = newsList[0];
  const smallNews = newsList.slice(1, 4);

  return (
    <div className="lg:col-span-7 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0F172A]">Berita Terbaru</h2>
        <Link
          href="/news"
          className="text-xs font-semibold text-[#0D9488] hover:underline flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <span>&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1">
        {loading && newsList.length === 0 ? (
          <>
            <div className="sm:col-span-7 rounded-2xl bg-white border border-[#E5E7EB] p-5 min-h-[300px] animate-pulse flex flex-col justify-end space-y-3">
              <div className="h-3 w-28 bg-slate-200 rounded" />
              <div className="h-5 w-4/5 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
            </div>
            <div className="sm:col-span-5 flex flex-col justify-between gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-3 rounded-2xl border border-[#E5E7EB] animate-pulse flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                    <div className="h-2 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Featured Big News Card (Span 7) */}
            {featuredNews ? (
              <div className="sm:col-span-7 relative rounded-2xl overflow-hidden bg-slate-900 min-h-[300px] sm:min-h-full flex flex-col justify-end p-5 group shadow-xs">
                <Image
                  src={featuredNews.thumbnail}
                  alt={featuredNews.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/80">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{featuredNews.publishedAt}</span>
                  </div>

                  <h3 className="text-base font-bold leading-snug group-hover:text-[#2DD4BF] transition-colors">
                    <Link href={`/news/${featuredNews.slug}`}>
                      {featuredNews.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                    {featuredNews.excerpt}
                  </p>
                </div>
              </div>
            ) : (
              <div className="sm:col-span-7 p-8 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-center text-xs text-[#64748B]">
                Belum ada warta berita utama yang dipublikasikan.
              </div>
            )}

            {/* 3 Smaller Stacked News Items (Span 5) */}
            <div className="sm:col-span-5 flex flex-col justify-between gap-3">
              {smallNews.length > 0 ? (
                smallNews.map((news) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="group bg-white p-3 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs flex items-center gap-3 transition-all"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={news.thumbnail}
                        alt={news.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#0D9488] transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{news.publishedAt}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] text-center text-xs text-[#64748B]">
                  Belum ada berita tambahan lainnya.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
