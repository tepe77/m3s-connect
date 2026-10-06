"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { FORUM_CATEGORIES, ForumAuthor, addTopic } from "@/data/forumData";

export default function NewTopicPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<ForumAuthor | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("cat-1");
  const [tagInput, setTagInput] = useState("Reuni2026, Mayoga");
  const [body, setBody] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("m3s_token");
      const userStr = localStorage.getItem("m3s_user");
      if (token && userStr) {
        setIsAuthenticated(true);
        const u = JSON.parse(userStr);
        setCurrentUser({
          id: u.id || "user-current",
          name: u.name || "Budi Santoso",
          avatar: "/images/avatar-ahmad.jpg",
          role: u.role || "alumni",
          graduationYear: 2018,
          occupation: "Alumni Terdaftar",
        });
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, []);

  const insertFormatting = (prefix: string, suffix = "") => {
    setBody((prev) => `${prev}${prefix}teks${suffix}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !currentUser) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const selectedCat = FORUM_CATEGORIES.find((c) => c.id === categoryId) || FORUM_CATEGORIES[0];
      const tags = tagInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 70) + `-${Date.now().toString().slice(-4)}`;

      const created = addTopic({
        title: title.trim(),
        slug: generatedSlug,
        categoryId: selectedCat.id,
        categorySlug: selectedCat.slug,
        categoryName: selectedCat.name,
        categoryColor: selectedCat.color,
        author: currentUser,
        body: body.trim(),
        isPinned: false,
        isLocked: false,
        tags: tags.length > 0 ? tags : ["AlumniMayoga"],
      });

      router.push(`/forum/${created.slug}`);
    } catch {
      setErrorMessage("Terjadi kesalahan saat mempublikasikan topik.");
      setSubmitting(false);
    }
  };

  // 1. Loading auth state
  if (isAuthenticated === null) {
    return (
      <div className="py-24 text-center text-xs text-[#64748B]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D9488] border-t-transparent animate-spin mx-auto mb-3" />
        <p>Memverifikasi sesi alumni...</p>
      </div>
    );
  }

  // 2. Unauthenticated guard
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="py-16 md:py-24 bg-[#F8FAFC]">
        <Container size="narrow">
          <div className="p-8 sm:p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0D9488] flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#0D9488] border border-emerald-200">
                Akses Terbatas
              </span>
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Masuk untuk Membuka Topik Baru
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Pembuatan topik diskusi baru dikhususkan bagi anggota alumni terdaftar agar kualitas informasi dan interaksi tetap terjaga.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Masuk Sekarang</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/forum"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A] bg-white border border-[#CBD5E1] rounded-full transition-colors flex items-center justify-center"
              >
                Kembali ke Forum
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 3. Discourse Topic Composer
  return (
    <div className="py-8 md:py-12 bg-[#F8FAFC]">
      <Container size="default">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#64748B]">
          <Link href="/" className="hover:text-[#0D9488] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/forum" className="hover:text-[#0D9488] transition-colors">
            Forum
          </Link>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold">Buat Topik Baru</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Mulai Topik Diskusi Baru
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Bagikan ide, informasi kegiatan reuni, peluang karir, atau diskusi seputar madrasah.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selector */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2"
                >
                  Pilih Kategori Diskusi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FORUM_CATEGORIES.map((cat) => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-slate-50 border-[#0D9488] ring-2 ring-[#0D9488]/20 shadow-xs"
                            : "bg-white border-[#E2E8F0] hover:border-slate-300"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-xs shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <div className="truncate">
                          <span className="block text-xs font-bold text-[#0F172A] truncate">
                            {cat.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="title"
                    className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider"
                  >
                    Judul Topik
                  </label>
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    {title.length}/120 karakter
                  </span>
                </div>
                <input
                  id="title"
                  type="text"
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Rencana Temu Kangen Lintas Angkatan 2026 dan Penggalangan Dana"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A] transition-all font-semibold"
                />
              </div>

              {/* Tags Input */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5"
                >
                  Tagar Topik (Pisahkan dengan koma)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Reuni2026, Karir, Mayoga"
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A] transition-all"
                />
              </div>

              {/* Discourse Formatting Toolbar + Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="body"
                    className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider"
                  >
                    Isi Pembahasan
                  </label>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                        activeTab === "write"
                          ? "bg-slate-200 text-[#0F172A]"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Tulis
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                        activeTab === "preview"
                          ? "bg-slate-200 text-[#0F172A]"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Pratinjau
                    </button>
                  </div>
                </div>

                {activeTab === "write" ? (
                  <div className="space-y-2">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <button
                        type="button"
                        onClick={() => insertFormatting("**", "**")}
                        className="px-2.5 py-1 rounded-lg font-bold hover:bg-white text-[#475569] transition-colors"
                        title="Tebal"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("*", "*")}
                        className="px-2.5 py-1 rounded-lg italic hover:bg-white text-[#475569] transition-colors"
                        title="Miring"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("### ")}
                        className="px-2.5 py-1 rounded-lg font-bold hover:bg-white text-[#475569] transition-colors"
                        title="Sub-judul"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("> ")}
                        className="px-2.5 py-1 rounded-lg hover:bg-white text-[#475569] transition-colors"
                        title="Kutipan"
                      >
                        &ldquo;&rdquo;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("- ")}
                        className="px-2.5 py-1 rounded-lg hover:bg-white text-[#475569] transition-colors"
                        title="Daftar Poin"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("`", "`")}
                        className="px-2.5 py-1 rounded-lg font-mono hover:bg-white text-[#475569] transition-colors"
                        title="Kode"
                      >
                        &lt;/&gt;
                      </button>
                    </div>

                    <textarea
                      id="body"
                      rows={9}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Jelaskan topik yang ingin Anda diskusikan secara runtut, lengkap, dan santun..."
                      required
                      className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A] transition-all resize-y min-h-[180px]"
                    />
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-slate-50 min-h-[180px] text-xs sm:text-sm text-[#334155] whitespace-pre-line leading-relaxed">
                    {body.trim() ? (
                      body
                    ) : (
                      <p className="text-[#94A3B8] italic">
                        Belum ada konten untuk ditampilkan dalam pratinjau.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <Link
                  href="/forum"
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] text-center"
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  disabled={submitting || !title.trim() || !body.trim()}
                  className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] disabled:bg-[#94A3B8] rounded-full shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? "Mempublikasikan..." : "Publikasikan Topik"}
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#0F172A]">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0D9488] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold">Tips Menulis Topik Berkualitas</h3>
              </div>

              <ul className="space-y-3 text-xs text-[#475569] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#0D9488] mt-0.5">1.</span>
                  <span>
                    <strong>Pilih Kategori Tepat:</strong> Pastikan kategori sesuai (misal peluang karir masukkan ke Karir & Profesi).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#0D9488] mt-0.5">2.</span>
                  <span>
                    <strong>Judul Deskriptif:</strong> Gunakan judul ringkas yang mencerminkan isi permasalahan atau agenda.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#0D9488] mt-0.5">3.</span>
                  <span>
                    <strong>Konteks yang Memadai:</strong> Berikan informasi latar belakang agar anggota lain dapat memberikan tanggapan relevan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#0D9488] mt-0.5">4.</span>
                  <span>
                    <strong>Jaga Kesantunan:</strong> Tetap menjunjung tinggi etika berpendapat dan nilai kekeluargaan almamater.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
