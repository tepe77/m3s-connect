"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ALUMNI_ITEMS, AlumniItem } from "@/data/alumniData";

export default function AlumniDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const filteredAlumni = ALUMNI_ITEMS.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesYear =
      selectedYear === "" || item.graduationYear.toString() === selectedYear;

    const matchesCity =
      selectedCity === "" ||
      item.city.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesYear && matchesCity;
  });

  const uniqueYears = Array.from(new Set(ALUMNI_ITEMS.map((a) => a.graduationYear))).sort(
    (a, b) => b - a
  );

  return (
    <div className="py-8 md:py-12 bg-[#F8FAFC]">
      <Container size="wide">
        {/* Header & Title */}
        <div className="space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D9488] text-xs font-semibold border border-emerald-200">
            <span>Direktori Komunitas Resmi</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Direktori Alumni MAN 3 Sleman
          </h1>
          <p className="text-sm md:text-base text-[#64748B] max-w-2xl leading-relaxed">
            Temukan rekan seangkatan, kawan sekelas, atau bangun jejaring profesional lintas generasi dengan data terverifikasi dan tautan komunikasi lengkap.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-5">
            <label htmlFor="search" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Pencarian Alumni
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, profesi, perusahaan, keahlian..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
              />
              <svg className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="lg:col-span-3">
            <label htmlFor="year" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Tahun Angkatan
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white text-[#1E293B]"
            >
              <option value="">Semua Tahun Angkatan</option>
              {uniqueYears.map((yr) => (
                <option key={yr} value={yr.toString()}>
                  Angkatan {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3">
            <label htmlFor="city" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Kota Domisili
            </label>
            <input
              id="city"
              type="text"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              placeholder="Contoh: Yogyakarta, Jakarta..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
            />
          </div>

          <div className="lg:col-span-1">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedYear("");
                setSelectedCity("");
              }}
              className="w-full min-h-[42px] px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
              title="Reset Filter"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Counter Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-[#475569]">
            Menampilkan <span className="text-[#0D9488] font-bold">{filteredAlumni.length}</span> Profil Alumni Terverifikasi
          </p>
          <Link
            href="/alumni/login"
            className="text-xs font-bold text-[#0D9488] hover:underline flex items-center gap-1"
          >
            <span>Masuk ke Portal Alumni</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Alumni List Grid (Complete Cards with Photos & Social Links) */}
        {filteredAlumni.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#CBD5E1] space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-[#64748B]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Alumni tidak ditemukan</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian, tahun kelulusan, atau kota domisili.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => (
              <div
                key={alumni.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5"
              >
                {/* 1. Header Card: Avatar & Badges */}
                <div className="flex items-start gap-4">
                  <Link href={`/alumni/${alumni.id}`} className="relative shrink-0 group">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-xs bg-slate-100 group-hover:ring-2 group-hover:ring-[#0D9488] transition-all">
                      <Image
                        src={alumni.avatar}
                        alt={alumni.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Active Verified Indicator */}
                    <span
                      className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white"
                      title="Alumni Terverifikasi Aktif"
                    >
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-base font-bold text-[#0F172A] leading-snug hover:text-[#0D9488] transition-colors">
                        <Link href={`/alumni/${alumni.id}`}>
                          {alumni.name}
                        </Link>
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-[#0D9488] border border-emerald-200">
                        Alumni {alumni.graduationYear}
                      </span>
                      <span className="text-[11px] text-[#64748B] font-medium">
                        {alumni.graduationClass}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#94A3B8] font-mono">
                      {alumni.alumniIdentifier}
                    </p>
                  </div>
                </div>

                {/* 2. Occupation & City Details */}
                <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-2 text-xs text-[#1E293B] font-semibold">
                    <svg className="w-4 h-4 text-[#0D9488] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{alumni.occupation}</span>
                    <span className="text-[#94A3B8] font-normal">•</span>
                    <span className="text-[#64748B] font-normal truncate">{alumni.company}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <svg className="w-4 h-4 text-[#94A3B8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{alumni.city}, {alumni.country}</span>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 pt-1 italic">
                    &ldquo;{alumni.bio}&rdquo;
                  </p>
                </div>

                {/* 3. Skills Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {alumni.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-[#475569]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* 4. Social Media Links Row (Complete Socials) */}
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Sosmed:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {alumni.socialLinks.map((link) => {
                        let icon = null;
                        if (link.platform === "linkedin") {
                          icon = (
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          );
                        } else if (link.platform === "github") {
                          icon = (
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                          );
                        } else if (link.platform === "instagram") {
                          icon = (
                            <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2" />
                              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                            </svg>
                          );
                        } else if (link.platform === "twitter") {
                          icon = (
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          );
                        } else {
                          icon = (
                            <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                            </svg>
                          );
                        }

                        return (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${alumni.name} ${link.platform}`}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-50 text-[#475569] hover:text-[#0D9488] border border-slate-200 flex items-center justify-center transition-colors"
                          >
                            {icon}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <Link
                    href={`/alumni/${alumni.id}`}
                    className="inline-flex items-center px-4 py-1.5 text-xs font-bold text-[#0D9488] bg-emerald-50 hover:bg-[#0D9488] hover:text-white rounded-full transition-colors border border-emerald-200 shadow-xs"
                  >
                    Lihat Profil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
