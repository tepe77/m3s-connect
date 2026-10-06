"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ForumAuthor } from "@/data/forumData";
import { RichContentRenderer } from "./RichContentRenderer";

interface ReplyComposerProps {
  isLocked: boolean;
  replyTarget?: { author: ForumAuthor; postId: string } | null;
  onClearTarget?: () => void;
  onSubmitReply: (body: string, parentId?: string, parentAuthorName?: string) => Promise<boolean>;
}

export function ReplyComposer({
  isLocked,
  replyTarget,
  onClearTarget,
  onSubmitReply,
}: ReplyComposerProps) {
  const [currentUser, setCurrentUser] = useState<ForumAuthor | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeMode, setActiveMode] = useState<"write" | "preview">("write");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    "👍", "❤️", "🎉", "🔥", "👏", "🤝", "🎓", "🚀", "💡", "😊", "🙌", "✨", "☕", "🌟", "📚"
  ];

  useEffect(() => {
    try {
      const token = localStorage.getItem("m3s_token");
      const userStr = localStorage.getItem("m3s_user");
      if (token && userStr) {
        const u = JSON.parse(userStr);
        setCurrentUser({
          id: u.id || "user-current",
          name: u.name || "Alumni Terdaftar",
          avatar: "/images/avatar-ahmad.jpg",
          role: u.role || "alumni",
          graduationYear: 2018,
          occupation: "Alumni Terverifikasi",
        });
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const success = await onSubmitReply(
        replyText.trim(),
        replyTarget?.postId,
        replyTarget?.author.name
      );

      if (success) {
        setReplyText("");
        setActiveMode("write");
        if (onClearTarget) onClearTarget();
      } else {
        setErrorMessage("Gagal mengirimkan balasan. Silakan coba sesaat lagi.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi server.");
    } finally {
      setSubmitting(false);
    }
  };

  const insertFormatting = (prefix: string, suffix = "") => {
    setReplyText((prev) => `${prev}${prefix}teks${suffix}`);
  };

  const insertEmoji = (emoji: string) => {
    setReplyText((prev) => `${prev} ${emoji} `);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const title = linkText.trim() || linkUrl.trim();
    setReplyText((prev) => `${prev} [${title}](${linkUrl.trim()}) `);
    setLinkText("");
    setLinkUrl("");
    setShowLinkModal(false);
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    const caption = imageCaption.trim() || "Gambar Dokumentasi";
    setReplyText((prev) => `${prev}\n\n![${caption}](${imageUrl.trim()})\n\n`);
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
    setReplyText((prev) => `${prev}\n\n[video: ${videoUrl.trim()}]\n\n`);
    setVideoUrl("");
    setShowVideoModal(false);
  };

  // Case 1: Topic is locked
  if (isLocked) {
    return (
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-[#0F172A]">Topik Ini Telah Dikunci</h4>
        <p className="text-xs text-[#64748B]">
          Moderator telah mengunci topik ini. Balasan baru tidak lagi diterima untuk menjaga arsip diskusi.
        </p>
      </div>
    );
  }

  // Case 2: User is not authenticated
  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white text-[#0D9488] shadow-2xs border border-emerald-100 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-[#0F172A]">
            Bergabung dalam Percakapan
          </h4>
          <p className="text-xs text-[#065F46] max-w-md mx-auto leading-relaxed">
            Hanya anggota alumni terdaftar yang dapat membalas dan mengirimkan opini di forum ini. Masuk dengan akun Anda untuk berkontribusi.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center min-h-[42px] px-6 py-2 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full shadow-xs transition-colors gap-1.5"
          >
            <span>Masuk untuk Menulis Balasan</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    );
  }

  // Case 3: Authenticated user ready to compose
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
      {/* Current author bar & Reply target badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-emerald-50">
            <Image
              src={currentUser.avatar}
              alt={currentUser.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0F172A] block leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-[#0D9488] font-medium">
              Menulis Balasan Baru
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {replyTarget && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-[#334155] border border-slate-200">
              <span>Membalas @{replyTarget.author.name}</span>
              <button
                type="button"
                onClick={onClearTarget}
                title="Batal membalas kutipan spesifik"
                className="text-[#94A3B8] hover:text-[#0F172A]"
              >
                &times;
              </button>
            </div>
          )}

          {/* Toggle Write / Live Preview */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full text-xs">
            <button
              type="button"
              onClick={() => setActiveMode("write")}
              className={`px-3 py-1 rounded-full font-bold transition-colors ${
                activeMode === "write"
                  ? "bg-white text-[#0F172A] shadow-2xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Tulis
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("preview")}
              className={`px-3 py-1 rounded-full font-bold transition-colors ${
                activeMode === "preview"
                  ? "bg-white text-[#0F172A] shadow-2xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Pratinjau
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
          {errorMessage}
        </div>
      )}

      {/* Media & Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        {/* Markdown Tools */}
        <button
          type="button"
          onClick={() => insertFormatting("**", "**")}
          className="px-2.5 py-1 rounded-lg font-bold hover:bg-white text-[#475569] transition-colors"
          title="Tebal (Bold)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("*", "*")}
          className="px-2.5 py-1 rounded-lg italic hover:bg-white text-[#475569] transition-colors"
          title="Miring (Italic)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("> ")}
          className="px-2.5 py-1 rounded-lg hover:bg-white text-[#475569] transition-colors"
          title="Kutipan (Quote)"
        >
          &ldquo;&rdquo;
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("`", "`")}
          className="px-2.5 py-1 rounded-lg font-mono hover:bg-white text-[#475569] transition-colors"
          title="Kode (Inline Code)"
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

        {/* Photo Upload Tool */}
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="px-2.5 py-1 rounded-lg hover:bg-white text-[#475569] transition-colors flex items-center gap-1 font-semibold"
          title="Unggah atau Sisipkan Foto"
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

      {/* Emoji Picker Dropdown Bar */}
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
              placeholder="Teks tautan (opsional, contoh: Web Resmi Madrasah)"
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
            {/* Local Upload */}
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

            {/* Preset Samples */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[#64748B]">Atau pilih dokumentasi:</span>
              <button
                type="button"
                onClick={() => {
                  setImageUrl("/images/hero-man3-sleman.jpg");
                  setImageCaption("Gedung Kampus MAN 3 Sleman");
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-[#0D9488]"
              >
                Kampus Mayoga
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl("/images/doc-wisuda.jpg");
                  setImageCaption("Pelepasan Alumni");
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-[#0D9488]"
              >
                Wisuda Alumni
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl("/images/doc-baksos.jpg");
                  setImageCaption("Bakti Sosial Ramadhan");
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-[#0D9488]"
              >
                Bakti Sosial
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
              Mendukung link YouTube (youtube.com / youtu.be) atau file video (.mp4).
            </p>
          </form>
        </div>
      )}

      {/* Reply Area: Write Mode vs Live Preview Mode */}
      {activeMode === "write" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ketik tanggapan Anda di sini... Gunakan tombol di atas untuk menyisipkan emoji, link, foto, atau video."
              required
              className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A] transition-all resize-y min-h-[130px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#94A3B8]">
              Mendukung pemformatan Markdown, foto, video, dan emoji.
            </p>

            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="inline-flex items-center justify-center min-h-[42px] px-6 py-2 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] disabled:bg-[#94A3B8] rounded-full shadow-xs transition-colors"
            >
              {submitting ? "Mengirimkan..." : "Kirim Balasan"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 min-h-[130px]">
            {replyText.trim() ? (
              <RichContentRenderer content={replyText} />
            ) : (
              <p className="text-xs text-[#94A3B8] italic">
                Belum ada teks untuk ditampilkan dalam pratinjau.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveMode("write")}
              className="text-xs font-bold text-[#0D9488] hover:underline"
            >
              &larr; Kembali Mengedit Teks
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !replyText.trim()}
              className="inline-flex items-center justify-center min-h-[42px] px-6 py-2 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] disabled:bg-[#94A3B8] rounded-full shadow-xs transition-colors"
            >
              {submitting ? "Mengirimkan..." : "Kirim Balasan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
