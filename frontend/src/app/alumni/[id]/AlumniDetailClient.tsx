"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AlumniItem } from "@/data/alumniData";

interface AlumniDetailClientProps {
  alumni: AlumniItem;
}

export function AlumniDetailClient({ alumni }: AlumniDetailClientProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("m3s_token");
      const user = localStorage.getItem("m3s_user");
      if (token) {
        setIsLoggedIn(true);
        if (user) {
          const parsed = JSON.parse(user);
          setCurrentUserEmail(parsed.email || null);
        }
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="py-8 md:py-12 bg-[#F8FAFC]">
      <Container size="default">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          <Link href="/" className="hover:text-[#0D9488] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/alumni" className="hover:text-[#0D9488] transition-colors">
            Direktori Alumni
          </Link>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold">{alumni.name}</span>
        </nav>

        {/* 2. Profile Card Banner */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden mb-8">
          {/* Top Banner Cover */}
          <div className="relative h-44 sm:h-56 w-full bg-gradient-to-r from-[#062A24] via-[#094036] to-[#0D9488]">
            <Image
              src="/images/hero-building.jpg"
              alt="MAN 3 Sleman"
              fill
              className="object-cover opacity-25 mix-blend-overlay"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5 border border-white/20"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>{copiedLink ? "Link Tersalin!" : "Bagikan"}</span>
              </button>
            </div>
          </div>

          {/* Profile Identity Details */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
                  <Image
                    src={alumni.avatar}
                    alt={alumni.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Active Verified Badge */}
                <span
                  className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white shadow-xs"
                  title="Alumni Terverifikasi"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>

              {/* Action Buttons on right */}
              <div className="flex flex-wrap items-center gap-3">
                {isLoggedIn ? (
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 text-xs font-bold text-[#0D9488] bg-emerald-50 hover:bg-[#0D9488] hover:text-white rounded-full border border-emerald-200 transition-colors"
                  >
                    Edit Profil Saya
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors"
                  >
                    Masuk untuk Terhubung &rarr;
                  </Link>
                )}
              </div>
            </div>

            {/* Name, Status & Metadata */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {alumni.name}
                </h1>
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
                  Alumni {alumni.graduationYear} ({alumni.graduationClass})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-[#475569]">
                <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                  <svg className="w-4 h-4 text-[#0D9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{alumni.occupation}</span>
                  <span className="text-[#94A3B8] font-normal">at</span>
                  <span>{alumni.company}</span>
                </div>

                <span className="text-[#CBD5E1] hidden sm:inline">•</span>

                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{alumni.city}, {alumni.country}</span>
                </div>

                <span className="text-[#CBD5E1] hidden sm:inline">•</span>

                <div className="text-xs text-[#94A3B8] font-mono">
                  ID: {alumni.alumniIdentifier}
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-sm text-[#334155] leading-relaxed max-w-3xl pt-2">
                {alumni.bio}
              </p>

              {/* Social Media Links Bar */}
              <div className="pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Tautan Media Sosial:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {alumni.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-[#334155] hover:text-[#0D9488] border border-slate-200 text-xs font-semibold transition-colors"
                    >
                      <span className="capitalize">{link.platform}</span>
                      <svg className="w-3 h-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Non-Logged-In Visitor Notice */}
        {!isLoggedIn && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-[#064E3B]">
                Ingin Berjejaring atau Mengirim Pesan ke {alumni.name}?
              </h3>
              <p className="text-xs text-[#065F46] leading-relaxed">
                Halaman ini menampilkan profil publik alumni. Masuk ke akun alumni Anda untuk membuka direktori kontak penuh, forum diskusi angkatan, dan peluang karir.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shrink-0 shadow-xs transition-colors"
            >
              Masuk Sekarang &rarr;
            </Link>
          </div>
        )}

        {/* 4. Two Columns Grid for Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Education & Experience (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Experience History */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D9488] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[#0F172A]">Riwayat Karir & Pengalaman</h2>
              </div>

              {alumni.experiences && alumni.experiences.length > 0 ? (
                <div className="space-y-6">
                  {alumni.experiences.map((exp, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-emerald-200 space-y-1.5">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#0D9488] border-2 border-white" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-[#0F172A]">{exp.position}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#64748B]">
                          {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : "- Sekarang"}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#0D9488]">
                        {exp.company} • <span className="font-normal text-[#64748B]">{exp.location}</span>
                      </p>
                      {exp.description && (
                        <p className="text-xs text-[#475569] leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#64748B] italic">
                  Belum ada riwayat pengalaman karir yang dipublikasikan.
                </div>
              )}
            </section>

            {/* Education History */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[#0F172A]">Riwayat Pendidikan</h2>
              </div>

              {alumni.educations && alumni.educations.length > 0 ? (
                <div className="space-y-6">
                  {alumni.educations.map((edu, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-sky-200 space-y-1.5">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-white" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-[#0F172A]">{edu.institution}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#64748B]">
                          {edu.startYear} - {edu.endYear}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-sky-700">
                        {edu.degree} • <span className="font-normal text-[#64748B]">{edu.fieldOfStudy}</span>
                      </p>
                      {edu.description && (
                        <p className="text-xs text-[#475569] leading-relaxed pt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#64748B] italic">
                  Belum ada riwayat pendidikan lanjutan yang dipublikasikan.
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Skills & Community Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Skills & Expertise */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Keahlian & Spesialisasi
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {alumni.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Community Stats Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Status Keanggotaan
              </h3>
              <ul className="space-y-3 text-xs text-[#475569]">
                <li className="flex items-center justify-between">
                  <span>Angkatan Kelulusan</span>
                  <span className="font-bold text-[#0F172A]">{alumni.graduationYear}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Kelas / Jurusan</span>
                  <span className="font-bold text-[#0F172A]">{alumni.graduationClass}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Status Verifikasi</span>
                  <span className="text-[#10B981] font-bold">Terverifikasi Sah</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Almamater</span>
                  <span className="font-medium text-[#0F172A]">MAN 3 Sleman</span>
                </li>
              </ul>
            </div>

            {/* Back Button */}
            <div className="pt-2">
              <Link
                href="/alumni"
                className="block w-full py-2.5 text-center text-xs font-bold text-[#475569] hover:text-[#0F172A] bg-white border border-[#CBD5E1] rounded-full transition-colors"
              >
                &larr; Kembali ke Direktori Alumni
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
