"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { TopicListRow } from "@/components/forum/TopicListRow";
import {
  FORUM_CATEGORIES,
  ForumTopic,
  getStoredTopics,
} from "@/data/forumData";

interface ForumCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function ForumCategoryPage({ params }: ForumCategoryPageProps) {
  const { slug } = use(params);

  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [activeTab, setActiveTab] = useState<"latest" | "top" | "new">("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const category = FORUM_CATEGORIES.find((c) => c.slug === slug);

  const loadData = () => {
    setTopics(getStoredTopics());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("m3s_forum_change", loadData);
    return () => window.removeEventListener("m3s_forum_change", loadData);
  }, []);

  if (!category) {
    return (
      <div className="py-20 bg-[#F8FAFC]">
        <Container size="narrow">
          <div className="p-8 sm:p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-4">
            <h1 className="text-xl font-extrabold text-[#0F172A]">Kategori Tidak Ditemukan</h1>
            <p className="text-xs text-[#64748B]">Kategori forum yang Anda cari tidak tersedia.</p>
            <div className="pt-2">
              <Link
                href="/forum"
                className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full transition-colors shadow-xs"
              >
                &larr; Kembali ke Semua Kategori
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const categoryTopics = topics
    .filter((t) => t.categorySlug === slug)
    .filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.author.name.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (activeTab === "top") {
        return b.likesCount + b.repliesCount * 2 - (a.likesCount + a.repliesCount * 2);
      }
      if (activeTab === "new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });

  return (
    <div className="py-6 sm:py-10 bg-[#F8FAFC]">
      <Container size="wide">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link href="/" className="hover:text-[#0D9488] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/forum" className="hover:text-[#0D9488] transition-colors">
              Forum
            </Link>
            <span>/</span>
            <span className="text-[#0F172A] font-bold">{category.name}</span>
          </nav>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-[#CBD5E1] text-[#0F172A]"
          >
            <svg className="w-4 h-4 text-[#0D9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.707 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Navigasi Forum</span>
          </button>
        </div>

        {/* Category Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-xs shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {category.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-[#475569]">
                {category.topicCount} topik
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>

          <Link
            href={`/forum/new?category=${category.slug}`}
            className="inline-flex items-center justify-center min-h-[42px] px-6 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors shrink-0 gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Buat Topik di Kategori Ini</span>
          </Link>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar (4 cols) */}
          <div className={`lg:col-span-4 xl:col-span-3 ${mobileSidebarOpen ? "block" : "hidden lg:block"}`}>
            <ForumSidebar
              selectedCategorySlug={category.slug}
              onSelectCategory={(s) => {
                if (s && s !== category.slug) {
                  window.location.href = `/forum/category/${s}`;
                } else if (!s) {
                  window.location.href = "/forum";
                }
              }}
              onSelectTab={(tab) => {
                window.location.href = `/forum?tab=${tab}`;
              }}
            />
          </div>

          {/* Main Topics (8 cols) */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-5">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("latest")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    activeTab === "latest"
                      ? "bg-[#0D9488] text-white shadow-2xs"
                      : "text-[#475569] hover:bg-slate-100"
                  }`}
                >
                  Terbaru
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("top")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    activeTab === "top"
                      ? "bg-[#0D9488] text-white shadow-2xs"
                      : "text-[#475569] hover:bg-slate-100"
                  }`}
                >
                  Populer (Top)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("new")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    activeTab === "new"
                      ? "bg-[#0D9488] text-white shadow-2xs"
                      : "text-[#475569] hover:bg-slate-100"
                  }`}
                >
                  Baru (New)
                </button>
              </div>

              <div className="relative sm:w-60">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari di ${category.name}...`}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                />
                <svg
                  className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Discourse Topics Stream */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div className="px-5 py-3 bg-slate-50/80 border-b border-[#E2E8F0] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                <span>Topik Diskusi di {category.name}</span>
                <div className="flex items-center gap-6 font-mono">
                  <span className="hidden md:inline">Peserta</span>
                  <span className="w-10 text-center">Balasan</span>
                  <span className="w-12 text-right hidden sm:inline">Dilihat</span>
                  <span className="w-10 text-right">Waktu</span>
                </div>
              </div>

              {categoryTopics.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <h4 className="text-sm font-bold text-[#0F172A]">Belum ada topik</h4>
                  <p className="text-xs text-[#64748B]">
                    Jadilah yang pertama memulai pembahasan di kategori {category.name}.
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/forum/new?category=${category.slug}`}
                      className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-[#0D9488] rounded-full shadow-xs hover:bg-[#0f766e] transition-colors"
                    >
                      Mulai Topik Pertama
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  {categoryTopics.map((topic) => (
                    <TopicListRow key={topic.id} topic={topic} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
