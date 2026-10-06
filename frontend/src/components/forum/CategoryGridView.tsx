"use client";

import Link from "next/link";
import Image from "next/image";
import { ForumCategoryData, ForumTopic } from "@/data/forumData";

interface CategoryGridViewProps {
  categories: ForumCategoryData[];
  topics: ForumTopic[];
  onSelectCategory: (slug: string) => void;
}

export function CategoryGridView({
  categories,
  topics,
  onSelectCategory,
}: CategoryGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {categories.map((cat) => {
        // Find latest 2 topics for this category
        const categoryTopics = topics
          .filter((t) => t.categorySlug === cat.slug)
          .slice(0, 2);

        return (
          <div
            key={cat.id}
            className="group bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-[#CBD5E1] hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* 1. Category Header with Visual Cover Image Banner */}
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
              <Image
                src={cat.image || "/images/hero-man3-sleman.jpg"}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

              {/* Floating Top Badges */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-slate-900/70 backdrop-blur-md border border-white/20">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>Kategori Forum</span>
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-white bg-slate-900/70 backdrop-blur-md border border-white/20">
                  <span>{cat.topicCount} Topik</span>
                  <span>•</span>
                  <span>{cat.postCount} Balasan</span>
                </div>
              </div>

              {/* Bottom Title on Image */}
              <div className="absolute bottom-3 left-3.5 right-3.5">
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className="text-left w-full focus:outline-none"
                >
                  <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors drop-shadow-xs">
                    {cat.name}
                  </h3>
                </button>
              </div>
            </div>

            {/* 2. Category Description */}
            <div className="p-5 border-b border-slate-100">
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>

            {/* 3. Recent Topics in this Category (Discourse Style) */}
            <div className="p-4 bg-slate-50/70 space-y-2.5 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Diskusi Terbaru
              </p>
              {categoryTopics.length === 0 ? (
                <p className="text-xs text-[#94A3B8] italic">Belum ada topik diskusi di kategori ini.</p>
              ) : (
                <ul className="space-y-2">
                  {categoryTopics.map((topic) => (
                    <li key={topic.id} className="flex items-center justify-between gap-3 text-xs">
                      <Link
                        href={`/forum/${topic.slug}`}
                        className="truncate text-[#1E293B] hover:text-[#0D9488] font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-[#0D9488] text-[10px] shrink-0">&#9656;</span>
                        <span className="truncate">{topic.title}</span>
                      </Link>
                      <span className="font-mono text-[11px] text-[#0D9488] font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0">
                        {topic.repliesCount} balasan
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 4. Action Footer */}
            <div className="px-5 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className="text-xs font-bold text-[#0D9488] hover:text-[#0f766e] flex items-center gap-1.5 transition-colors"
              >
                <span>Jelajahi Kategori</span>
                <span>&rarr;</span>
              </button>
              <Link
                href={`/forum/new?category=${cat.slug}`}
                className="text-xs font-semibold text-[#475569] hover:text-[#0F172A] px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                + Buat Topik
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
