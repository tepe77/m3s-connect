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

        // If user is Admin, direct option or go to dashboard
        if (data.data.user?.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setErrorMessage("Tidak dapat terhubung ke server backend (http://localhost:8000). Pastikan container Docker menyala.");
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
    <div className="py-10 md:py-16">
      <Container size="narrow">
        {/* Notice Info Dashboard Administrasi (Filament) */}
        <div className="mb-6 p-4 rounded-lg bg-white border border-[#2BA8A2]/30 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2BA8A2]/10 text-[#2BA8A2]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs text-[#0F172A] space-y-1">
              <p className="font-bold text-sm text-[#0F172A]">
                Pusat Administrasi Platform (Filament Admin Panel)
              </p>
              <p className="text-[#64748B]">
                Dashboard administrasi khusus Administrator dan Moderator berada di:{" "}
                <a
                  href="http://localhost:8000/admin"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#2BA8A2] hover:underline"
                >
                  http://localhost:8000/admin
                </a>
              </p>
              <p className="text-[#64748B]">
                Gunakan akun admin: <span className="font-mono text-[#0F172A]">admin@m3s-connect.id</span> / <span className="font-mono text-[#0F172A]">Password123!</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-xl border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-[#0F172A]">Masuk ke M3S Connect</h1>
            <p className="text-sm text-[#64748B]">
              Portal komunitas alumni MAN 3 Sleman (Mayoga)
            </p>
          </div>

          {/* Quick Fill Demo Seeders Buttons */}
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
            <p className="text-xs font-semibold text-[#0F172A]">Pilih Akun Demo Seeders:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin@m3s-connect.id")}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-[#E2E8F0] hover:border-[#2BA8A2] hover:text-[#2BA8A2] text-[#0F172A] transition-colors"
              >
                Admin (admin@m3s-connect.id)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("budi.santoso@alumni.m3s.id")}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-[#E2E8F0] hover:border-[#2BA8A2] hover:text-[#2BA8A2] text-[#0F172A] transition-colors"
              >
                Alumni (budi.santoso)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("moderator@m3s-connect.id")}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-[#E2E8F0] hover:border-[#2BA8A2] hover:text-[#2BA8A2] text-[#0F172A] transition-colors"
              >
                Moderator (moderator@m3s)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs font-medium text-[#EF4444]"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#0F172A] mb-1">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@alumni.m3s.id"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-semibold text-[#0F172A]">
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
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] px-4 py-2.5 text-sm font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] disabled:opacity-50 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2] focus-visible:ring-offset-2 flex items-center justify-center gap-2"
            >
              {loading ? "Memverifikasi Kredensial..." : "Masuk Sekarang"}
            </button>
          </form>

          <div className="text-center text-xs text-[#64748B] pt-4 border-t border-[#E2E8F0]">
            Belum terdaftar sebagai alumni?{" "}
            <Link href="/register" className="font-semibold text-[#2BA8A2] hover:underline">
              Daftar akun alumni
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
