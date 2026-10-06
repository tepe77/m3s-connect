"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { FORUM_CATEGORIES, ForumAuthor, addTopic } from "@/data/forumData";
import { RichContentRenderer } from "@/components/forum/RichContentRenderer";

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
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Media Tool Dialog States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Form Inputs for Modals
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const POPULAR_EMOJIS = [
    "👍", "❤️", "🎉", "🔥", "👏", "🤝", "🎓", "🚀", "💡", "😊", "🙌", "✨", "☕", "🌟", "📚", "📢"
  ];

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

  const insertEmoji = (emoji: string) => {
    setBody((prev) => `${prev} ${emoji} `);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const t = linkText.trim() || linkUrl.trim();
    setBody((prev) => `${prev} [${t}](${linkUrl.trim()}) `);
    setLinkText("");
    setLinkUrl("");
    setShowLinkModal(false);
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    const caption = imageCaption.trim() || "Gambar Topik";
    setBody((prev) => `${prev}\n\n![${caption}](${imageUrl.trim()})\n\n`);
    setImageCaption("");
    setImageUrl("");
    setShowImageModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya format file gambar yang diperbolehkan.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setImageUrl(result);
        if (!imageCaption) {
          setImageCaption(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInsertVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    setBody((prev) => `${prev}\n\n[video: ${videoUrl.trim()}]\n\n`);
    setVideoUrl("");
    setShowVideoModal(false);
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

      setSuccessBanner("Topik berhasil diterbitkan langsung ke forum!");
      setTimeout(() => {
        router.push(`/forum/${created.slug}`);
      }, 700);
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
                Bagikan ide, peluang karir, agenda reuni, atau diskusi seputar madrasah. Topik alumni langsung terbit otomatis.
              </p>
            </div>

            {successBanner && (
              <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successBanner}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selector with Image Thumbnail */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2"
                >
                  Pilih Kategori Diskusi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                          className="w-3.5 h-3.5 rounded-xs shrink-0"
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
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className={`px-3 py-1 rounded-full font-bold transition-colors ${
                        activeTab === "write"
                          ? "bg-white text-[#0F172A] shadow-2xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Tulis
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 rounded-full font-bold transition-colors ${
                        activeTab === "preview"
                          ? "bg-white text-[#0F172A] shadow-2xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Pratinjau
                    </button>
                  </div>
                </div>

                {/* Media & Formatting Toolbar */}
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

                  <span className="w-px h-4 bg-slate-200 mx-1" />

                  {/* Emoji Tool */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`px-2.5 py-1 rounded-lg hover:bg-white transition-colors flex items-center gap-1 font-semibold ${
                      showEmojiPicker ? "bg-white text-[#0D9488]" : "text-[#475569]"
                    }`}
                    title="Pilih Emoji"
                  >
                    <span>😊</span>
                    <span>Emoji</span>
                  </button>

                  {/* Link Tool */}
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(true)}
                    className="px-2.5 py-1 rounded-lg hover:bg-white text-[#475569] transition-colors flex items-center gap-1 font-semibold"
                    title="Sisipkan Tautan"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Tautan</span>
                  </button>

                  {/* Photo Tool */}
                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="px-2.5 py-1 rounded-lg hover:bg-white text-[#475569] transition-colors flex items-center gap-1 font-semibold"
                    title="Unggah / Sisipkan Foto"
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Foto</span>
                  </button>

                  {/* Video Tool */}
                  <button
                    type="button"
                    onClick={() => setShowVideoModal(true)}
                    className="px-2.5 py-1 rounded-lg hover:bg-white text-[#475569] transition-colors flex items-center gap-1 font-semibold"
                    title="Sisipkan Video YouTube atau MP4"
                  >
                    <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Video</span>
                  </button>
                </div>

                {/* Emoji Dropdown Picker */}
                {showEmojiPicker && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center gap-1.5 shadow-xs">
                    <span className="text-[11px] font-bold text-[#64748B] mr-1">Pilih Emoji:</span>
                    {POPULAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="w-8 h-8 rounded-lg hover:bg-white text-base flex items-center justify-center transition-all hover:scale-110"
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-[11px] font-bold text-[#94A3B8] hover:text-[#0F172A] ml-auto px-2"
                    >
                      Tutup
                    </button>
                  </div>
                )}

                {/* Modal: Sisipkan Tautan */}
                {showLinkModal && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#0F172A]">Sisipkan Tautan Web</h5>
                      <button
                        type="button"
                        onClick={() => setShowLinkModal(false)}
                        className="text-xs text-[#64748B] hover:text-[#0F172A]"
                      >
                        Batal
                      </button>
                    </div>
                    <form onSubmit={handleInsertLink} className="space-y-2">
                      <input
                        type="text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        placeholder="Teks tautan (contoh: Website Mayoga)"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#CBD5E1] bg-white"
                      />
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="https://contoh-link.com"
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#CBD5E1] bg-white"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#0D9488] rounded-xl hover:bg-[#0f766e]"
                        >
                          Sisipkan
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Modal: Unggah / Sisipkan Foto */}
                {showImageModal && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#0F172A]">Unggah atau Sisipkan Foto</h5>
                      <button
                        type="button"
                        onClick={() => setShowImageModal(false)}
                        className="text-xs text-[#64748B] hover:text-[#0F172A]"
                      >
                        Batal
                      </button>
                    </div>

                    <form onSubmit={handleInsertImage} className="space-y-3">
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#0D9488] bg-white text-xs font-bold text-[#0D9488] hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>Pilih Foto dari Perangkat Anda</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-[#64748B]">Atau pilih foto arsip:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl("/images/hero-man3-sleman.jpg");
                            setImageCaption("Gedung Kampus Mayoga");
                          }}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-[#0D9488]"
                        >
                          Kampus Mayoga
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl("/images/doc-wisuda.jpg");
                            setImageCaption("Wisuda Pelepasan Alumni");
                          }}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-[#0D9488]"
                        >
                          Wisuda Alumni
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={imageCaption}
                          onChange={(e) => setImageCaption(e.target.value)}
                          placeholder="Keterangan / Caption foto"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#CBD5E1] bg-white"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="URL Foto atau hasil upload"
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#CBD5E1] bg-white font-mono text-[11px]"
                          />
                          <button
                            type="submit"
                            disabled={!imageUrl.trim()}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-[#0D9488] rounded-xl hover:bg-[#0f766e] disabled:bg-slate-300"
                          >
                            Sisipkan Foto
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Modal: Sisipkan Video */}
                {showVideoModal && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#0F172A]">Sisipkan Video YouTube atau MP4</h5>
                      <button
                        type="button"
                        onClick={() => setShowVideoModal(false)}
                        className="text-xs text-[#64748B] hover:text-[#0F172A]"
                      >
                        Batal
                      </button>
                    </div>
                    <form onSubmit={handleInsertVideo} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#CBD5E1] bg-white"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#0D9488] rounded-xl hover:bg-[#0f766e]"
                        >
                          Sisipkan Video
                        </button>
                      </div>
                      <p className="text-[11px] text-[#64748B]">
                        Mendukung tautan video YouTube (youtube.com / youtu.be) atau file video (.mp4).
                      </p>
                    </form>
                  </div>
                )}

                {/* Write vs Preview Mode */}
                {activeTab === "write" ? (
                  <textarea
                    id="body"
                    rows={9}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Jelaskan topik yang ingin Anda diskusikan secara runtut, lengkap, dan santun... Gunakan tombol toolbar untuk menyisipkan emoji, foto, video, atau tautan."
                    required
                    className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A] transition-all resize-y min-h-[190px]"
                  />
                ) : (
                  <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-slate-50 min-h-[190px]">
                    {body.trim() ? (
                      <RichContentRenderer content={body} />
                    ) : (
                      <p className="text-xs text-[#94A3B8] italic">
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
                <h3 className="text-sm font-bold">Kebijakan Penerbitan Topik</h3>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-xs text-[#065F46] leading-relaxed">
                <strong>Langsung Tayang:</strong> Seluruh topik alumni terdaftar akan langsung terbit di feed komunitas tanpa masa tunggu, dengan pengawasan moderasi aktif.
              </div>

              <ul className="space-y-3 text-xs text-[#475569] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#0D9488] mt-0.5">1.</span>
                  <span>
                    <strong>Pilih Kategori Tepat:</strong> Pastikan kategori sesuai (misal lowongan masuk ke Karir & Profesi).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#0D9488] mt-0.5">2.</span>
                  <span>
                    <strong>Judul Deskriptif:</strong> Gunakan judul ringkas yang mencerminkan isi pembahasan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#0D9488] mt-0.5">3.</span>
                  <span>
                    <strong>Media Relevan:</strong> Sisipkan gambar atau video pendukung untuk memperjelas topik Anda.
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
