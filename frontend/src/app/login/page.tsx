"use client";

import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

        if (data.data.user?.role === "alumni") {
          router.push("/profile");
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
    <div className="py-10 md:py-16 bg-[#F8FAFC]">
      <Container size="narrow">
        {/* Banner Khusus Login Alumni */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#0D9488] flex items-center justify-center font-bold text-sm shrink-0">
              🎓
            </div>
            <div>
              <p className="text-xs font-bold text-[#064E3B]">Apakah Anda Alumni MAN 3 Sleman?</p>
              <p className="text-[11px] text-[#065F46]">Gunakan portal khusus alumni untuk pengalaman yang dipersonalisasi.</p>
            </div>
          </div>
          <Link
            href="/alumni/login"
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shrink-0 transition-colors"
          >
            Portal Alumni &rarr;
          </Link>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Masuk ke M3S Connect</h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Portal komunitas & administrasi MAN 3 Sleman
            </p>
          </div>

          {/* Quick Fill Demo Seeders Buttons */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Pilih Akun Demo Seeders:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("budi.santoso@alumni.m3s.id")}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white border border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488] text-[#0F172A] transition-colors"
              >
                Alumni (Budi Santoso)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("admin@m3s-connect.id")}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white border border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488] text-[#0F172A] transition-colors"
              >
                Admin (admin@m3s)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("moderator@m3s-connect.id")}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white border border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488] text-[#0F172A] transition-colors"
              >
                Moderator
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@alumni.m3s.id"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Kata Sandi
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] px-6 py-2.5 text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] disabled:bg-[#94A3B8] rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                {loading ? "Memverifikasi Kredensial..." : "Masuk Sekarang"}
              </button>
            </div>
          </form>

          {/* Admin Panel info note */}
          <div className="pt-4 border-t border-[#E5E7EB] text-center text-xs text-[#64748B] space-y-1">
            <p>
              Belum terdaftar sebagai alumni?{" "}
              <Link href="/register" className="font-bold text-[#0D9488] hover:underline">
                Daftar akun baru
              </Link>
            </p>
            <p>
              Admin & Moderator panel:{" "}
              <a href="http://localhost:8000/admin" target="_blank" rel="noreferrer" className="text-[#0D9488] underline">
                http://localhost:8000/admin
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
