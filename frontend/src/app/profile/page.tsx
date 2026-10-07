"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

interface ProfileFormData {
  name: string;
  avatar: string;
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
  avatar: "/images/avatar-ahmad.jpg",
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

  // Avatar Management states
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal adalah 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (avatarUrl: string) => {
    setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
    setIsPresetModalOpen(false);
  };

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
        const parsed = JSON.parse(saved);
        setFormData({
          ...DEFAULT_PROFILE,
          ...parsed,
          avatar: parsed.avatar || DEFAULT_PROFILE.avatar,
        });
      } else {
        const userStr = localStorage.getItem("m3s_user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj.name) {
            setFormData((prev) => ({
              ...prev,
              name: userObj.name,
              avatar: userObj.avatar || DEFAULT_PROFILE.avatar,
            }));
          }
        }
      }

      // Fetch latest profile state from Laravel backend
      fetch("http://localhost:8000/api/v1/profile", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.data?.profile) {
            const p = json.data.profile;
            const u = json.data.user;
            const socialMap: Record<string, string> = {
              linkedin: "",
              github: "",
              instagram: "",
              twitter: "",
              website: "",
            };
            if (Array.isArray(p.social_links)) {
              p.social_links.forEach((l: { platform: string; url: string }) => {
                if (l.platform && l.url) socialMap[l.platform] = l.url;
              });
            }
            setFormData((prev) => ({
              ...prev,
              name: u?.name || prev.name,
              avatar: u?.avatar || prev.avatar,
              graduationYear: p.graduation_year || prev.graduationYear,
              graduationClass: p.graduation_class || prev.graduationClass,
              alumniIdentifier: p.alumni_identifier || prev.alumniIdentifier,
              gender: p.gender || prev.gender,
              birthDate: p.birth_date ? p.birth_date.split("T")[0] : prev.birthDate,
              bio: p.bio || prev.bio,
              currentCity: p.current_city || prev.currentCity,
              currentCountry: p.current_country || prev.currentCountry,
              occupation: p.occupation || prev.occupation,
              company: p.company || prev.company,
              visibility: p.visibility || prev.visibility,
              skills: Array.isArray(p.skills) && p.skills.length > 0 ? p.skills.map((s: string | { name: string }) => typeof s === "string" ? s : s.name) : prev.skills,
              socialLinks: {
                ...prev.socialLinks,
                ...socialMap,
              },
            }));
          }
        })
        .catch(() => {
          // Graceful fallback to cached state
        });
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

    // Save to LocalStorage & sync avatar with user session
    try {
      localStorage.setItem("m3s_user_profile", JSON.stringify(formData));
      const userStr = localStorage.getItem("m3s_user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userObj.avatar = formData.avatar;
        userObj.name = formData.name;
        localStorage.setItem("m3s_user", JSON.stringify(userObj));
        window.dispatchEvent(new Event("storage"));
      }
    } catch {
      // LocalStorage error handled
    }

    // Send update to Laravel backend
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      try {
        const res = await fetch("http://localhost:8000/api/v1/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            avatar: formData.avatar,
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

        if (res.ok) {
          const json = await res.json();
          if (json?.data?.user?.avatar) {
            const updatedAvatar = json.data.user.avatar;
            setFormData((prev) => ({ ...prev, avatar: updatedAvatar }));
            const userStr = localStorage.getItem("m3s_user");
            if (userStr) {
              const userObj = JSON.parse(userStr);
              userObj.avatar = updatedAvatar;
              localStorage.setItem("m3s_user", JSON.stringify(userObj));
            }
          }
        }
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

        {/* Profile Identity Card with Avatar Management */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative shrink-0 flex flex-col items-center gap-2.5">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-emerald-100 shadow-sm bg-slate-100 relative">
                <Image
                  src={formData.avatar || "/images/avatar-ahmad.jpg"}
                  alt={formData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white shadow-xs"
                title="Alumni Terverifikasi"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Avatar Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-[11px] font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-2xs transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Ubah Foto</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPresetModalOpen(true)}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-[#475569] hover:text-[#0D9488] bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200"
                title="Pilih Avatar Preset Mayoga"
              >
                Preset
              </button>
            </div>
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
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama lengkap beserta gelar"
                  />
                </div>

                <div>
                  <label htmlFor="alumniIdentifier" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Nomor Anggota Alumni</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Otomatis Sistem (Permanen)
                    </span>
                  </label>
                  <div className="relative">
                    <Input
                      id="alumniIdentifier"
                      type="text"
                      readOnly
                      disabled
                      value={formData.alumniIdentifier || `M3S-${formData.graduationYear || 2020}-0001`}
                      className="bg-slate-50 font-mono text-slate-700 font-semibold cursor-not-allowed border-slate-200"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Nomor anggota diterbitkan otomatis oleh sistem saat mendaftar dan tidak dapat diubah.
                  </p>
                </div>

                <div>
                  <label htmlFor="graduationYear" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Tahun Kelulusan (Angkatan) <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#0D9488] font-semibold lowercase">30+ angkatan</span>
                  </label>
                  <Select
                    value={String(formData.graduationYear)}
                    onValueChange={(val) => setFormData({ ...formData, graduationYear: parseInt(val, 10) })}
                  >
                    <SelectTrigger id="graduationYear" className="w-full">
                      <SelectValue placeholder="Pilih tahun kelulusan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Dekade 2020-an</SelectLabel>
                        {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                          <SelectItem key={yr} value={String(yr)}>
                            Angkatan {yr}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Dekade 2010-an</SelectLabel>
                        {[2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010].map((yr) => (
                          <SelectItem key={yr} value={String(yr)}>
                            Angkatan {yr}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Dekade 2000-an</SelectLabel>
                        {[2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000].map((yr) => (
                          <SelectItem key={yr} value={String(yr)}>
                            Angkatan {yr}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Dekade 1990-an</SelectLabel>
                        {[1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990].map((yr) => (
                          <SelectItem key={yr} value={String(yr)}>
                            Angkatan {yr}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="graduationClass" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Jurusan / Kelas Terakhir
                  </label>
                  <Input
                    id="graduationClass"
                    type="text"
                    placeholder="Contoh: IPA 1, IPA 2, IPS 1, Keagamaan"
                    value={formData.graduationClass}
                    onChange={(e) => setFormData({ ...formData, graduationClass: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Jenis Kelamin
                  </label>
                  <Select
                    value={formData.gender || "male"}
                    onValueChange={(val) => setFormData({ ...formData, gender: val as "male" | "female" })}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Tanggal Lahir
                  </label>
                  <DatePicker
                    value={formData.birthDate}
                    onChange={(val) => setFormData({ ...formData, birthDate: val })}
                    placeholder="Pilih tanggal lahir..."
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
                  <Input
                    id="occupation"
                    type="text"
                    placeholder="Contoh: Senior Backend Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Perusahaan / Instansi / Usaha
                  </label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Contoh: Tech Nusantara"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="currentCity" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Kota Domisili Saat Ini
                  </label>
                  <Input
                    id="currentCity"
                    type="text"
                    placeholder="Contoh: Yogyakarta"
                    value={formData.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="currentCountry" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Negara
                  </label>
                  <Input
                    id="currentCountry"
                    type="text"
                    placeholder="Indonesia"
                    value={formData.currentCountry}
                    onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
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
                  <Input
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
                  />
                </div>

                <div>
                  <label htmlFor="github" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    GitHub URL
                  </label>
                  <Input
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
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Instagram URL
                  </label>
                  <Input
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
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    X / Twitter URL
                  </label>
                  <Input
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
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="website" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Website Personal / Portofolio
                  </label>
                  <Input
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
                <label className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${formData.visibility === "public" ? "border-[#0D9488] bg-emerald-50/40 ring-1 ring-[#0D9488] shadow-2xs" : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}`}>
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={() => setFormData({ ...formData, visibility: "public" })}
                    className="mt-1 h-4 w-4 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F172A]">
                        Publik (Terbuka untuk Semua Pengunjung)
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-[#0D9488]">
                        Direkomendasikan
                      </span>
                    </div>
                    <span className="text-xs text-[#64748B] block leading-relaxed">
                      Profil Anda beserta tautan media sosial dapat dicari dan dilihat oleh seluruh pengunjung direktori M3S Connect.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${formData.visibility === "members" ? "border-[#0D9488] bg-emerald-50/40 ring-1 ring-[#0D9488] shadow-2xs" : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}`}>
                  <input
                    type="radio"
                    name="visibility"
                    value="members"
                    checked={formData.visibility === "members"}
                    onChange={() => setFormData({ ...formData, visibility: "members" })}
                    className="mt-1 h-4 w-4 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F172A]">
                        Hanya Sesama Alumni Terdaftar (Members Only)
                      </span>
                    </div>
                    <span className="text-xs text-[#64748B] block leading-relaxed">
                      Pengunjung umum hanya melihat nama & angkatan. Tautan LinkedIn, GitHub, email, dan website hanya terbuka ketika sesama alumni telah masuk (login).
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${formData.visibility === "private" ? "border-[#0D9488] bg-emerald-50/40 ring-1 ring-[#0D9488] shadow-2xs" : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}`}>
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

        {/* Preset Avatar Modal */}
        {isPresetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white w-full max-w-sm rounded-3xl border border-[#CBD5E1] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A]">Pilih Avatar Preset</h3>
                <button
                  type="button"
                  onClick={() => setIsPresetModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-[#475569] flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-[#64748B]">
                Pilih salah satu foto profil standar alumni MAN 3 Sleman berikut:
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { name: "Ahmad Fauzi", url: "/images/avatar-ahmad.jpg" },
                  { name: "Siti Rahmawati", url: "/images/avatar-siti.jpg" },
                  { name: "Rina Oktaviani", url: "/images/avatar-rina.jpg" },
                  { name: "Kampus Mayoga", url: "/images/hero-man3-sleman.jpg" },
                ].map((item) => (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(item.url)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-[#0D9488] hover:bg-emerald-50/50 flex flex-col items-center gap-2 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-[#0D9488] relative">
                      <Image src={item.url} alt={item.name} fill className="object-cover" />
                    </div>
                    <span className="text-xs font-semibold text-[#0F172A]">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
