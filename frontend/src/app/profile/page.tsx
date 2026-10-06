"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface ProfileFormData {
  name: string;
  graduationYear: number;
  graduationClass: string;
  alumniIdentifier: string;
  gender: "male" | "female";
  birthDate: string;
  bio: string;
  currentCity: string;
  currentCountry: string;
  occupation: string;
  company: string;
  visibility: "public" | "members" | "private";
  skills: string[];
  socialLinks: {
    linkedin: string;
    github: string;
    instagram: string;
    twitter: string;
    website: string;
  };
}

const DEFAULT_PROFILE: ProfileFormData = {
  name: "Budi Santoso, S.Kom.",
  graduationYear: 2018,
  graduationClass: "IPA 2",
  alumniIdentifier: "M3S-2018-0042",
  gender: "male",
  birthDate: "2000-05-14",
  bio: "Senior Backend Engineer yang antusias dalam riset arsitektur cloud terdistribusi, open-source, dan mentoring teknologi.",
  currentCity: "Yogyakarta",
  currentCountry: "Indonesia",
  occupation: "Senior Backend Engineer",
  company: "Tech Nusantara",
  visibility: "public",
  skills: ["Laravel", "PostgreSQL", "Redis", "Next.js", "Docker", "TypeScript"],
  socialLinks: {
    linkedin: "https://linkedin.com/in/budisantoso",
    github: "https://github.com/budisantoso",
    instagram: "https://instagram.com/budisantoso",
    twitter: "https://x.com/budisantoso",
    website: "https://budisantoso.dev",
  },
};

