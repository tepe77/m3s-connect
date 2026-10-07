"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { TopicListRow } from "@/components/forum/TopicListRow";
import { CategoryGridView } from "@/components/forum/CategoryGridView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
      // Default: Latest activity
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / pageSize));
  const paginatedTopics = filteredTopics.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startItemIndex = (currentPage - 1) * pageSize + 1;
  const endItemIndex = Math.min(currentPage * pageSize, filteredTopics.length);

  const selectedCategoryObj = FORUM_CATEGORIES.find((c) => c.slug === selectedCategorySlug);

  return (
    <div className="py-6 sm:py-10 bg-slate-50/50 min-h-screen">
      <Container size="wide">
        {/* Top Breadcrumb & Mobile Filter Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Forum Komunitas</span>
            {selectedCategoryObj && (
              <>
                <span>/</span>
                <span className="font-bold text-emerald-700">{selectedCategoryObj.name}</span>
              </>
            )}
            {selectedTag && (
              <>
                <span>/</span>
                <span className="font-bold text-emerald-700">#{selectedTag}</span>
              </>
            )}
          </nav>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden rounded-full gap-1.5 text-xs font-semibold"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Navigasi & Kategori</span>
          </Button>
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
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Discourse Tab Navigation */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant={activeTab === "latest" && !selectedCategorySlug && !selectedTag ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("latest");
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                  }}
                  className="rounded-full text-xs font-bold h-8 px-4"
                >
                  Terbaru
                </Button>

                <Button
                  type="button"
                  variant={activeTab === "categories" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("categories");
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                  }}
                  className="rounded-full text-xs font-bold h-8 px-4"
                >
                  Kategori
                </Button>

                <Button
                  type="button"
                  variant={activeTab === "top" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("top");
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                  }}
                  className="rounded-full text-xs font-bold h-8 px-4"
                >
                  Populer (Top)
                </Button>
              </div>

              {/* Right: Search Input + New Topic Button */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1 sm:w-56">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari topik diskusi..."
                    className="h-8 pl-8 pr-3 text-xs rounded-full border-slate-200 bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <Button
                  asChild
                  size="sm"
                  className="rounded-full px-4 h-8 text-xs font-bold gap-1.5 shadow-xs"
                >
                  <Link href="/forum/new">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Topik Baru</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Active Filter Notification Bar */}
            {(selectedCategoryObj || selectedTag || searchQuery) && (
              <div className="p-2.5 px-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2 text-slate-600">
                  <span className="font-medium">Filter Aktif:</span>
                  {selectedCategoryObj && (
                    <Badge
                      variant="outline"
                      className="gap-1 font-bold text-slate-900 bg-white px-2 py-0.5 border-slate-200"
                    >
                      <span
                        className="w-2 h-2 rounded-xs"
                        style={{ backgroundColor: selectedCategoryObj.color }}
                      />
                      <span>{selectedCategoryObj.name}</span>
                    </Badge>
                  )}
                  {selectedTag && (
                    <Badge variant="emerald" className="px-2 py-0.5">
                      #{selectedTag}
                    </Badge>
                  )}
                  {searchQuery && (
                    <span className="text-slate-900 font-medium italic">
                      &quot;{searchQuery}&quot;
                    </span>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategorySlug(null);
                    setSelectedTag(null);
                    setSearchQuery("");
                  }}
                  className="h-7 px-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 shrink-0 gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Hapus Filter</span>
                </Button>
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
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {/* Discourse Table Header */}
                <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Tidak ada topik ditemukan</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Belum ada topik diskusi yang cocok dengan filter atau kata kunci pencarian Anda.
                    </p>
                    <div className="pt-2">
                      <Button asChild size="sm" className="rounded-full px-5">
                        <Link href="/forum/new">
                          Mulai Topik Pertama
                        </Link>
                      </Button>
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
                    <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
                      <div>
                        Menampilkan <span className="font-semibold text-slate-900">{startItemIndex}</span> -{" "}
                        <span className="font-semibold text-slate-900">{endItemIndex}</span> dari{" "}
                        <span className="font-semibold text-slate-900">{filteredTopics.length}</span> topik
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center gap-1.5 self-center sm:self-auto">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 px-2.5 rounded-lg text-xs"
                            aria-label="Halaman Sebelumnya"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
                            <span>Prev</span>
                          </Button>

                          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                            <Button
                              key={pageNum}
                              type="button"
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="h-8 w-8 p-0 rounded-lg text-xs font-bold"
                            >
                              {pageNum}
                            </Button>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 px-2.5 rounded-lg text-xs"
                            aria-label="Halaman Berikutnya"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </Button>
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
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-500">Memuat forum komunitas...</div>}>
      <ForumContent />
    </Suspense>
  );
}
