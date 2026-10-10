"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";

const RULES = [
  { label: "Minimal 8 karakter", test: (v: string) => v.length >= 8 },
  { label: "Mengandung huruf", test: (v: string) => /[a-zA-Z]/.test(v) },
  { label: "Mengandung angka", test: (v: string) => /\d/.test(v) },
];

export default function RegisterPage() {
  const router = useRouter();
  const id = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passedRules = RULES.filter((r) => r.test(password)).length;
  const passwordsMatch = password.length > 0 && password === passwordConfirmation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!agreedTerms) {
      setErrorMessage("Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.");
      return;
    }

    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      };

      if (graduationYear.trim()) {
        payload.graduation_year = parseInt(graduationYear.trim(), 10);
      }

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstKey = Object.keys(data.errors)[0];
          setErrorMessage(data.errors[firstKey][0]);
        } else if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Gagal mendaftarkan akun. Silakan periksa kembali data isian Anda.");
        }
        setLoading(false);
        return;
      }

      // If registered successfully, store token & redirect to onboarding
      if (data.data?.token) {
        localStorage.setItem("m3s_token", data.data.token);
        localStorage.setItem("m3s_user", JSON.stringify(data.data.user));

        // Immediately notify Navbar and any active components in the current window
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("m3s_auth_change", { detail: data.data.user }));

        setSuccessMessage("Pendaftaran berhasil! Mengalihkan ke halaman orientasi alumni...");
        setTimeout(() => {
          router.push("/onboarding");
        }, 1200);
      } else {
        setSuccessMessage("Pendaftaran akun berhasil! Silakan masuk dengan akun baru Anda.");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch {
      setErrorMessage("Tidak dapat terhubung ke server backend. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-50/60 px-4 py-12 sm:py-16 lg:px-8 flex items-center justify-center">
      {/* Velora GridPattern Background */}
      <GridPattern
        width={40}
        height={40}
        squares={[
          [1, 2],
          [3, 4],
          [7, 1],
          [11, 3],
          [15, 2],
          [17, 6],
        ]}
        className="-z-10 [mask-image:radial-gradient(ellipse_75%_65%_at_top,black,transparent)]"
      />

      {/* Subtle Radial Ambient Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-3xl -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
      />

      {/* Velora Signup Card Container */}
      <div className="w-full max-w-lg mx-auto">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-emerald-200 shadow-2xs text-[#0D9488] text-xs font-semibold hover:border-emerald-300 transition-colors"
          >
           
            <span>IKAMAYOGA • Komunitas Alumni Mayoga</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Bergabung ke IKAMAYOGA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Daftarkan diri Anda untuk terhubung dengan sesama alumni, berbagi peluang karir, dan berkontribusi untuk madrasah.
          </p>
        </div>

        {/* Card Body */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
          {/* Status Messages */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2 animate-in fade-in-50"
            >
              <AlertCircle className="size-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in-50"
            >
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-name`}>Nama Lengkap Sesuai Ijazah</Label>
              <div className="relative">
                <Input
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Kom."
                  className="h-10 pl-9.5 pr-3 text-xs"
                />
                <User className="size-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={`${id}-email`}>Alamat Email Aktif</Label>
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
                <Label htmlFor={`${id}-graduation`}>Tahun Lulus / Angkatan</Label>
                <div className="relative">
                  <Input
                    id={`${id}-graduation`}
                    name="graduation_year"
                    type="number"
                    min={1970}
                    max={2030}
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="Contoh: 2019"
                    className="h-10 pl-9.5 pr-3 text-xs"
                  />
                  <GraduationCap className="size-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={`${id}-password`}>Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id={`${id}-password`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
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

              <div className="space-y-1.5">
                <Label htmlFor={`${id}-confirm`}>Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id={`${id}-confirm`}
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="h-10 pl-9.5 pr-10 text-xs"
                  />
                  <Lock className="size-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="cursor-pointer absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-md focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Velora Live Password Rules Meter */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>Kekuatan Kata Sandi</span>
                <span className="text-[10px] text-slate-500">
                  {passedRules === 3 && passwordsMatch
                    ? "Kuat & Cocok ✓"
                    : `${passedRules}/3 syarat terpenuhi`}
                </span>
              </div>

              {/* Progress Bar Indicators */}
              <div aria-hidden className="grid grid-cols-3 gap-1.5">
                {RULES.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 rounded-full bg-slate-200 transition-colors",
                      i < passedRules && "bg-emerald-500"
                    )}
                  />
                ))}
              </div>

              {/* Rules Checklist */}
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] pt-1">
                {RULES.map((rule) => {
                  const met = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className={cn(
                        "flex items-center gap-1.5 transition-colors",
                        met ? "text-emerald-700 font-medium" : "text-slate-400"
                      )}
                    >
                      {met ? (
                        <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="size-3 shrink-0" />
                      )}
                      <span className="truncate">{rule.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Terms and Privacy Agreement */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id={`${id}-terms`}
                name="terms"
                type="checkbox"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 size-4 rounded-md border-slate-300 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
              />
              <Label htmlFor={`${id}-terms`} className="cursor-pointer font-normal text-xs text-slate-600 leading-snug">
                Saya menyetujui{" "}
                <Link href="/terms" className="text-[#0D9488] font-semibold hover:underline">
                  Ketentuan Layanan
                </Link>{" "}
                dan{" "}
                <Link href="/privacy" className="text-[#0D9488] font-semibold hover:underline">
                  Kebijakan Privasi
                </Link>{" "}
                Komunitas Alumni MAN 3 Sleman.
              </Label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !agreedTerms}
                className="w-full h-11 text-xs font-bold gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                <span>{loading ? "Mendaftarkan Akun..." : "Daftar Akun Alumni"}</span>
                {!loading && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </form>

          {/* Login Redirection Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>Sudah memiliki akun terdaftar? </span>
            <Link href="/login" className="font-bold text-[#0D9488] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

