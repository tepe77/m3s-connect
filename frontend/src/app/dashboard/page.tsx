"use client";

import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/api";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("m3s_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("m3s_token");
    localStorage.removeItem("m3s_user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Container size="wide">
          <p className="text-sm text-[#64748B]">Memuat dashboard anggota...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <Container size="wide">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E2E8F0]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2BA8A2]">
              Ruang Anggota Komunitas
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Selamat datang kembali, {user?.name}!
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Peran: <span className="capitalize font-semibold text-[#0F172A]">{user?.role}</span> • Status: <span className="capitalize text-[#2BA8A2] font-semibold">{user?.status}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#0D9488] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors gap-1.5"
            >
              <span>🧭</span>
              <span>Tur Panduan (Walkthrough)</span>
            </Link>

            {(user?.role === "admin" || user?.role === "moderator") && (
              <a
                href={`${BACKEND_URL}/admin`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-full transition-colors"
              >
                Panel Filament Backend ↗
              </a>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-full transition-colors"
            >
              Keluar Akun
            </button>
          </div>
        </div>

        {/* Moderator Notice Bar */}
        {(user?.role === "moderator" || user?.role === "admin") && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#0F172A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#2DD4BF] flex items-center justify-center font-bold text-sm shrink-0">
                🛡️
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Akses {user?.role === "admin" ? "Administrator" : "Moderator Komunitas"} Aktif
                </h4>
                <p className="text-[11px] text-slate-300">
                  Anda memiliki wewenang untuk mengelola kategori forum, meninjau laporan spam, dan memverifikasi calon alumni.
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-[#0F172A] bg-[#2DD4BF] hover:bg-emerald-300 rounded-full transition-colors shrink-0"
            >
              Buka Panel Moderasi & Admin &rarr;
            </Link>
          </div>
        )}

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Profile Completion Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0F172A]">Kelengkapan Profil Alumni</h2>
                <span className="text-xs font-bold text-[#0D9488]">85% Lengkap</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0D9488] h-full w-[85%] rounded-full" />
              </div>
              <p className="text-xs text-[#64748B]">
                Tambahkan riwayat pengalaman kerja dan akun sosial media agar teman seangkatan mudah menghubungi Anda.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full transition-colors gap-1.5"
                >
                  <span>Edit Profil Saya</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/alumni"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#0F172A] bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  Lihat Profil di Direktori
                </Link>
              </div>
            </div>

            {/* Latest Discussions */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0F172A]">Diskusi Forum Terbaru</h2>
                <Link href="/forum" className="text-xs font-semibold text-[#2BA8A2] hover:underline">
                  Semua Topik
                </Link>
              </div>
              <div className="divide-y divide-[#E2E8F0]">
                <div className="py-3 first:pt-0 last:pb-0">
                  <span className="text-xs text-[#2BA8A2] font-semibold">Kegiatan & Reuni</span>
                  <h3 className="text-sm font-semibold text-[#0F172A] hover:text-[#2BA8A2]">
                    <Link href="/forum">Rencana Reuni Akbar Lintas Angkatan MAN 3 Sleman 2026</Link>
                  </h3>
                  <p className="text-xs text-[#64748B]">12 balasan • Terakhir aktif 1 jam lalu</p>
                </div>
                <div className="py-3 first:pt-0 last:pb-0">
                  <span className="text-xs text-[#2BA8A2] font-semibold">Karir & Profesi</span>
                  <h3 className="text-sm font-semibold text-[#0F172A] hover:text-[#2BA8A2]">
                    <Link href="/forum">Lowongan Magang Software Engineer dan Product Specialist</Link>
                  </h3>
                  <p className="text-xs text-[#64748B]">8 balasan • Terakhir aktif 3 jam lalu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Direct Messages Quick Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0F172A]">Pesan Privat</h2>
                <Link href="/messages" className="text-xs font-semibold text-[#0D9488] hover:underline">
                  Kotak Masuk &rarr;
                </Link>
              </div>
              <p className="text-xs text-[#64748B]">
                Terhubung dan berkirim pesan langsung secara aman dengan sesama alumni.
              </p>
              <Link
                href="/messages"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0D9488] text-xs font-bold transition-colors border border-emerald-200"
              >
                <span>✉️</span>
                <span>Buka Pesan Masuk</span>
              </Link>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] space-y-4">
              <h2 className="text-base font-bold text-[#0F172A]">Kegiatan Mendatang</h2>
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-2">
                <span className="text-xs font-bold text-[#2BA8A2]">Webinar Karir Alumni</span>
                <p className="text-xs font-medium text-[#0F172A]">
                  Membangun Portofolio Global di Era Digital
                </p>
                <p className="text-xs text-[#64748B]">Minggu, 20 Oktober 2026 (19.00 WIB)</p>
                <Link
                  href="/events"
                  className="inline-block text-xs font-semibold text-[#2BA8A2] hover:underline pt-1"
                >
                  Detail & Konfirmasi RSVP
                </Link>
              </div>
            </div>

            {/* Rekomendasi Alumni */}
            <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] space-y-4">
              <h2 className="text-base font-bold text-[#0F172A]">Rekomendasi Alumni Terhubung</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#0F172A]">Siti Rahmawati</p>
                    <p className="text-[#64748B]">Angkatan 2019 • Brand Strategist</p>
                  </div>
                  <Link href="/alumni" className="text-[#2BA8A2] font-semibold hover:underline">
                    Lihat
                  </Link>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#0F172A]">Budi Santoso</p>
                    <p className="text-[#64748B]">Angkatan 2018 • Senior Engineer</p>
                  </div>
                  <Link href="/alumni" className="text-[#2BA8A2] font-semibold hover:underline">
                    Lihat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
