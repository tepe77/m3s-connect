"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Container } from "../ui/Container";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/news" },
  { label: "Forum", href: "/forum" },
  { label: "Alumni", href: "/alumni" },
  { label: "Dokumentasi", href: "/archive" },
  { label: "Tentang", href: "/tentang" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        const token = localStorage.getItem("m3s_token");
        const userStr = localStorage.getItem("m3s_user");
        if (token && userStr) {
          setCurrentUser(JSON.parse(userStr));
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("m3s_token");
      localStorage.removeItem("m3s_user");
      localStorage.removeItem("m3s_user_profile");
    } catch {
      // Graceful fallback
    }
    setCurrentUser(null);
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/news?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-lg"
            aria-label="M3S Connect Beranda"
          >
            {/* Stylized Dual Connected Human Figures Icon */}
            <div className="w-10 h-10 flex items-center justify-center text-[#0D9488]">
              <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
                <circle cx="14" cy="11" r="4.5" fill="#0D9488" />
                <circle cx="26" cy="11" r="4.5" fill="#0F766E" />
                <path
                  d="M7 29C7 23.4772 11.4772 19 17 19H18C20.5 19 22.8 20 24.5 21.6"
                  stroke="#0D9488"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M33 29C33 23.4772 28.5228 19 23 19H22C19.5 19 17.2 20 15.5 21.6"
                  stroke="#0F766E"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-[#0F172A] leading-tight flex items-center gap-1 font-sans">
                M3S <span className="text-[#0D9488]">CONNECT</span>
              </span>
              <span className="text-[11px] text-[#64748B] font-medium tracking-normal leading-tight">
                Alumni Community Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Navigasi Utama">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-sm ${
                    isActive
                      ? "text-[#0D9488]"
                      : "text-[#334155] hover:text-[#0D9488]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0D9488] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search bar & Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Input (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:block relative w-64">
              <input
                type="text"
                placeholder="Cari alumni, topik, atau berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3.5 pr-9 py-2 text-xs rounded-full border border-[#D1D5DB] bg-white placeholder-[#9CA3AF] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0D9488]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0D9488] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                  title="Ruang Anggota"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                  <span className="max-w-[130px] truncate">{currentUser.name || "Ruang Anggota"}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <>
                {/* Masuk Button (Rounded Pill matching Daftar) */}
                <Link
                  href="/login"
                  className="px-5 py-2 text-xs font-semibold text-[#0F172A] hover:text-[#0D9488] border border-[#CBD5E1] hover:border-[#0D9488] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  Masuk
                </Link>

                {/* Daftar Button */}
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center min-h-[38px] px-5 py-2 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  Daftar
                </Link>
              </>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#0F172A] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5E7EB] py-4 space-y-3">
            {/* Search Input on Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                placeholder="Cari alumni, topik, atau berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3.5 pr-9 py-2.5 text-xs rounded-full border border-[#D1D5DB] bg-white placeholder-[#9CA3AF] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                    pathname === item.href
                      ? "text-[#0D9488] bg-emerald-50"
                      : "text-[#334155] hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Actions */}
            <div className="pt-2 border-t border-[#E5E7EB] flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-2.5 text-xs font-bold text-[#0D9488] bg-emerald-50 rounded-full border border-emerald-200"
                  >
                    Ruang Anggota ({currentUser.name})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 text-xs font-semibold text-rose-600 bg-white border border-rose-200 rounded-full text-center"
                  >
                    Keluar dari Akun
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] rounded-full"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-bold text-white bg-[#0D9488] rounded-full"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
