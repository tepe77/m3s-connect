"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Shield, LogOut, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [compact, setCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Scrolled past 50px turns navbar into Velora floating pill
      setCompact(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        compact ? "pt-2 sm:pt-3 px-3 sm:px-6" : "pt-0 px-0 bg-white/90 border-b border-slate-200/70 backdrop-blur-md"
      )}
    >
      <nav
        aria-label="Navigasi Utama"
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-300 ease-out",
          compact
            ? "max-w-5xl h-14 rounded-full border border-slate-200/90 bg-white/85 px-4 sm:px-6 shadow-lg shadow-slate-900/5 backdrop-blur-md"
            : "max-w-[1400px] h-20 px-4 sm:px-6 lg:px-8 bg-transparent"
        )}
      >
        {/* Brand Logo Left */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-full group"
          aria-label="M3S Connect Beranda"
        >
          {/* Dual Figures Emblem */}
          <div className="size-9 rounded-xl bg-emerald-50 text-[#0D9488] flex items-center justify-center border border-emerald-100/80 transition-transform group-hover:scale-105">
            <svg viewBox="0 0 40 40" fill="none" className="size-7">
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
            <span className="text-base sm:text-lg font-black tracking-tight text-[#0F172A] leading-tight flex items-center gap-1">
              M3S <span className="text-[#0D9488]">CONNECT</span>
            </span>
            {!compact && (
              <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium tracking-normal leading-tight transition-opacity duration-200">
                Alumni Community Platform
              </span>
            )}
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 relative">
          {navItems.map((item, index) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]",
                  isActive
                    ? "text-[#0D9488] bg-emerald-50/80 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {hoveredIndex === index && !isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-slate-100 -z-10 transition-all duration-150"
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action / Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Toggle / Input */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  autoFocus
                  className="w-36 sm:w-48 pl-3 pr-8 py-1.5 text-xs rounded-full border border-slate-300 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Buka pencarian"
                className="size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Search className="size-4" />
              </button>
            )}
          </div>

          {currentUser ? (
            /* Logged-In User Controls */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/messages"
                className="relative size-8 rounded-full flex items-center justify-center text-slate-600 hover:text-[#0D9488] hover:bg-slate-100 transition-colors"
                title="Pesan Masuk"
              >
                <MessageSquare className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500" />
              </Link>

              {(currentUser.role === "admin" || currentUser.role === "moderator") && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-colors"
                  title="Pusat Administrasi"
                >
                  <Shield className="size-3 text-amber-600" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#0D9488] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors"
                title="Ruang Anggota"
              >
                <span className="size-1.5 rounded-full bg-[#0D9488]" />
                <span className="max-w-[100px] sm:max-w-[120px] truncate">
                  {currentUser.name || "Akun"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="size-8 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors"
                title="Keluar"
                aria-label="Keluar"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            /* Guest Controls: Velora Pill Sign-In & Sign-Up */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0D9488] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <span>Daftar</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden size-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mx-3 mt-2 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Cari alumni, berita, forum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3.5 pr-9 py-2 text-xs rounded-full border border-slate-300 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
            <button
              type="submit"
              aria-label="Cari"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0D9488]"
            >
              <Search className="size-3.5" />
            </button>
          </form>

          {/* Mobile Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors",
                    isActive
                      ? "text-[#0D9488] bg-emerald-50/80 font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile User Section */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            {currentUser ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  Masuk sebagai: <span className="font-bold text-slate-800">{currentUser.name}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-bold text-[#0D9488] bg-emerald-50 rounded-xl"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold text-white bg-[#0D9488] rounded-xl"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
