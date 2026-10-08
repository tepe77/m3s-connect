"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridPattern } from "@/components/ui/grid-pattern";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function LoginPage() {
  const router = useRouter();
  const id = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
          setErrorMessage("Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.");
        }
        setLoading(false);
        return;
      }

      // Save token and user in localStorage
      if (data.data?.token) {
        localStorage.setItem("m3s_token", data.data.token);
        localStorage.setItem("m3s_user", JSON.stringify(data.data.user));

        const user = data.data.user;
        const isOnboarded = localStorage.getItem(`m3s_onboarded_${user?.id}`);

        if (!isOnboarded) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setErrorMessage("Tidak dapat terhubung ke server backend. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("Password123!");
    setErrorMessage(null);
  };

  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-50/60 px-4 py-12 sm:py-16 lg:px-8 flex items-center justify-center">
      {/* Velora GridPattern Background */}
      <GridPattern
        width={40}
        height={40}
        squares={[
          [2, 1],
          [4, 3],
          [8, 2],
          [12, 4],
          [14, 1],
          [18, 5],
        ]}
        className="-z-10 [mask-image:radial-gradient(ellipse_75%_65%_at_top,black,transparent)]"
      />

      {/* Subtle Radial Ambient Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-3xl -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
      />

      {/* Velora Signin Card Container */}
      <div className="w-full max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-emerald-200 shadow-2xs text-[#0D9488] text-xs font-semibold hover:border-emerald-300 transition-colors"
          >
            <Sparkles className="size-3.5 text-emerald-600" />
            <span>M3S Connect • Portal Alumni Mayoga</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Selamat Datang Kembali
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Masuk ke akun Anda untuk mengakses direktori alumni, forum diskusi, dan jejaring karir.
          </p>
        </div>

        {/* Card Body */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
          {/* Quick Demo Seeders Pills */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <span>Akun Demo Cepat:</span>
              <span className="text-[10px] text-emerald-700 font-semibold lowercase">klik untuk isi otomatis</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => fillCredentials("budi.santoso@alumni.m3s.id")}
                className="cursor-pointer px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white border border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488] text-slate-700 transition-colors shadow-2xs"
              >
                Alumni (Budi)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("admin@m3s-connect.id")}
                className="cursor-pointer px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white border border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488] text-slate-700 transition-colors shadow-2xs"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("moderator@m3s-connect.id")}
                className="cursor-pointer px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white border border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488] text-slate-700 transition-colors shadow-2xs"
              >
                Moderator
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    Object.keys(localStorage).forEach((key) => {
                      if (key.startsWith("m3s_onboarded_")) {
                        localStorage.removeItem(key);
                      }
                    });
                  } catch {}
                  fillCredentials("budi.santoso@alumni.m3s.id");
                }}
                className="cursor-pointer px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 border border-emerald-300 text-[#0D9488] hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Mengosongkan orientasi untuk menguji alur Onboarding"
              >
                Uji Onboarding &rarr;
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2 animate-in fade-in-50"
            >
              <AlertCircle className="size-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-email`}>Alamat Email</Label>
              <div className="relative">
                <Input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@alumni.m3s.id"
                  className="h-10 pl-9.5 pr-3 text-xs"
                />
                <Mail className="size-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-password`}>Kata Sandi</Label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-[#0D9488] hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id={`${id}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 pl-9.5 pr-10 text-xs"
                />
                <Lock className="size-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-md focus:outline-none"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id={`${id}-remember`}
                name="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded-md border-slate-300 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
              />
              <Label htmlFor={`${id}-remember`} className="cursor-pointer font-normal text-xs text-slate-600">
                Ingat saya di perangkat ini
              </Label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-xs font-bold gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                <span>{loading ? "Memverifikasi Kredensial..." : "Masuk ke Akun"}</span>
                {!loading && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>Belum memiliki akun alumni? </span>
            <Link href="/register" className="font-bold text-[#0D9488] hover:underline">
              Daftar Akun Baru
            </Link>
          </div>
        </div>

        {/* Admin Filament Reference */}
        <p className="mt-6 text-center text-[11px] text-slate-400">
          Dashboard Administrasi Filament:{" "}
          <a
            href="http://localhost:8000/admin"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-[#0D9488] font-medium underline"
          >
            http://localhost:8000/admin
          </a>
        </p>
      </div>
    </section>
  );
}

