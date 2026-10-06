"use client";

import Link from "next/link";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat) => {
        // Find latest 2 topics for this category
        const categoryTopics = topics
          .filter((t) => t.categorySlug === cat.slug)
          .slice(0, 2);

        return (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
          >
            {/* Category Header */}
            <div className="p-5 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className="flex items-center gap-2.5 text-left group"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-xs shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#0D9488] transition-colors">
                    {cat.name}
                  </h3>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
                  <span className="font-bold text-[#0F172A]">{cat.topicCount}</span>
                  <span className="text-[11px] text-[#94A3B8]">topik</span>
                </div>
              </div>

              <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Category Recent Topics Snippet (Discourse Style) */}
            <div className="p-4 bg-slate-50/50 space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Diskusi Terbaru
              </p>
              {categoryTopics.length === 0 ? (
                <p className="text-xs text-[#94A3B8] italic">Belum ada topik di kategori ini.</p>
              ) : (
                <ul className="space-y-2">
                  {categoryTopics.map((topic) => (
                    <li key={topic.id} className="flex items-center justify-between gap-2 text-xs">
                      <Link
                        href={`/forum/${topic.slug}`}
                        className="truncate text-[#334155] hover:text-[#0D9488] font-medium transition-colors"
                      >
                        {topic.title}
                      </Link>
                      <span className="font-mono text-[11px] text-[#94A3B8] shrink-0 font-semibold">
                        {topic.repliesCount} b
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bottom Link */}
            <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className="text-xs font-bold text-[#0D9488] hover:underline flex items-center gap-1"
              >
                <span>Jelajahi Kategori</span>
                <span>&rarr;</span>
              </button>
              <Link
                href={`/forum/new?category=${cat.slug}`}
                className="text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A]"
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
