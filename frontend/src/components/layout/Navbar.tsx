"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "../ui/Container";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Direktori Alumni", href: "/alumni" },
  { label: "Forum Diskusi", href: "/forum" },
  { label: "Kisah Alumni", href: "/stories" },
  { label: "Kegiatan", href: "/events" },
  { label: "Kabar Berita", href: "/news" },
  { label: "Dokumentasi", href: "/archive" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-sm">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
            aria-label="M3S Connect Beranda"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2BA8A2] text-white font-bold text-lg tracking-wider">
              M3S
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#0F172A] leading-tight">
                M3S Connect
              </span>
              <span className="text-xs text-[#64748B] font-medium leading-tight">
                Alumni MAN 3 Sleman
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi Utama">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2] ${
                    isActive
                      ? "text-[#2BA8A2] bg-[#2BA8A2]/10 font-semibold"
                      : "text-[#0F172A] hover:text-[#2BA8A2] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-[#0F172A] hover:text-[#2BA8A2] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-md shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2] focus-visible:ring-offset-2"
            >
              Gabung Komunitas
            </Link>

            {/* Mobile menu toggle for tablet and secondary links */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-md text-[#0F172A] hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
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

        {/* Mobile Dropdown Menu for secondary browsing */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "text-[#2BA8A2] bg-[#2BA8A2]/10 font-semibold"
                    : "text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </header>
  );
}
