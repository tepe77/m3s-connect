"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const FORUM_INTERESTS = [
  { id: "karir", label: "Karir & Profesi", icon: "💼" },
  { id: "beasiswa", label: "Beasiswa & Pendidikan", icon: "🎓" },
  { id: "kegiatan", label: "Kegiatan & Reuni", icon: "🤝" },
  { id: "teknologi", label: "Teknologi & Inovasi", icon: "💻" },
  { id: "bisnis", label: "Bisnis & Kewirausahaan", icon: "📈" },
  { id: "umum", label: "Diskusi Santai & Opini", icon: "☕" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Step 1: Quick identity confirmation
  const [graduationYear, setGraduationYear] = useState<string>("2018");
  const [graduationClass, setGraduationClass] = useState<string>("IPA 2");

  // Step 3: Quick Preferences
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "karir",
    "kegiatan",
    "beasiswa",
  ]);
  const [occupation, setOccupation] = useState<string>("");
  const [currentCity, setCurrentCity] = useState<string>("Yogyakarta");
  const [privacyVisibility, setPrivacyVisibility] = useState<string>("members");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("m3s_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } else {
        // Fallback for guests testing onboarding
        setUser({
          id: "guest-alumni",
          name: "Alumnus MAN 3 Sleman",
          email: "alumni@m3s-connect.id",
          role: "alumni",
          status: "active",
        });
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const markOnboardingComplete = (destination: string = "/dashboard") => {
    if (user?.id) {
      localStorage.setItem(`m3s_onboarded_${user.id}`, "true");
    }
    // Also save quick preferences
    const preferences = {
      graduationYear,
      graduationClass,
      selectedInterests,
      occupation,
      currentCity,
      privacyVisibility,
    };
    localStorage.setItem("m3s_user_preferences", JSON.stringify(preferences));
    router.push(destination);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-[#64748B]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D9488] border-t-transparent animate-spin mx-auto mb-3" />
        <p>Memuat pengalaman orientasi M3S Connect...</p>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-14 bg-[#F8FAFC] min-h-[85vh]">
      <Container size="narrow">
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Top Header & Stepper */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#072B24] to-[#0A3D33] text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[#2DD4BF] text-xs font-semibold border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                <span>Orientasi Anggota Baru</span>
              </div>

              <button
                type="button"
                onClick={() => markOnboardingComplete("/dashboard")}
                className="text-xs font-medium text-slate-300 hover:text-white underline transition-colors"
              >
                Lewati Panduan (Skip) &rarr;
              </button>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Selamat Datang di M3S Connect, {user?.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Langkah {currentStep} dari 4: {
                  currentStep === 1
                    ? "Sambutan & Konfirmasi Identitas"
                    : currentStep === 2
                    ? "Tur Fitur Unggulan Platform"
                    : currentStep === 3
                    ? "Personalisasi & Minat Diskusi"
                    : "Siap Berjejaring & Menjelajah"
                }
              </p>
            </div>

            {/* Stepper Dots & Line */}
            <div className="mt-6 flex items-center justify-between gap-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex-1 flex flex-col gap-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      stepNum <= currentStep ? "bg-[#2DD4BF]" : "bg-white/20"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold hidden sm:inline ${
                      stepNum === currentStep
                        ? "text-[#2DD4BF]"
                        : stepNum < currentStep
                        ? "text-slate-300"
                        : "text-white/40"
                    }`}
                  >
                    {stepNum === 1
                      ? "1. Identitas"
                      : stepNum === 2
                      ? "2. Tur Fitur"
                      : stepNum === 3
                      ? "3. Minat"
                      : "4. Selesai"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Content */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* STEP 1: Sambutan & Identitas */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shrink-0 font-bold">
                    M3S
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      Rumah Digital Keluarga Besar Alumni MAN 3 Sleman
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Platform ini dibangun untuk merawat ukhuwah, membuka jejaring karir dan bisnis,
                      serta menjadi jembatan kontribusi alumni untuk kemajuan siswa dan almamater Mayoga.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Konfirmasi Data Akademik Anda
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="graduationYear"
                        className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                      >
                        Tahun Kelulusan (Angkatan)
                      </label>
                      <select
                        id="graduationYear"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                      >
                        {Array.from({ length: 36 }, (_, i) => 2025 - i).map((year) => (
                          <option key={year} value={year.toString()}>
                            Lulus Tahun {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="graduationClass"
                        className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                      >
                        Jurusan / Kelas Saat di Mayoga
                      </label>
                      <input
                        id="graduationClass"
                        type="text"
                        value={graduationClass}
                        onChange={(e) => setGraduationClass(e.target.value)}
                        placeholder="Contoh: IPA 2, IPS 1, Agama"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#64748B] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0D9488] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Data lengkap seperti riwayat pekerjaan, media sosial, dan portofolio dapat Anda lengkapi kapan saja di halaman profil.
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors gap-2"
                  >
                    <span>Lanjut: Pelajari Fitur Platform</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Tur Fitur Unggulan (Walkthrough) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F172A]">
                    4 Pilar Utama di Ekosistem M3S Connect
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Kenali fitur-fitur yang dirancang untuk mendukung interaksi alumni dan almamater.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fitur 1 */}
                  <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0D9488]/50 hover:shadow-xs transition-all space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold text-base">
                      👥
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Direktori Alumni Terverifikasi</h4>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Cari dan terhubung dengan kawan seangkatan, senior, maupun junior. Filter berdasarkan tahun kelulusan, kota domisili, atau bidang industri.
                    </p>
                  </div>

                  {/* Fitur 2 */}
                  <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0D9488]/50 hover:shadow-xs transition-all space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
                      💬
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Forum Komunitas Terbuka</h4>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Ruang berdiskusi, berbagi lowongan kerja, konsultasi beasiswa LPDP, ide wirausaha, hingga pembentukan panitia reuni akbar.
                    </p>
                  </div>

                  {/* Fitur 3 */}
                  <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0D9488]/50 hover:shadow-xs transition-all space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base">
                      📅
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Agenda Kegiatan & Reuni</h4>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Dapatkan jadwal reuni lintas angkatan, webinar karir, buka puasa bersama, serta agenda bakti sosial almamater.
                    </p>
                  </div>

                  {/* Fitur 4 */}
                  <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0D9488]/50 hover:shadow-xs transition-all space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base">
                      📸
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Dokumentasi & Kabar Madrasah</h4>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Nostalgia foto-foto masa sekolah, arsip kegiatan madrasah, dan kabar perkembangan prestasi siswa MAN 3 Sleman terkini.
                    </p>
                  </div>
                </div>

                {user?.role === "moderator" && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    <span className="font-bold">Peran Moderator:</span> Anda memiliki wewenang untuk menyematkan topik penting, menutup diskusi yang telah tuntas, serta memoderasi komentar forum.
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    &larr; Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors gap-2"
                  >
                    <span>Lanjut: Atur Minat Diskusi</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Personalisasi & Minat */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Pilih Topik Diskusi yang Anda Minati
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Topik yang Anda pilih akan diprioritaskan pada rekomendasi forum dan beranda Anda.
                  </p>
                </div>

                {/* Interest Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {FORUM_INTERESTS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-emerald-50 border-[#0D9488] text-[#0D9488] font-bold shadow-2xs"
                            : "bg-white border-[#E2E8F0] text-[#475569] hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Info & Privacy */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="occupation"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Profesi / Aktivitas Saat Ini
                    </label>
                    <input
                      id="occupation"
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="Contoh: Software Engineer / Mahasiswa"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="currentCity"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Kota Domisili
                    </label>
                    <input
                      id="currentCity"
                      type="text"
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                      placeholder="Contoh: Sleman / Yogyakarta / Jakarta"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-[#0F172A]">
                    Visibilitas Profil Anda
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 text-xs ${privacyVisibility === "members" ? "bg-emerald-50 border-[#0D9488] font-semibold text-[#0D9488]" : "bg-white border-[#CBD5E1] text-[#475569]"}`}>
                      <input
                        type="radio"
                        name="privacy"
                        value="members"
                        checked={privacyVisibility === "members"}
                        onChange={() => setPrivacyVisibility("members")}
                        className="text-[#0D9488]"
                      />
                      <span>Tampak untuk Sesama Alumni Terverifikasi</span>
                    </label>
                    <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 text-xs ${privacyVisibility === "private" ? "bg-emerald-50 border-[#0D9488] font-semibold text-[#0D9488]" : "bg-white border-[#CBD5E1] text-[#475569]"}`}>
                      <input
                        type="radio"
                        name="privacy"
                        value="private"
                        checked={privacyVisibility === "private"}
                        onChange={() => setPrivacyVisibility("private")}
                        className="text-[#0D9488]"
                      />
                      <span>Hanya Tampilkan Nama dan Angkatan</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    &larr; Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors gap-2"
                  >
                    <span>Lanjut: Selesaikan Orientasi</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Selesai & Pilihan Aksi Pertama */}
            {currentStep === 4 && (
              <div className="text-center space-y-6 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0D9488] flex items-center justify-center mx-auto text-2xl shadow-inner">
                  🎉
                </div>

                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    Alhamdulillah, Akun Anda Siap Digunakan!
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Terima kasih telah bergabung di M3S Connect. Silakan pilih ruang yang ingin Anda kunjungi pertama kali:
                  </p>
                </div>

                {/* 4 Destination Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                  <button
                    type="button"
                    onClick={() => markOnboardingComplete("/dashboard")}
                    className="p-4 rounded-2xl border border-[#CBD5E1] hover:border-[#0D9488] bg-white hover:bg-emerald-50/50 transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#0D9488]">
                        Ruang Anggota (Dashboard)
                      </span>
                      <span className="text-[#0D9488] text-xs font-bold">&rarr;</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      Pantau kelengkapan profil, rekomendasi teman seangkatan, dan acara terdekat.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => markOnboardingComplete("/forum")}
                    className="p-4 rounded-2xl border border-[#CBD5E1] hover:border-[#0D9488] bg-white hover:bg-emerald-50/50 transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#0D9488]">
                        Forum Diskusi Komunitas
                      </span>
                      <span className="text-[#0D9488] text-xs font-bold">&rarr;</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      Sapa rekan alumni, tanyakan info lowongan karir, atau usulkan topik baru.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => markOnboardingComplete("/alumni")}
                    className="p-4 rounded-2xl border border-[#CBD5E1] hover:border-[#0D9488] bg-white hover:bg-emerald-50/50 transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#0D9488]">
                        Direktori Alumni
                      </span>
                      <span className="text-[#0D9488] text-xs font-bold">&rarr;</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      Cari teman satu angkatan atau alumni lain berdasarkan domisili kota.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => markOnboardingComplete("/")}
                    className="p-4 rounded-2xl border border-[#CBD5E1] hover:border-[#0D9488] bg-white hover:bg-emerald-50/50 transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#0D9488]">
                        Beranda Utama
                      </span>
                      <span className="text-[#0D9488] text-xs font-bold">&rarr;</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      Lihat berita madrasah terkini, sorotan figur alumni, dan galeri dokumentasi.
                    </p>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => markOnboardingComplete("/dashboard")}
                    className="inline-flex items-center justify-center min-h-[44px] px-8 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-md transition-colors gap-2"
                  >
                    <span>Masuk ke Ruang Anggota Sekarang</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
