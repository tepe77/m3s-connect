"use client";

import Link from "next/link";
import { FORUM_CATEGORIES } from "@/data/forumData";

interface ForumSidebarProps {
  currentTab?: string;
  selectedCategorySlug?: string | null;
  selectedTag?: string | null;
  onSelectCategory?: (slug: string | null) => void;
  onSelectTag?: (tag: string | null) => void;
  onSelectTab?: (tab: string) => void;
}

export function ForumSidebar({
  currentTab = "latest",
  selectedCategorySlug = null,
  selectedTag = null,
  onSelectCategory,
  onSelectTag,
  onSelectTab,
}: ForumSidebarProps) {
  const POPULAR_TAGS = [
    "Reuni2026",
    "LowonganKerja",
    "Beasiswa",
    "UMKMAlumni",
    "OpenSource",
    "MayogaHebat",
    "Pendidikan",
  ];

  return (
    <aside className="space-y-6">
      {/* 1. Main Navigation (Discourse Style) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-xs">
        <p className="px-3 pt-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Navigasi Forum
        </p>
        <nav className="space-y-1">
          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory(null);
              if (onSelectTag) onSelectTag(null);
              if (onSelectTab) onSelectTab("categories");
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentTab === "categories" && !selectedCategorySlug && !selectedTag
                ? "bg-emerald-50 text-[#0D9488]"
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Semua Kategori</span>
            </div>
            <span className="text-[11px] font-mono text-[#94A3B8]">6</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory(null);
              if (onSelectTag) onSelectTag(null);
              if (onSelectTab) onSelectTab("latest");
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentTab === "latest" && !selectedCategorySlug && !selectedTag
                ? "bg-emerald-50 text-[#0D9488]"
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Terbaru (Latest)</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory(null);
              if (onSelectTag) onSelectTag(null);
              if (onSelectTab) onSelectTab("top");
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentTab === "top" && !selectedCategorySlug && !selectedTag
                ? "bg-emerald-50 text-[#0D9488]"
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Populer (Top)</span>
            </div>
          </button>
        </nav>
      </div>

      {/* 2. Categories Quick Filter (Discourse Colored Category Badges) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Kategori Komunitas
          </p>
          {selectedCategorySlug && onSelectCategory && (
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="text-[11px] font-bold text-[#0D9488] hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {FORUM_CATEGORIES.map((cat) => {
            const isSelected = selectedCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(isSelected ? null : cat.slug);
                  }
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                  isSelected
                    ? "bg-emerald-50 font-bold text-[#0F172A]"
                    : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8] shrink-0">
                  {cat.topicCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Popular Tags */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Tag Populer
          </p>
          {selectedTag && onSelectTag && (
            <button
              type="button"
              onClick={() => onSelectTag(null)}
              className="text-[11px] font-bold text-[#0D9488] hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  if (onSelectTag) {
                    onSelectTag(isSelected ? null : tag);
                  }
                }}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
                  isSelected
                    ? "bg-[#0D9488] text-white border-[#0D9488]"
                    : "bg-slate-50 text-[#64748B] border-slate-200 hover:border-[#0D9488] hover:text-[#0D9488]"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Community Rules & Stats Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 space-y-2.5">
        <div className="flex items-center gap-2 text-emerald-800">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-bold">Tata Tertib Komunitas</span>
        </div>
        <p className="text-[11px] text-[#065F46] leading-relaxed">
          Forum M3S Connect menjunjung tinggi sopan santun dan persaudaraan madrasah. Pastikan topik sesuai kategori.
        </p>
        <Link
          href="/forum/pedoman-etika-tata-tertib-berdiskusi-forum-m3s-connect"
          className="inline-block text-[11px] font-bold text-[#0D9488] hover:underline"
        >
          Baca Pedoman Lengkap &rarr;
        </Link>
      </div>
    </aside>
  );
}