export default function ProfileUpdatePage() {
  const [formData, setFormData] = useState<ProfileFormData>(DEFAULT_PROFILE);
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"akademik" | "karir" | "sosial" | "privasi">("akademik");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check auth and load profile from localStorage/backend on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("m3s_token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      const saved = localStorage.getItem("m3s_user_profile");
      if (saved) {
        setFormData(JSON.parse(saved));
      } else {
        const userStr = localStorage.getItem("m3s_user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj.name) {
            setFormData((prev) => ({ ...prev, name: userObj.name }));
          }
        }
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Save to LocalStorage
    try {
      localStorage.setItem("m3s_user_profile", JSON.stringify(formData));
    } catch {
      // LocalStorage error handled
    }

    // Try sending to Laravel backend if token exists
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      try {
        await fetch("http://localhost:8000/api/v1/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            graduation_year: formData.graduationYear,
            graduation_class: formData.graduationClass,
            alumni_identifier: formData.alumniIdentifier,
            gender: formData.gender,
            birth_date: formData.birthDate,
            bio: formData.bio,
            current_city: formData.currentCity,
            current_country: formData.currentCountry,
            occupation: formData.occupation,
            company: formData.company,
            visibility: formData.visibility,
            skills: formData.skills,
            social_links: [
              { platform: "linkedin", url: formData.socialLinks.linkedin },
              { platform: "github", url: formData.socialLinks.github },
              { platform: "instagram", url: formData.socialLinks.instagram },
              { platform: "twitter", url: formData.socialLinks.twitter },
              { platform: "website", url: formData.socialLinks.website },
            ].filter((l) => Boolean(l.url)),
          }),
        });
      } catch {
        // Backend request handled gracefully
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    }, 600);
  };

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="py-24 bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-xs text-[#64748B]">Memverifikasi sesi akun alumni...</p>
      </div>
    );
  }

  // If user is not logged in, show access guard
  if (isAuthenticated === false) {
    return (
      <div className="py-12 md:py-20 bg-[#F8FAFC]">
        <Container size="narrow">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E7EB] shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0D9488] flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
                Akses Terbatas Alumni
              </span>
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Masuk untuk Mengelola Profil Anda
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Halaman pembaruan profil khusus untuk alumni yang telah masuk dengan akun terdaftar. Untuk melihat informasi profil rekan alumni lainnya, Anda dapat menjelajahi Direktori Alumni publik.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Masuk ke Akun</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/alumni"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A] bg-white border border-[#CBD5E1] rounded-full transition-colors flex items-center justify-center"
              >
                Lihat Direktori Alumni
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-[#F8FAFC]">
      <Container size="default">
        {/* Header Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D9488] text-xs font-semibold border border-emerald-200">
              <span>Pengaturan Profil Alumni</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Perbarui Profil Alumni
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Lengkapi informasi pendidikan, karir, dan tautan sosial media Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/alumni"
              className="px-4 py-2 text-xs font-semibold text-[#0F172A] hover:text-[#0D9488] bg-white border border-[#CBD5E1] rounded-full transition-colors"
            >
              Lihat di Direktori &rarr;
            </Link>
          </div>
        </div>

        {/* Profile Identity Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-50 shadow-sm bg-slate-100">
              <Image
                src="/images/avatar-ahmad.jpg"
                alt={formData.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <span
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white"
              title="Alumni Terverifikasi"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A]">{formData.name}</h2>
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
                Alumni {formData.graduationYear} ({formData.graduationClass})
              </span>
            </div>

            <p className="text-xs text-[#64748B]">
              Nomor Anggota: <span className="font-mono text-[#0F172A] font-semibold">{formData.alumniIdentifier}</span> • Domisili: {formData.currentCity}, {formData.currentCountry}
            </p>

            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
                <span>Kelengkapan Profil</span>
                <span className="font-bold text-[#0D9488]">90% Lengkap</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#0D9488] rounded-full w-[90%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Profil alumni berhasil disimpan dan diperbarui di seluruh platform!</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setActiveTab("akademik")}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-colors shrink-0 ${
              activeTab === "akademik"
                ? "bg-[#0D9488] text-white"
                : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1]"
            }`}
          >
            1. Data Akademik & Pribadi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("karir")}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-colors shrink-0 ${
              activeTab === "karir"
                ? "bg-[#0D9488] text-white"
                : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1]"
            }`}
          >
            2. Karir, Bio & Keahlian
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sosial")}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-colors shrink-0 ${
              activeTab === "sosial"
                ? "bg-[#0D9488] text-white"
                : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1]"
            }`}
          >
            3. Tautan Media Sosial
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("privasi")}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-colors shrink-0 ${
              activeTab === "privasi"
                ? "bg-[#0D9488] text-white"
                : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1]"
            }`}
          >
            4. Pengaturan Privasi
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-8">
          {/* TAB 1: Data Akademik & Pribadi */}
          {activeTab === "akademik" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-[#0F172A] pb-2 border-b border-[#F1F5F9]">
                Informasi Akademik Madrasah & Identitas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="alumniIdentifier" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Nomor Anggota Alumni / NISN
                  </label>
                  <input
                    id="alumniIdentifier"
                    type="text"
                    value={formData.alumniIdentifier}
                    onChange={(e) => setFormData({ ...formData, alumniIdentifier: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="graduationYear" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Tahun Kelulusan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="graduationYear"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  >
                    {Array.from({ length: 30 }, (_, i) => 2026 - i).map((yr) => (
                      <option key={yr} value={yr}>
                        Angkatan {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="graduationClass" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Jurusan / Kelas Terakhir
                  </label>
                  <input
                    id="graduationClass"
                    type="text"
                    placeholder="Contoh: IPA 1, IPA 2, IPS 1, Keagamaan"
                    value={formData.graduationClass}
                    onChange={(e) => setFormData({ ...formData, graduationClass: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Jenis Kelamin
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Tanggal Lahir
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Karir, Bio & Keahlian */}
          {activeTab === "karir" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-[#0F172A] pb-2 border-b border-[#F1F5F9]">
                Pekerjaan, Domisili & Profil Profesional
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="occupation" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Pekerjaan / Jabatan Saat Ini
                  </label>
                  <input
                    id="occupation"
                    type="text"
                    placeholder="Contoh: Senior Backend Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Perusahaan / Instansi / Usaha
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Contoh: Tech Nusantara"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="currentCity" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Kota Domisili Saat Ini
                  </label>
                  <input
                    id="currentCity"
                    type="text"
                    placeholder="Contoh: Yogyakarta"
                    value={formData.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="currentCountry" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Negara
                  </label>
                  <input
                    id="currentCountry"
                    type="text"
                    placeholder="Indonesia"
                    value={formData.currentCountry}
                    onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Ringkasan Diri (Bio Alumni)
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tuliskan latar belakang karir atau minat kolaborasi Anda..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                />
              </div>

              {/* Skills Tags Manager */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Keahlian & Bidang Spesialisasi (Skills)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0D9488] border border-emerald-200"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-600 font-bold"
                        title="Hapus keahlian"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-sm pt-1">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Tambah keahlian baru..."
                    className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-xl transition-colors"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Tautan Media Sosial */}
          {activeTab === "sosial" && (
            <div className="space-y-6">
              <div className="space-y-1 pb-2 border-b border-[#F1F5F9]">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Tautan Profil Media Sosial & Portofolio
                </h3>
                <p className="text-xs text-[#64748B]">
                  Tautan ini akan ditampilkan di kartu direktori alumni untuk mempermudah rekan alumni menghubungi Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="linkedin" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    id="linkedin"
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="github" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    id="github"
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    id="instagram"
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/username"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    X / Twitter URL
                  </label>
                  <input
                    id="twitter"
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                      })
                    }
                    placeholder="https://x.com/username"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="website" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Website Personal / Portofolio
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={formData.socialLinks.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, website: e.target.value },
                      })
                    }
                    placeholder="https://portofolio-anda.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Pengaturan Privasi */}
          {activeTab === "privasi" && (
            <div className="space-y-6">
              <div className="space-y-1 pb-2 border-b border-[#F1F5F9]">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Kendali Privasi Data Profil
                </h3>
                <p className="text-xs text-[#64748B]">
                  Pilih siapa saja yang berhak melihat profil lengkap dan kontak sosial media Anda di platform ini.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 cursor-pointer transition-colors bg-slate-50/50">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={() => setFormData({ ...formData, visibility: "public" })}
                    className="mt-1 h-4 w-4 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-[#0F172A] block">
                      Publik (Direkomendasikan)
                    </span>
                    <span className="text-xs text-[#64748B] block leading-relaxed">
                      Profil Anda dapat dicari dan dilihat oleh seluruh pengunjung dan alumni MAN 3 Sleman di direktori komunitas.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 cursor-pointer transition-colors bg-slate-50/50">
                  <input
                    type="radio"
                    name="visibility"
                    value="members"
                    checked={formData.visibility === "members"}
                    onChange={() => setFormData({ ...formData, visibility: "members" })}
                    className="mt-1 h-4 w-4 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-[#0F172A] block">
                      Hanya Sesama Alumni Terdaftar
                    </span>
                    <span className="text-xs text-[#64748B] block leading-relaxed">
                      Profil hanya dapat dilihat oleh alumni yang telah masuk dengan akun sah yang terverifikasi.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 cursor-pointer transition-colors bg-slate-50/50">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={() => setFormData({ ...formData, visibility: "private" })}
                    className="mt-1 h-4 w-4 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-[#0F172A] block">
                      Privat (Hanya Saya & Pengurus)
                    </span>
                    <span className="text-xs text-[#64748B] block leading-relaxed">
                      Sembunyikan profil Anda dari hasil pencarian direktori publik.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Form Actions (Submit Buttons) */}
          <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#64748B]">
              Perubahan akan langsung aktif di direktori komunitas.
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/alumni"
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] text-center border border-[#CBD5E1] rounded-full transition-colors"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] disabled:bg-[#94A3B8] rounded-full shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                {isSaving ? "Menyimpan Data..." : "Simpan Perubahan Profil"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
