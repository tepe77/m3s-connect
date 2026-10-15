"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EventModel,
  EventCategory,
  formatEventDate,
  formatEventTimeRange,
  isOnlineEvent,
  fetchEvents,
} from "@/data/eventData";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  Video,
  Building2,
  ArrowRight,
  Filter,
  CalendarCheck,
  X,
  RotateCcw,
  Layers,
} from "lucide-react";

interface EventListClientProps {
  initialEvents: EventModel[];
  categories: EventCategory[];
}

function parseDateCallout(dateString: string) {
  try {
    const d = new Date(dateString);
    const month = d.toLocaleDateString("id-ID", { month: "short" }).toUpperCase();
    const day = d.toLocaleDateString("id-ID", { day: "numeric" });
    const year = d.getFullYear();
    return { month, day, year };
  } catch {
    return { month: "AGD", day: "•", year: "" };
  }
}

export function EventListClient({ initialEvents, categories }: EventListClientProps) {
  const [events, setEvents] = useState<EventModel[]>(initialEvents);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (
    tab: "upcoming" | "past" | "all",
    category: string,
    search: string
  ) => {
    setActiveTab(tab);
    setSelectedCategory(category);
    setSearchQuery(search);

    startTransition(async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
      const filtered = await fetchEvents(
        {
          tab,
          category: category !== "all" ? category : undefined,
          search: search.trim() ? search.trim() : undefined,
        },
        token
      );
      setEvents(filtered);
    });
  };

  // Featured event is the nearest upcoming event (first in list when tab is upcoming or all)
  const featuredEvent = activeTab !== "past" && events.length > 0 && !searchQuery.trim() && selectedCategory === "all"
    ? events[0]
    : null;

  const standardEvents = featuredEvent ? events.slice(1) : events;

  const upcomingCount = initialEvents.filter((e) => !e.is_past).length;
  const pastCount = initialEvents.filter((e) => e.is_past).length;
  const allCount = initialEvents.length;

  return (
    <div className="space-y-8">
      {/* 1. Primary Editorial Horizon Tab Navigation */}
      <div className="border-b border-slate-200/90">
        <nav
          className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar"
          aria-label="Filter status agenda"
        >
          <button
            type="button"
            onClick={() => handleFilterChange("upcoming", selectedCategory, searchQuery)}
            className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "upcoming"
                ? "text-emerald-950 border-b-2 border-emerald-700"
                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
            }`}
          >
            <Calendar className={`size-4 ${activeTab === "upcoming" ? "text-emerald-700" : "text-slate-400"}`} />
            <span>Agenda Mendatang</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                activeTab === "upcoming"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {upcomingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange("past", selectedCategory, searchQuery)}
            className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "past"
                ? "text-emerald-950 border-b-2 border-emerald-700"
                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
            }`}
          >
            <CalendarCheck className={`size-4 ${activeTab === "past" ? "text-emerald-700" : "text-slate-400"}`} />
            <span>Riwayat Selesai</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                activeTab === "past"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {pastCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange("all", selectedCategory, searchQuery)}
            className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "all"
                ? "text-emerald-950 border-b-2 border-emerald-700"
                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
            }`}
          >
            <Layers className={`size-4 ${activeTab === "all" ? "text-emerald-700" : "text-slate-400"}`} />
            <span>Semua Agenda</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                activeTab === "all"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {allCount}
            </span>
          </button>
        </nav>
      </div>

      {/* 2. Unified Discovery Toolbar: Category Chips (Left) & Refined Search (Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => handleFilterChange(activeTab, "all", searchQuery)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Semua Topik
          </button>

          {categories
            .filter((c) => c.slug !== "all")
            .map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleFilterChange(activeTab, cat.slug, searchQuery)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
        </div>

        {/* Refined Search Box */}
        <div className="relative w-full sm:w-64 md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleFilterChange(activeTab, selectedCategory, e.target.value)}
            placeholder="Cari topik atau lokasi..."
            className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleFilterChange(activeTab, selectedCategory, "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
              title="Hapus kata kunci"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Micro-Feedback for Active Filter / Search */}
      {(selectedCategory !== "all" || searchQuery.trim()) && (
        <div className="flex items-center justify-between gap-3 text-xs text-slate-600 bg-emerald-50/70 border border-emerald-200/60 px-4 py-2.5 rounded-xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>Filter aktif:</span>
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-semibold text-emerald-900">
                Topik: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              </span>
            )}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-semibold text-emerald-900">
                Kata kunci: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleFilterChange(activeTab, "all", "")}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer"
          >
            <RotateCcw className="size-3" />
            Reset Filter
          </button>
        </div>
      )}

      {/* Featured Flagship Event Spotlight */}
      {featuredEvent && (
        <section aria-labelledby="featured-event-heading" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-600" />
            <h2 id="featured-event-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Agenda Sorotan Terdekat
            </h2>
          </div>

          <div className="group bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Banner Cover */}
            <div className="relative lg:col-span-5 h-64 lg:h-auto min-h-[260px] bg-slate-900 overflow-hidden">
              <Image
                src={featuredEvent.cover_image_url || "/images/news-internasional.jpg"}
                alt={featuredEvent.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/30" />

              {/* Format Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl shadow-md text-white ${
                    isOnlineEvent(featuredEvent.location)
                      ? "bg-blue-600/90 backdrop-blur-md"
                      : "bg-emerald-700/90 backdrop-blur-md"
                  }`}
                >
                  {isOnlineEvent(featuredEvent.location) ? (
                    <>
                      <Video className="size-3.5" /> Daring • Zoom
                    </>
                  ) : (
                    <>
                      <Building2 className="size-3.5" /> Luring • Tatap Muka
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Content & Details */}
            <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {featuredEvent.category?.name && (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {featuredEvent.category.name}
                    </span>
                  )}
                  {featuredEvent.is_registered && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-900">
                      <CheckCircle2 className="size-3.5 text-emerald-700" /> Anda Terdaftar Hadir
                    </span>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  <Link href={`/events/${featuredEvent.slug}`}>{featuredEvent.title}</Link>
                </h3>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {featuredEvent.description}
                </p>

                {/* Event Key Facts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="flex items-start gap-2.5 text-slate-700">
                    <Calendar className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{formatEventDate(featuredEvent.start_at)}</p>
                      <p className="text-slate-500">{formatEventTimeRange(featuredEvent.start_at, featuredEvent.end_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-slate-700">
                    <MapPin className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 leading-snug">{featuredEvent.location}</p>
                      <p className="text-slate-500">
                        {isOnlineEvent(featuredEvent.location) ? "Akses link dibagikan di profil" : "Kampus MAN 3 Sleman"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Users className="size-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">{featuredEvent.rsvps_count} Alumni</span>
                  <span>telah konfirmasi kehadiran</span>
                  {featuredEvent.max_participants && (
                    <span className="text-slate-400">• Kuota {featuredEvent.max_participants}</span>
                  )}
                </div>

                <Link
                  href={`/events/${featuredEvent.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm text-white bg-emerald-700 hover:bg-emerald-800 transition-all shadow-xs shrink-0"
                >
                  <span>{featuredEvent.is_registered ? "Status Kehadiran" : "Detail & Konfirmasi RSVP"}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Events Grid */}
      <section aria-labelledby="all-events-heading" className="space-y-4">
        {featuredEvent && (
          <h2 id="all-events-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Daftar Agenda Lainnya
          </h2>
        )}

        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 animate-pulse">
                <div className="h-44 bg-slate-200 rounded-xl w-full" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-16 bg-slate-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : standardEvents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
              <CalendarCheck className="size-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tidak Ada Agenda Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tidak ada agenda kegiatan pada kategori atau filter ini. Silakan pilih tab lain atau atur ulang pencarian Anda.
            </p>
            <button
              onClick={() => handleFilterChange("all", "all", "")}
              className="inline-block text-xs font-semibold text-emerald-700 hover:underline pt-1"
            >
              Tampilkan Semua Agenda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardEvents.map((event) => {
              const isOnline = isOnlineEvent(event.location);
              const timeRange = formatEventTimeRange(event.start_at, event.end_at);
              const dateCallout = parseDateCallout(event.start_at);

              return (
                <article
                  key={event.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Event Cover with Callout Badge */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={event.cover_image_url || "/images/doc-baksos.jpg"}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      {/* Date Stamp Callout (Authentic Event Design Pattern) */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/60 overflow-hidden text-center min-w-[50px]">
                        <div className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 tracking-wider">
                          {dateCallout.month}
                        </div>
                        <div className="text-slate-900 font-extrabold text-lg px-2 py-0.5 leading-none">
                          {dateCallout.day}
                        </div>
                      </div>

                      {/* Format Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg shadow-sm text-white backdrop-blur-md ${
                            isOnline
                              ? "bg-blue-600/90"
                              : "bg-emerald-700/90"
                          }`}
                        >
                          {isOnline ? (
                            <>
                              <Video className="size-3" /> Zoom
                            </>
                          ) : (
                            <>
                              <Building2 className="size-3" /> Mayoga
                            </>
                          )}
                        </span>
                      </div>

                      {/* Status Overlay */}
                      {event.is_past ? (
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800/80 text-slate-200">
                            Selesai
                          </span>
                        </div>
                      ) : event.is_registered ? (
                        <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-600 text-white shadow-xs">
                            <CheckCircle2 className="size-3" /> Terdaftar
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3.5">
                      {event.category?.name && (
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                          {event.category.name}
                        </span>
                      )}

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                        <Link href={`/events/${event.slug}`}>{event.title}</Link>
                      </h3>

                      {/* Event Details List */}
                      <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-2">
                          <Clock className="size-3.5 text-slate-400 shrink-0" />
                          <span>{timeRange || formatEventDate(event.start_at)}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="size-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">
                            {event.rsvps_count} Peserta RSVP
                          </span>
                          {event.max_participants && (
                            <span className="text-slate-400">• Kuota {event.max_participants}</span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Link */}
                  <div className="p-5 pt-0">
                    <Link
                      href={`/events/${event.slug}`}
                      className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold rounded-xl transition-all shadow-xs ${
                        event.is_registered
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white"
                      }`}
                    >
                      <span>{event.is_registered ? "Status Kehadiran Saya" : "Lihat Rincian & RSVP"}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
