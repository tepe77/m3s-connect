"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  Search,
  Plus,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { TopicListRow } from "@/components/forum/TopicListRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ForumTopic,
  getStoredTopics,
  getForumCategories,
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("m3s_token");
      const user = localStorage.getItem("m3s_user");
      setIsAuthenticated(Boolean(token && user));
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const loadData = () => {
    setTopics(getStoredTopics());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("m3s_forum_change", loadData);
    return () => window.removeEventListener("m3s_forum_change", loadData);
  }, []);

  const dynamicCategories = getForumCategories(topics);
  const category = dynamicCategories.find((c) => c.slug === slug);

  // 1. Loading auth state
  if (isAuthenticated === null) {
    return (
      <div className="py-24 text-center text-xs text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p>Memverifikasi sesi alumni...</p>
      </div>
    );
  }



  // 3. Category Not Found
  if (!category) {
    return (
      <div className="py-20 bg-slate-50/50">
        <Container size="narrow">
          <div className="p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 shadow-xs text-center space-y-4">
            <h1 className="text-xl font-extrabold text-slate-900">Kategori Tidak Ditemukan</h1>
            <p className="text-xs text-slate-500">Kategori forum yang Anda cari tidak tersedia.</p>
            <div className="pt-2">
              <Button asChild className="rounded-full px-6 gap-2">
                <Link href="/forum">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Semua Kategori</span>
                </Link>
              </Button>
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
        return (
          b.likesCount +
          (b.replies?.length ?? b.repliesCount) * 2 -
          (a.likesCount + (a.replies?.length ?? a.repliesCount) * 2)
        );
      }
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });

  return (
    <div className="py-6 sm:py-10 bg-slate-50/50 min-h-screen">
      <Container size="wide">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/forum" className="hover:text-emerald-700 transition-colors">
              Forum
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{category.name}</span>
          </nav>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-slate-300 text-slate-900"
          >
            <span>Navigasi Forum</span>
          </button>
        </div>

        {/* Category Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-xs shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {category.name}
              </h1>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] font-bold gap-1 px-2.5 py-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Khusus Member</span>
              </Badge>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {category.topicCount} topik • {category.postCount} balasan
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>

          <Button asChild className="rounded-full px-6 gap-2 shadow-xs shrink-0">
            <Link
              href={
                !isAuthenticated
                  ? `/login?redirect=/forum/new?category=${category.slug}`
                  : `/forum/new?category=${category.slug}`
              }
            >
              <Plus className="w-4 h-4" />
              <span>Buat Topik di Kategori Ini</span>
            </Link>
          </Button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar (4 cols) */}
          <div className={`lg:col-span-4 xl:col-span-3 ${mobileSidebarOpen ? "block" : "hidden lg:block"}`}>
            <ForumSidebar
              categories={dynamicCategories}
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
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={activeTab === "latest" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("latest")}
                  className="rounded-full h-8 text-xs font-bold px-4"
                >
                  Terbaru
                </Button>
                <Button
                  type="button"
                  variant={activeTab === "top" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("top")}
                  className="rounded-full h-8 text-xs font-bold px-4"
                >
                  Populer (Top)
                </Button>
              </div>

              <div className="relative sm:w-60">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari di ${category.name}...`}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Discourse Topics Stream or Blurred Login Wall */}
            {!isAuthenticated ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-white/50 shadow-2xs">
                {/* Blurred Background Preview */}
                <div
                  className="filter blur-md select-none pointer-events-none opacity-40 max-h-[500px] overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Topik Diskusi di {category.name}</span>
                    <div className="flex items-center gap-6 font-mono">
                      <span className="hidden md:inline">Peserta</span>
                      <span className="w-10 text-center">Balasan</span>
                      <span className="w-12 text-right hidden sm:inline">Dilihat</span>
                      <span className="w-10 text-right">Waktu</span>
                    </div>
                  </div>
                  <div>
                    {categoryTopics.slice(0, 5).map((topic) => (
                      <TopicListRow key={topic.id} topic={topic} />
                    ))}
                  </div>
                </div>

                {/* Floating Glassmorphism Login Wall Modal */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-gradient-to-t from-slate-900/10 via-white/80 to-transparent backdrop-blur-[2px]">
                  <div className="w-full max-w-lg p-6 sm:p-8 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-2xs">
                      <ShieldAlert className="w-7 h-7" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-0.5">
                        Kategori Khusus Alumni
                      </Badge>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Masuk untuk Mengakses Diskusi di &ldquo;{category.name}&rdquo;
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Ruang diskusi ini memuat <span className="font-bold text-slate-800">{category.topicCount} topik</span> dan{" "}
                        <span className="font-bold text-emerald-700">{category.postCount} balasan</span> yang dikhususkan bagi anggota alumni MAN 3 Sleman (Mayoga) terverifikasi.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-7 gap-2 shadow-xs">
                        <Link href={`/login?redirect=/forum/category/${slug}`}>
                          <LogIn className="w-4 h-4" />
                          <span>Masuk ke Akun Alumni</span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-6 gap-2">
                        <Link href={`/register?redirect=/forum/category/${slug}`}>
                          <span>Daftar Akun Baru</span>
                        </Link>
                      </Button>
                    </div>

                    <div className="pt-1">
                      <Link
                        href="/forum"
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Semua Forum</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                    <h4 className="text-sm font-bold text-slate-900">Belum ada topik</h4>
                    <p className="text-xs text-slate-500">
                      Jadilah yang pertama memulai pembahasan di kategori {category.name}.
                    </p>
                    <div className="pt-2">
                      <Button asChild size="sm" className="rounded-full px-5">
                        <Link href={`/forum/new?category=${category.slug}`}>
                          Mulai Topik Pertama
                        </Link>
                      </Button>
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
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
