"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function AlumniLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && data.errors.email) {
          setErrorMessage(data.errors.email[0]);
        } else if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Autentikasi gagal. Silakan periksa kembali email dan kata sandi Anda.");
        }
        setLoading(false);
        return;
      }

      if (data.data?.token) {
        localStorage.setItem("m3s_token", data.data.token);
        localStorage.setItem("m3s_user", JSON.stringify(data.data.user));
        if (rememberMe) {
          localStorage.setItem("m3s_remember_email", email);
        }
        router.push("/profile");
      }
    } catch {
      setErrorMessage("Tidak dapat terhubung ke server backend. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  const fillAlumniCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("Password123!");
    setErrorMessage(null);
  };

  return (
    <div className="py-10 md:py-16 bg-[#F8FAFC]">
      <Container size="default">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-w-5xl mx-auto">
          {/* Left Community Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#062A24] via-[#083830] to-[#0A443B] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D9488] flex items-center justify-center font-bold text-white text-lg">
                  M3S
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight block">
                    M3S CONNECT
                  </span>
                  <span className="text-xs text-white/70">Portal Khusus Alumni</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                  Selamat Datang Kembali di Rumah Digital Alumni
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Masuk untuk mengelola profil angkatan, memperbarui rekam jejak karir, dan terhubung bersama ribuan alumni MAN 3 Sleman.
                </p>
              </div>

              {/* Benefit List */}
              <div className="space-y-3 pt-2 text-xs text-white/85">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-[#2DD4BF] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>Akses direktori pencarian alumni terverifikasi</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-[#2DD4BF] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>Terlibat dalam forum diskusi dan peluang karir</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-[#2DD4BF] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>Dukung beasiswa dan kegiatan sosial almamater</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/10 text-xs text-white/60 relative z-10">
              Ikatan Alumni Madrasah Aliyah Negeri 3 Sleman
            </div>
          </div>

          {/* Right Login Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D9488] text-xs font-semibold border border-emerald-200">
                  <span>Autentikasi Akun Alumni</span>
                </div>
                <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                  Masuk Akun Alumni
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Silakan masukkan email terdaftar atau nomor identitas alumni Anda.
                </p>
              </div>

              {/* Quick Fill Demo Buttons */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block">
                  Pilih Akun Alumni Demo:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillAlumniCredentials("budi.santoso@alumni.m3s.id")}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488] text-[#1E293B] shadow-xs transition-colors"
                  >
                    Budi Santoso (Alumni 2018)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillAlumniCredentials("siti.rahmawati@alumni.m3s.id")}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488] text-[#1E293B] shadow-xs transition-colors"
                  >
                    Siti Rahmawati (Alumni 2019)
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Email Alumni / Identitas
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@alumni.m3s.id"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                      Kata Sandi
                    </label>
                    <Link href="/login" className="text-xs text-[#0D9488] hover:underline font-medium">
                      Lupa sandi?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A] transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-[#64748B] cursor-pointer">
                    Ingat saya di perangkat ini
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[46px] px-6 py-2.5 text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] disabled:bg-[#94A3B8] rounded-full shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                  >
                    {loading ? "Memverifikasi Kredensial..." : "Masuk ke Akun Alumni"}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
              <div>
                Belum memiliki akun alumni?{" "}
                <Link href="/register" className="font-bold text-[#0D9488] hover:underline">
                  Daftar di sini
                </Link>
              </div>

              <div>
                <Link href="/login" className="text-[#64748B] hover:text-[#0F172A] underline">
                  Login Staf & Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
