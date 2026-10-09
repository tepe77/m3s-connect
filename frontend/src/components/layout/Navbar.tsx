"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  MessageSquare,
  Shield,
  LogOut,
  ArrowRight,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  LayoutDashboard,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ForumNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  href: string;
}

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/news" },
  { label: "Forum", href: "/forum" },
  { label: "Alumni", href: "/alumni" },
  { label: "Dokumentasi", href: "/archive" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
  } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [forumNotifications, setForumNotifications] = useState<ForumNotification[]>([
    {
      id: "fn-1",
      title: "Balasan Topik Forum",
      description: "Ahmad Fauzi menanggapi topik Anda di Forum Alumni.",
      time: "10 mnt lalu",
      unread: true,
      href: "/forum",
    },
    {
      id: "fn-2",
      title: "Tanggapan Diskusi Baru",
      description: "Diskusi baru di topik: Sharing Karir & Peluang Kerja Alumni.",
      time: "1 jam lalu",
      unread: true,
      href: "/forum",
    },
  ]);

  // Smooth gliding pill state for nav items
  const [hover, setHover] = useState<{
    left: number;
    width: number;
    on: boolean;
    moved: boolean;
  }>({ left: 0, width: 0, on: false, moved: false });

  const navListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when route changes
  useEffect(() => {
    setUserDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth scroll listener with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setCompact(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync user state & messages from localStorage
  const syncUser = () => {
    try {
      const token = localStorage.getItem("m3s_token");
      const userStr = localStorage.getItem("m3s_user");
      if (token && userStr) {
        const parsed = JSON.parse(userStr);
        // If avatar is missing, check user profile storage
        if (!parsed.avatar) {
          const profileStr = localStorage.getItem("m3s_user_profile");
          if (profileStr) {
            try {
              const profile = JSON.parse(profileStr);
              if (profile.avatar) {
                parsed.avatar = profile.avatar;
              }
            } catch {}
          }
        }
        if (!parsed.avatar) {
          parsed.avatar = "/images/avatar-ahmad.jpg";
        }
        setCurrentUser(parsed);

        // Sync unread messages count
        const msgData = localStorage.getItem("m3s_direct_messages");
        if (msgData) {
          try {
            const threads = JSON.parse(msgData);
            if (Array.isArray(threads)) {
              const count = threads.reduce(
                (acc: number, t: any) => acc + (t.unreadCount || 0),
                0
              );
              setUnreadMessagesCount(count);
            }
          } catch {}
        }
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    syncUser();

    // Listen to storage event (cross-tab) and custom m3s_auth_change event (same-tab)
    window.addEventListener("storage", syncUser);
    window.addEventListener("m3s_auth_change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("m3s_auth_change", syncUser);
    };
  }, []);

  // Automatically re-sync whenever pathname changes (e.g. redirected from /login to /dashboard or /)
  useEffect(() => {
    syncUser();
  }, [pathname]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("m3s_token");
      localStorage.removeItem("m3s_user");
      localStorage.removeItem("m3s_user_profile");
    } catch {
      // Graceful fallback
    }
    setCurrentUser(null);
    setUserDropdownOpen(false);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("m3s_auth_change"));
    window.location.href = "/login";
  };

  const handleMarkAllRead = () => {
    setForumNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const unreadForumCount = forumNotifications.filter((n) => n.unread).length;
  const totalUnread = unreadMessagesCount + unreadForumCount;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/news?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Nav item hover gliding capsule handlers
  const handleItemHover = ({ currentTarget: target }: React.SyntheticEvent<HTMLElement>) => {
    setHover((prev) => ({
      left: target.offsetLeft,
      width: target.offsetWidth,
      on: true,
      moved: prev.on, // animate slide if already hovering an item
    }));
  };

  const handleNavLeave = () => {
    setHover((prev) => ({
      ...prev,
      on: false,
      moved: false,
    }));
  };

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        compact
          ? "pt-2.5 sm:pt-3 px-3 sm:px-6 bg-transparent pointer-events-none"
          : isHome
          ? "pt-0 px-0 bg-white/30 backdrop-blur-md"
          : "pt-0 px-0 bg-white/80 backdrop-blur-md"
      )}
    >
      {/* Delicate 1px bottom border line when full-width at top; smoothly fades out on scroll */}
      <div
        aria-hidden
        className={cn(
          "absolute bottom-0 inset-x-0 h-px pointer-events-none transition-opacity duration-300",
          isHome ? "bg-white/40" : "bg-slate-200/60",
          compact ? "opacity-0" : "opacity-100"
        )}
      />

      <nav
        aria-label="Navigasi Utama"
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          compact
            ? "pointer-events-auto max-w-4xl sm:max-w-5xl h-14 px-4 sm:px-6 rounded-full border border-slate-200/90 bg-white/90 shadow-md shadow-emerald-950/[0.04] backdrop-blur-md"
            : "w-full max-w-[1400px] h-20 px-4 sm:px-6 lg:px-8 rounded-none border border-transparent bg-transparent shadow-none"
        )}
      >
        {/* Brand Logo Left */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-full group"
          aria-label="IKAMAYOGA Beranda"
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
              IKA<span className="text-[#0D9488]">MAYOGA</span>
            </span>
            <span
              className={cn(
                "text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-normal leading-tight transition-all duration-300",
                compact ? "hidden md:inline-block" : "hidden sm:inline-block"
              )}
            >
              Ikatan Alumni MAYOGA
            </span>
          </div>
        </Link>

        {/* Center Nav Links with Velora Gliding Capsule (Desktop) */}
        <div
          ref={navListRef}
          onMouseLeave={handleNavLeave}
          className="hidden lg:flex items-center relative py-1"
        >
          {/* Velora Smooth Gliding Capsule Highlight */}
          <span
            aria-hidden
            style={{
              transform: `translateX(${hover.left}px)`,
              width: `${hover.width}px`,
              opacity: hover.on ? 1 : 0,
              transition: hover.moved
                ? "transform 240ms cubic-bezier(0.16, 1, 0.3, 1), width 240ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease"
                : "opacity 150ms ease",
            }}
            className="absolute inset-y-1 left-0 rounded-full bg-slate-100/90 pointer-events-none -z-0"
          />

          <ul className="flex items-center gap-1 relative z-10">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onMouseEnter={handleItemHover}
                    onFocus={handleItemHover}
                    className={cn(
                      "relative block rounded-full px-3.5 py-1.5 text-xs sm:text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]",
                      isActive
                        ? "bg-emerald-50 text-[#0D9488] font-bold"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
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
                  className="w-36 sm:w-48 pl-3 pr-8 py-1.5 text-xs rounded-full border border-slate-300 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all shadow-xs"
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
                className="size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
              >
                <Search className="size-4" />
              </button>
            )}
          </div>

          {currentUser ? (
            /* Logged-In User Controls: Avatar + Notifications Dropdown */
            <div className="relative flex items-center" ref={userDropdownRef}>
              {/* Avatar Button */}
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="relative flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] cursor-pointer"
                aria-expanded={userDropdownOpen}
                aria-label="Menu Pengguna"
              >
                <div className="relative">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || "Alumni"}
                      className="size-8.5 rounded-full object-cover ring-2 ring-emerald-500/25"
                    />
                  ) : (
                    <div className="size-8.5 rounded-full bg-emerald-100 text-[#0D9488] font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/25">
                      {getUserInitials(currentUser.name)}
                    </div>
                  )}
                  {/* Status Indicator / Notification Ping */}
                  {totalUnread > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                    </span>
                  ) : (
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "size-3.5 text-slate-400 transition-transform duration-200 hidden sm:block",
                    userDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {/* User Avatar Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 backdrop-blur-md z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in-0 zoom-in-95 duration-150"
                  role="menu"
                >
                  {/* User Profile Card Header */}
                  <div className="p-3.5 bg-slate-50/70 flex items-center gap-3">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name || "Alumni"}
                        className="size-10 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-emerald-100 text-[#0D9488] font-bold text-sm flex items-center justify-center ring-2 ring-emerald-500/20 shrink-0">
                        {getUserInitials(currentUser.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {currentUser.name || "Alumni IKAMAYOGA"}
                        </p>
                        {currentUser.role === "admin" && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {currentUser.email || "alumni@mayoga.sch.id"}
                      </p>
                    </div>
                  </div>

                  {/* Notifikasi Section (Pesan maupun Balasan Forum) */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Bell className="size-3.5 text-emerald-700" />
                        <span className="text-xs font-bold text-slate-800">Notifikasi</span>
                        {totalUnread > 0 ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            {totalUnread} Baru
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Semua terbaca</span>
                        )}
                      </div>
                      {totalUnread > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <CheckCheck className="size-3" />
                          Tandai dibaca
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                      {/* Direct Messages Entry */}
                      {unreadMessagesCount > 0 && (
                        <Link
                          href="/messages"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors text-left"
                        >
                          <div className="size-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <MessageSquare className="size-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900">
                              Pesan Pribadi Masuk
                            </p>
                            <p className="text-[11px] text-slate-600 truncate">
                              {unreadMessagesCount} pesan baru belum dibaca
                            </p>
                          </div>
                        </Link>
                      )}

                      {/* Forum Notifications Entries */}
                      {forumNotifications.map((notif) => (
                        <Link
                          key={notif.id}
                          href={notif.href}
                          onClick={() => {
                            setForumNotifications((prev) =>
                              prev.map((n) =>
                                n.id === notif.id ? { ...n, unread: false } : n
                              )
                            );
                            setUserDropdownOpen(false);
                          }}
                          className={cn(
                            "flex items-start gap-2.5 p-2 rounded-xl transition-colors text-left",
                            notif.unread
                              ? "bg-slate-50 hover:bg-slate-100/80 font-medium"
                              : "hover:bg-slate-50 opacity-70"
                          )}
                        >
                          <div
                            className={cn(
                              "size-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                              notif.unread
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            )}
                          >
                            <Sparkles className="size-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-1">
                              {notif.description}
                            </p>
                          </div>
                        </Link>
                      ))}

                      {unreadMessagesCount === 0 && forumNotifications.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-2">
                          Tidak ada pemberitahuan baru saat ini.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Navigasi Utama Menu: Profil Saya, Dashboard, Admin */}
                  <div className="p-1.5 space-y-0.5">
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
                    >
                      <User className="size-4 text-slate-400" />
                      <span>Profil Saya</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
                    >
                      <LayoutDashboard className="size-4 text-slate-400" />
                      <span>Ruang Anggota (Dashboard)</span>
                    </Link>

                    {(currentUser.role === "admin" || currentUser.role === "moderator") && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-900 hover:bg-amber-50 transition-colors"
                      >
                        <Shield className="size-4 text-amber-600" />
                        <span>Pusat Administrasi</span>
                      </Link>
                    )}
                  </div>

                  {/* Keluar / Logout */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="size-4 text-rose-500" />
                      <span>Keluar dari Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Controls: Single Unified Pill Button (Masuk / Daftar) */
            <div className="hidden sm:flex items-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <span>Masuk / Daftar</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden size-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          className={cn(
            "pointer-events-auto lg:hidden bg-white/95 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200",
            compact
              ? "mx-auto max-w-lg mt-2 rounded-2xl border border-slate-200/90 p-4"
              : "w-full border-b border-slate-200/80 px-4 py-4"
          )}
        >
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
              <div className="space-y-3">
                {/* User Header in Mobile */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || "Alumni"}
                      className="size-10 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-emerald-100 text-[#0D9488] font-bold text-sm flex items-center justify-center ring-2 ring-emerald-500/20 shrink-0">
                      {getUserInitials(currentUser.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.name || "Alumni IKAMAYOGA"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentUser.email || "alumni@mayoga.sch.id"}
                    </p>
                  </div>
                </div>

                {/* Notification Alert in Mobile if any */}
                {totalUnread > 0 && (
                  <Link
                    href="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold"
                  >
                    <span className="flex items-center gap-1.5">
                      <Bell className="size-3.5 text-rose-600" />
                      {totalUnread} notifikasi baru (pesan & forum)
                    </span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}

                {/* Mobile User Links */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Profil Saya
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold text-[#0D9488] bg-emerald-50 rounded-xl"
                  >
                    Dashboard
                  </Link>
                </div>

                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 text-xs font-bold text-amber-900 bg-amber-50 rounded-xl border border-amber-200"
                  >
                    Pusat Administrasi
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl cursor-pointer"
                >
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              /* Single Unified Button for Guest in Mobile */
              <div className="pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-xl shadow-xs transition-colors"
                >
                  <span>Masuk / Daftar Akun</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
