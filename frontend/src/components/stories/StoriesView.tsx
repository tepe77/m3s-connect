"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, BookOpen, Clock, Calendar, CheckCircle2, Send, X, ArrowRight, UserCheck } from "lucide-react";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { BlurFade } from "@/components/velora/blur-fade";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { API_BASE_URL } from "@/lib/api";

export interface StoryItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  cover_image_url?: string;
  author_name?: string;
  author_avatar?: string;
  display_author?: string;
  display_avatar?: string;
  graduation_year?: string;
  profession?: string;
  company?: string;
  display_role?: string;
  category?: string;
  reading_time?: number;
  is_featured?: boolean;
  published_at?: string;
}

interface StoriesViewProps {
  initialStories: StoryItem[];
  categories: string[];
}

export function StoriesView({ initialStories, categories }: StoriesViewProps) {
  const [stories, setStories] = useState<StoryItem[]>(initialStories);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Form submission state
  const [submitForm, setSubmitForm] = useState({
    title: "",
    author_name: "",
    graduation_year: "",
    profession: "",
    company: "",
    category: "Teknologi & Rekayasa",
    excerpt: "",
    content: "",
  });
  const [honeypot, setHoneypot] = useState<string>("");
  const [formMountedAt, setFormMountedAt] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Filtered stories list
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchCategory =
        selectedCategory === "Semua" || story.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        story.title.toLowerCase().includes(q) ||
        (story.excerpt && story.excerpt.toLowerCase().includes(q)) ||
        (story.display_author && story.display_author.toLowerCase().includes(q)) ||
        (story.profession && story.profession.toLowerCase().includes(q)) ||
        (story.company && story.company.toLowerCase().includes(q)) ||
        (story.graduation_year && story.graduation_year.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [stories, selectedCategory, searchQuery]);

  // Featured story: first featured item or first item overall
  const featuredStory = useMemo(() => {
    const featured = filteredStories.find((s) => s.is_featured);
    return featured || filteredStories[0] || null;
  }, [filteredStories]);

  // Remaining stories in grid
  const gridStories = useMemo(() => {
    if (!featuredStory) return [];
    return filteredStories.filter((s) => s.id !== featuredStory.id);
  }, [filteredStories, featuredStory]);

  const handleOpenReader = (story: StoryItem) => {
    setActiveStory(story);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSubmitForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...submitForm,
          _hp_website: honeypot,
          _form_time: formMountedAt,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Gagal mengirimkan naskah kisah alumni.");
      }

      setSubmitSuccess(true);
      setHoneypot("");
      setSubmitForm({
        title: "",
        author_name: "",
        graduation_year: "",
        profession: "",
        company: "",
        category: "Teknologi & Rekayasa",
        excerpt: "",
        content: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Terjadi kesalahan saat mengirim cerita. Silakan coba kembali.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const allCategoryPills = useMemo(() => {
    const list = ["Semua"];
    categories.forEach((cat) => {
      if (!list.includes(cat)) list.push(cat);
    });
    return list;
  }, [categories]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Section */}
      <BlurFade delay={0.05} direction="up">
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 text-xs font-semibold text-[#0D9488]">
            <span className="h-2 w-2 rounded-full bg-[#0D9488] animate-pulse" />
            <AnimatedGradientText className="font-bold tracking-wide">
              JEJAK & INSPIRASI MAYOGA
            </AnimatedGradientText>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
            Kisah Perjalanan & Rekam Jejak Alumni
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            Merekam dedikasi, perjuangan karir, dan kontribusi nyata lulusan MAN 3 Sleman di berbagai sektor kehidupan masyarakat.
          </p>
        </div>
      </BlurFade>

      {/* Filter & Search Bar */}
      <BlurFade delay={0.1} direction="up">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama alumni, angkatan, profesi, atau judul kisah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Summary Badge */}
            <div className="text-xs text-[#64748B] font-medium px-2 py-1 flex items-center gap-1.5 self-center">
              <BookOpen className="h-3.5 w-3.5 text-[#0D9488]" />
              <span>Menampilkan {filteredStories.length} kisah inspiratif</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {allCategoryPills.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? "bg-[#0D9488] text-white shadow-sm shadow-teal-900/20"
                      : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </BlurFade>

      {/* Featured Headline Spotlight (If available) */}
      {featuredStory && (
        <BlurFade delay={0.15} direction="up">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[#0D9488]" />
                Sorotan Utama Edisi Ini
              </span>
              {featuredStory.reading_time && (
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featuredStory.reading_time} menit baca
                </span>
              )}
            </div>

            <SpotlightCard className="overflow-hidden border border-slate-200/90 bg-white shadow-md hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Cover Image Side (5 cols) */}
                <div className="relative lg:col-span-5 min-h-[260px] lg:min-h-[380px] bg-slate-900 overflow-hidden group">
                  <Image
                    src={featuredStory.cover_image_url || "/images/news-internasional.jpg"}
                    alt={featuredStory.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badges on Image */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-xs">
                      {featuredStory.category || "Inspirasi Alumni"}
                    </span>
                    {featuredStory.graduation_year && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-xs">
                        Angkatan {featuredStory.graduation_year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Side (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {featuredStory.published_at
                          ? new Date(featuredStory.published_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Terbaru"}
                      </span>
                    </div>

                    <h2
                      onClick={() => handleOpenReader(featuredStory)}
                      className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-snug cursor-pointer hover:text-[#0D9488] transition-colors"
                    >
                      {featuredStory.title}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
                      {featuredStory.excerpt || "Kisah perjalanan hidup dan dedikasi alumni MAN 3 Sleman dalam merajut mimpi dan berkontribusi untuk masyarakat luas."}
                    </p>
                  </div>

                  {/* Author Profile Bar + Read CTA */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <Image
                          src={featuredStory.display_avatar || "/images/avatar-ahmad.jpg"}
                          alt={featuredStory.display_author || "Alumni Mayoga"}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-[#0F172A]">
                          {featuredStory.display_author || "Alumni Mayoga"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {featuredStory.display_role || "Lulusan MAN 3 Sleman"}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenReader(featuredStory)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D9488] text-white text-xs sm:text-sm font-bold hover:bg-[#0F766E] transition-all shadow-xs cursor-pointer"
                    >
                      <span>Baca Kisah Lengkap</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </BlurFade>
      )}

      {/* Grid of Other Stories */}
      {gridStories.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Koleksi Cerita Alumni Lainnya
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {gridStories.length} Kisah Tersedia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridStories.map((story, idx) => (
              <BlurFade key={story.id} delay={0.05 * idx} direction="up">
                <SpotlightCard className="h-full flex flex-col justify-between overflow-hidden border border-slate-200/90 bg-white hover:border-teal-500/40 hover:shadow-lg transition-all duration-300 group">
                  {/* Card Cover */}
                  <div
                    onClick={() => handleOpenReader(story)}
                    className="relative w-full h-48 bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={story.cover_image_url || "/images/news-internasional.jpg"}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0D9488] text-white shadow-xs">
                        {story.category || "Inspirasi"}
                      </span>
                    </div>

                    {story.graduation_year && (
                      <div className="absolute bottom-3 left-3 text-white text-xs font-medium drop-shadow-sm">
                        Angkatan {story.graduation_year}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {story.published_at
                            ? new Date(story.published_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Terbaru"}
                        </span>
                        {story.reading_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {story.reading_time} min
                          </span>
                        )}
                      </div>

                      <h4
                        onClick={() => handleOpenReader(story)}
                        className="text-base font-bold text-[#0F172A] leading-snug cursor-pointer group-hover:text-[#0D9488] transition-colors line-clamp-2"
                      >
                        {story.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {story.excerpt || "Pengalaman dan dedikasi membanggakan dari alumni madrasah."}
                      </p>
                    </div>

                    {/* Author Footnote */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <Image
                            src={story.display_avatar || "/images/avatar-ahmad.jpg"}
                            alt={story.display_author || "Alumni"}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left max-w-[150px]">
                          <div className="text-xs font-bold text-[#0F172A] truncate">
                            {story.display_author || "Alumni Mayoga"}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {story.profession || story.company || "Lulusan Mayoga"}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenReader(story)}
                        className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Baca</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              </BlurFade>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredStories.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-[#0F172A]">
            Tidak ada kisah alumni yang sesuai
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kata kunci atau filter kategori yang dipilih belum memiliki data yang cocok. Silakan ganti kata kunci atau reset filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* CTA Section: Alumni Story Contribution */}
      <BlurFade delay={0.2} direction="up">
        <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-teal-300 border border-teal-400/20">
              Ruang Kontribusi Alumni
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Punya Cerita Perjalanan yang Ingin Dibagikan?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Jejak langkah, suka duka perkuliahan, dan pengalaman karirmu adalah lentera inspirasi bagi ribuan adik kelas di MAN 3 Sleman.
            </p>
            <div className="pt-2">
              <ShimmerButton
                onClick={() => {
                  setSubmitSuccess(false);
                  setSubmitError(null);
                  setHoneypot("");
                  setFormMountedAt(Date.now());
                  setIsSubmitModalOpen(true);
                }}
              >
                <span>Bagikan Kisah Perjalananmu</span>
                <Send className="h-4 w-4" />
              </ShimmerButton>
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[#0D9488]/20 blur-3xl"
          />
        </div>
      </BlurFade>

      {/* Modal 1: Interactive Story Reader Modal */}
      <Dialog open={!!activeStory} onOpenChange={(open) => !open && setActiveStory(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 rounded-2xl bg-white text-slate-800">
          {activeStory && (
            <div>
              {/* Header Image Cover */}
              <div className="relative h-64 sm:h-80 w-full bg-slate-900">
                <Image
                  src={activeStory.cover_image_url || "/images/news-internasional.jpg"}
                  alt={activeStory.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0D9488] text-white">
                    {activeStory.category || "Inspirasi Alumni"}
                  </span>
                  {activeStory.graduation_year && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800">
                      Angkatan {activeStory.graduation_year}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <div className="text-xs text-teal-300 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {activeStory.published_at
                      ? new Date(activeStory.published_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Terbaru"}
                    {activeStory.reading_time && (
                      <>
                        <span>•</span>
                        <Clock className="h-3.5 w-3.5" />
                        <span>{activeStory.reading_time} menit baca</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Story Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-snug">
                    {activeStory.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 mt-2 font-medium">
                    {activeStory.excerpt}
                  </DialogDescription>
                </DialogHeader>

                {/* Author Card Info */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-200 bg-white shrink-0">
                    <Image
                      src={activeStory.display_avatar || "/images/avatar-ahmad.jpg"}
                      alt={activeStory.display_author || "Alumni"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0F172A]">
                      {activeStory.display_author || "Alumni Mayoga"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {activeStory.display_role || "Lulusan MAN 3 Sleman"}
                    </div>
                  </div>
                </div>

                {/* Full Article Content */}
                <div
                  className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-4 text-slate-700 font-normal"
                  dangerouslySetInnerHTML={{ __html: activeStory.content }}
                />

                {/* Footer Advice / Closing */}
                <div className="pt-6 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500 italic">
                    "Karya dan dedikasi alumni merupakan cermin keteladanan bagi keluarga besar IKAMAYOGA."
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal 2: Submit Alumni Story Form */}
      <Dialog
        open={isSubmitModalOpen}
        onOpenChange={(open) => {
          if (open) {
            setFormMountedAt(Date.now());
            setHoneypot("");
          }
          setIsSubmitModalOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-slate-200 rounded-2xl bg-white text-slate-800">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              Kirim Kisah Perjalanan Alumni
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500">
              Bagikan kisah perjuangan, rekam jejak profesi, atau pengalaman belajar Anda selama di Mayoga. Naskah akan ditinjau oleh tim redaksi sebelum ditampilkan ke publik.
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">
                Kisah Anda Berhasil Dikirim!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Terima kasih atas kontribusi Anda. Tulisan Anda telah masuk ke daftar moderasi redaksi IKAMAYOGA dan akan segera ditayangkan setelah diverifikasi.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#0D9488] text-white text-xs font-bold hover:bg-[#0F766E] transition-colors"
                >
                  Tutup Jendela
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitStory} className="space-y-4 pt-2">
              {/* Honeypot Bot Trap: Invisible to real users */}
              <div className="sr-only opacity-0 absolute -z-10 h-0 w-0 pointer-events-none" aria-hidden="true">
                <label htmlFor="_hp_website">Website</label>
                <input
                  type="text"
                  id="_hp_website"
                  name="_hp_website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {submitError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Judul Kisah Inspiratif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Dari Mayoga Menembus Panggung Riset Internasional"
                  value={submitForm.title}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author_name"
                    required
                    placeholder="Contoh: Budi Santoso, S.Kom."
                    value={submitForm.author_name}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Tahun Kelulusan / Angkatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="graduation_year"
                    required
                    placeholder="Contoh: 2018 (IPA 2)"
                    value={submitForm.graduation_year}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Profesi / Jabatan Saat Ini
                  </label>
                  <input
                    type="text"
                    name="profession"
                    placeholder="Contoh: Senior Software Engineer"
                    value={submitForm.profession}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Instansi / Perusahaan
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Contoh: PT Teknologi Bangsa"
                    value={submitForm.company}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Bidang / Kategori <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={submitForm.category}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
                >
                  <option value="Teknologi & Rekayasa">Teknologi & Rekayasa</option>
                  <option value="Bisnis & Wirausaha">Bisnis & Wirausaha</option>
                  <option value="Akademisi & Riset">Akademisi & Riset</option>
                  <option value="Kesehatan & Medis">Kesehatan & Medis</option>
                  <option value="Seni & Komunikasi">Seni & Komunikasi</option>
                  <option value="Pengabdian & Sosial">Pengabdian & Sosial</option>
                  <option value="Pemerintahan & Hukum">Pemerintahan & Hukum</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Ringkasan Cerita (Excerpt 1 sampai 2 kalimat)
                </label>
                <input
                  type="text"
                  name="excerpt"
                  placeholder="Intisari pengalaman yang memotivasi pembaca..."
                  value={submitForm.excerpt}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Isi Lengkap Cerita & Pesan Inspiratif <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="content"
                  required
                  rows={5}
                  placeholder="Tuliskan pengalaman Anda dari masa belajar di Mayoga hingga pencapaian saat ini..."
                  value={submitForm.content}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0D9488] text-white text-xs font-bold hover:bg-[#0F766E] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sedang Mengirim...</span>
                  ) : (
                    <>
                      <span>Kirim Naskah</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
