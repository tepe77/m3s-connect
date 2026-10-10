"use client";

import Link from "next/link";
import { Lock, Layers, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import { ForumCategoryData, FORUM_CATEGORIES, getForumCategories } from "@/data/forumData";
import { Badge } from "@/components/ui/badge";

interface ForumSidebarProps {
  currentTab?: string;
  categories?: ForumCategoryData[];
  selectedCategorySlug?: string | null;
  selectedTag?: string | null;
  onSelectCategory?: (slug: string | null) => void;
  onSelectTag?: (tag: string | null) => void;
  onSelectTab?: (tab: string) => void;
}

export function ForumSidebar({
  currentTab = "latest",
  categories,
  selectedCategorySlug = null,
  selectedTag = null,
  onSelectCategory,
  onSelectTag,
  onSelectTab,
}: ForumSidebarProps) {
  const dynamicCategories = categories || getForumCategories();

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
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
        <p className="px-3 pt-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                ? "bg-emerald-50 text-emerald-800 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Semua Kategori</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {dynamicCategories.length}
            </span>
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
                ? "bg-emerald-50 text-emerald-800 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-teal-600 shrink-0" />
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
                ? "bg-emerald-50 text-emerald-800 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Populer (Top)</span>
            </div>
          </button>
        </nav>
      </div>

      {/* 2. Categories Quick Filter (Discourse Colored Category Badges) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Kategori Komunitas
          </p>
          {selectedCategorySlug && onSelectCategory && (
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="text-[11px] font-bold text-emerald-700 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {dynamicCategories.map((cat) => {
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
                    ? "bg-emerald-50 font-bold text-slate-900 border border-emerald-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {cat.topicCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Popular Tags */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Tag Populer
          </p>
          {selectedTag && onSelectTag && (
            <button
              type="button"
              onClick={() => onSelectTag(null)}
              className="text-[11px] font-bold text-emerald-700 hover:underline"
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
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-600 hover:text-emerald-700"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Community Rules & Privacy Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 space-y-2.5">
        <div className="flex items-center gap-2 text-emerald-900">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
          <span className="text-xs font-bold">Privasi & Etika Alumni</span>
        </div>
        <p className="text-[11px] text-emerald-950/80 leading-relaxed">
          Semua kategori dan topik di forum IKAMAYOGA dilindungi untuk memastikan ruang diskusi yang aman dan bermartabat bagi sesama alumni.
        </p>
        <Link
          href="/forum/pedoman-etika-tata-tertib-berdiskusi-forum-m3s-connect"
          className="inline-block text-[11px] font-bold text-emerald-800 hover:underline"
        >
          Pedoman Komunitas &rarr;
        </Link>
      </div>
    </aside>
  );
}
