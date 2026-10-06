"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { TopicListRow } from "@/components/forum/TopicListRow";
import { CategoryGridView } from "@/components/forum/CategoryGridView";
import {
  FORUM_CATEGORIES,
  ForumTopic,
  getStoredTopics,
} from "@/data/forumData";

function ForumContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialTab = searchParams.get("tab") || "latest";

  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pageSize = 6;

  const loadData = () => {
    const loaded = getStoredTopics();
    setTopics(loaded);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("m3s_forum_change", loadData);
    return () => window.removeEventListener("m3s_forum_change", loadData);
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategorySlug(initialCategory);
      setActiveTab("latest");
    }
  }, [initialCategory]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategorySlug, selectedTag, searchQuery]);

  // Filtering & Sorting
  const filteredTopics = topics
    .filter((topic) => {
      // Category filter
      if (selectedCategorySlug && topic.categorySlug !== selectedCategorySlug) {
        return false;
      }
      // Tag filter
      if (selectedTag && !topic.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = topic.title.toLowerCase().includes(query);
        const matchesBody = topic.body.toLowerCase().includes(query);
        const matchesAuthor = topic.author.name.toLowerCase().includes(query);
        const matchesTag = topic.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesBody && !matchesAuthor && !matchesTag) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned topics always come first on default lists
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (activeTab === "top") {
        return b.likesCount + b.repliesCount * 2 - (a.likesCount + a.repliesCount * 2);
      }
      if (activeTab === "new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Default: Latest activity
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / pageSize));
  const paginatedTopics = filteredTopics.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startItemIndex = (currentPage - 1) * pageSize + 1;
  const endItemIndex = Math.min(currentPage * pageSize, filteredTopics.length);

  const selectedCategoryObj = FORUM_CATEGORIES.find((c) => c.slug === selectedCategorySlug);

  return (
    <div className="py-6 sm:py-10 bg-[#F8FAFC]">
      <Container size="wide">
        {/* Top Breadcrumb & Mobile Filter Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link href="/" className="hover:text-[#0D9488] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#0F172A] font-semibold">Forum Komunitas</span>
            {selectedCategoryObj && (
              <>
                <span>/</span>
                <span className="font-bold text-[#0D9488]">{selectedCategoryObj.name}</span>
              </>
            )}
            {selectedTag && (
              <>
                <span>/</span>
                <span className="font-bold text-[#0D9488]">#{selectedTag}</span>
              </>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-[#CBD5E1] text-[#0F172A]"
          >
            <svg className="w-4 h-4 text-[#0D9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.707 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Navigasi & Kategori</span>
          </button>
        </div>

        {/* 2-Columns Discourse Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Discourse Sidebar (4 cols) */}
          <div className={`lg:col-span-4 xl:col-span-3 ${mobileSidebarOpen ? "block" : "hidden lg:block"}`}>
            <ForumSidebar
              currentTab={activeTab}
              selectedCategorySlug={selectedCategorySlug}
              selectedTag={selectedTag}
              onSelectCategory={(slug) => {
                setSelectedCategorySlug(slug);
                setSelectedTag(null);
                setActiveTab("latest");
                setMobileSidebarOpen(false);
              }}
              onSelectTag={(tag) => {
                setSelectedTag(tag);
                setSelectedCategorySlug(null);
                setActiveTab("latest");
                setMobileSidebarOpen(false);
              }}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
            />
          </div>

          {/* Right Column: Discourse Main Topic Area (8-9 cols) */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-5">
            {/* Action Bar: Discourse Filter Tabs + Search + Create Topic Button */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Discourse Tab Navigation */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("latest");
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    activeTab === "latest" && !selectedCategorySlug && !selectedTag
                      ? "bg-[#0D9488] text-white shadow-2xs"
                      : "text-[#475569] hover:bg-slate-100"
                  }`}
                >
                  Terbaru
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("categories");
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    activeTab === "categories"
                      ? "bg-[#0D9488] text-white shadow-2xs"
                      : "text-[#475569] hover:bg-slate-100"
                  }`}
                >
                  Kategori
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("top");
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                  }}
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
                  onClick={() => {
                    setActiveTab("new");
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    activeTab === "new"
                      ? "bg-[#0D9488] text-white shadow-2xs"
                      : "text-[#475569] hover:bg-slate-100"
                  }`}
                >
                  Baru (New)
                </button>
              </div>

              {/* Right: Search Input + New Topic Button */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1 sm:w-56">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari topik diskusi..."
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

                <Link
                  href="/forum/new"
                  className="inline-flex items-center justify-center min-h-[38px] px-4 py-1.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors shrink-0 gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Topik Baru</span>
                </Link>
              </div>
            </div>

            {/* Active Filter Notification Bar */}
            {(selectedCategoryObj || selectedTag || searchQuery) && (
              <div className="p-3 px-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#475569]">
                  <span>Filter Aktif:</span>
                  {selectedCategoryObj && (
                    <span className="inline-flex items-center gap-1 font-bold text-[#0F172A] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      <span
                        className="w-2 h-2 rounded-xs"
                        style={{ backgroundColor: selectedCategoryObj.color }}
                      />
                      {selectedCategoryObj.name}
                    </span>
                  )}
                  {selectedTag && (
                    <span className="font-bold text-[#0D9488] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      #{selectedTag}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="text-[#0F172A] italic">
                      &quot;{searchQuery}&quot;
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                    setSearchQuery("");
                  }}
                  className="text-[11px] font-bold text-[#0D9488] hover:underline shrink-0"
                >
                  Hapus Filter
                </button>
              </div>
            )}

            {/* Content View: Category Grid vs Topic Stream */}
            {activeTab === "categories" && !selectedCategorySlug && !selectedTag ? (
              <CategoryGridView
                categories={FORUM_CATEGORIES}
                topics={topics}
                onSelectCategory={(slug) => {
                  setSelectedCategorySlug(slug);
                  setActiveTab("latest");
                }}
              />
            ) : (
              /* Discourse Topics Table / Card Stream */
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                {/* Discourse Table Header */}
                <div className="px-5 py-3 bg-slate-50/80 border-b border-[#E2E8F0] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  <span>Topik Diskusi</span>
                  <div className="flex items-center gap-6 font-mono">
                    <span className="hidden md:inline">Peserta</span>
                    <span className="w-10 text-center">Balasan</span>
                    <span className="w-12 text-right hidden sm:inline">Dilihat</span>
                    <span className="w-10 text-right">Waktu</span>
                  </div>
                </div>

                {filteredTopics.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A]">Tidak ada topik ditemukan</h4>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                      Belum ada topik diskusi yang cocok dengan filter atau kata kunci pencarian Anda.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/forum/new"
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#0D9488] rounded-full shadow-xs hover:bg-[#0f766e] transition-colors"
                      >
                        Mulai Topik Pertama
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {paginatedTopics.map((topic) => (
                      <TopicListRow
                        key={topic.id}
                        topic={topic}
                        onCategoryClick={(catSlug) => {
                          setSelectedCategorySlug(catSlug);
                          setActiveTab("latest");
                        }}
                        onTagClick={(tag) => {
                          setSelectedTag(tag);
                          setActiveTab("latest");
                        }}
                      />
                    ))}

                    {/* Pagination Bar */}
                    <div className="px-5 py-4 bg-slate-50/70 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#64748B]">
                      <div>
                        Menampilkan <span className="font-semibold text-[#0F172A]">{startItemIndex}</span> -{" "}
                        <span className="font-semibold text-[#0F172A]">{endItemIndex}</span> dari{" "}
                        <span className="font-semibold text-[#0F172A]">{filteredTopics.length}</span> topik
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center gap-1.5 self-center sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium text-[#0F172A] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Halaman Sebelumnya"
                          >
                            &larr; Prev
                          </button>

                          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-colors ${
                                currentPage === pageNum
                                  ? "bg-[#0D9488] text-white shadow-2xs"
                                  : "bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-slate-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium text-[#0F172A] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Halaman Berikutnya"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}

export default function ForumPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-[#64748B]">Memuat forum komunitas...</div>}>
      <ForumContent />
    </Suspense>
  );
}
