"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ForumAuthor } from "@/data/forumData";

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
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
          {errorMessage}
        </div>
      )}

      {/* Fast Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl text-xs">
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
        <button
          type="button"
          onClick={() => insertFormatting("- ")}
          className="px-2.5 py-1 rounded-lg hover:bg-white text-[#475569] transition-colors"
          title="Daftar Poin (List)"
        >
          • List
        </button>
      </div>

      {/* Reply Textarea */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Ketik tanggapan Anda di sini... Gunakan bahasa yang sopan dan santun."
            required
            className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A] transition-all resize-y min-h-[120px]"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-[#94A3B8]">
            Mendukung pemformatan Markdown dasar.
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
    </div>
  );
}
