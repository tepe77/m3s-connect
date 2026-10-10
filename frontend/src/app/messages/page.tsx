"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import {
  DirectMessageThread,
  getStoredThreads,
  replyDirectMessage,
  markThreadAsRead,
  syncThreadsWithBackend,
} from "@/data/messageData";

function MessagesInboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedThreadId = searchParams.get("thread") || searchParams.get("id");

  const [threads, setThreads] = useState<DirectMessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(requestedThreadId);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("user-budi");
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const all = getStoredThreads();
    setThreads(all);

    // If a specific thread was requested via URL, prioritize it
    const targetId = requestedThreadId || activeThreadId;
    if (targetId && all.some((t) => t.id === targetId)) {
      setActiveThreadId(targetId);
      markThreadAsRead(targetId);
    } else if (!activeThreadId && all.length > 0) {
      setActiveThreadId(all[0].id);
      markThreadAsRead(all[0].id);
    }
  };

  useEffect(() => {
    try {
      const u = localStorage.getItem("m3s_user");
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.id) setCurrentUserId(parsed.id);
      }
    } catch {
      // Graceful fallback
    }

    loadData();
    syncThreadsWithBackend();
    setLoading(false);

    window.addEventListener("m3s_messages_change", loadData);
    return () => window.removeEventListener("m3s_messages_change", loadData);
  }, [requestedThreadId]);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  // Counterpart for the active thread
  const getCounterpart = (thread: DirectMessageThread) => {
    if (thread.participant1.id === currentUserId) {
      return thread.participant2;
    }
    return thread.participant1;
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    markThreadAsRead(threadId);
    try {
      router.replace(`/messages?thread=${threadId}`, { scroll: false });
    } catch {
      // Fallback
    }
    loadData();
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    replyDirectMessage(activeThreadId, replyText.trim());
    setReplyText("");
    loadData();
  };

  const filteredThreads = threads.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const counterpart = getCounterpart(t);
    return (
      counterpart.name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q)
    );
  });

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const now = new Date();
      const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-[#64748B]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D9488] border-t-transparent animate-spin mx-auto mb-3" />
        <p>Memuat kotak masuk pesan...</p>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-[#F8FAFC] min-h-[85vh]">
      <Container size="wide">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link href="/" className="hover:text-[#0D9488] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-[#0D9488] transition-colors">
              Ruang Anggota
            </Link>
            <span>/</span>
            <span className="text-[#0F172A] font-semibold">Pesan Privat (Direct Messages)</span>
          </nav>

          <Link
            href="/alumni"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#CBD5E1] text-[#0F172A] hover:border-[#0D9488] hover:text-[#0D9488] text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>+ Tulis Pesan Baru via Direktori</span>
          </Link>
        </div>

        {/* 2-Column Direct Message Layout */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
          {/* Left Column: Thread List (5 Cols) */}
          <div className="md:col-span-5 border-r border-[#E2E8F0] flex flex-col bg-slate-50/40">
            {/* Header & Search */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-[#0F172A]">Kotak Masuk Pesan</h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#0D9488] text-xs font-bold border border-emerald-200">
                    {threads.length} Percakapan
                  </span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pesan atau nama alumni..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] text-[#0F172A]"
                />
                <svg
                  className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Threads List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B] space-y-2">
                  <p>Tidak ada percakapan ditemukan.</p>
                  <Link href="/alumni" className="text-[#0D9488] font-bold hover:underline block">
                    Cari Alumni di Direktori &rarr;
                  </Link>
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const counterpart = getCounterpart(thread);
                  const isSelected = thread.id === activeThreadId;

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => handleSelectThread(thread.id)}
                      className={`w-full p-4 text-left transition-colors flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-emerald-50/70 border-l-4 border-l-[#0D9488]"
                          : "hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                        <Image
                          src={counterpart.avatar || "/images/avatar-ahmad.jpg"}
                          alt={counterpart.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#0F172A] truncate">
                            {counterpart.name}
                          </h4>
                          <span className="text-[10px] text-[#94A3B8] shrink-0 font-medium">
                            {formatTime(thread.lastActivityAt)}
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-[#0D9488] truncate">
                          {thread.subject}
                        </p>

                        <p className="text-[11px] text-[#64748B] truncate">
                          {thread.lastMessage}
                        </p>
                      </div>

                      {thread.unreadCount > 0 && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 self-center" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation (7 Cols) */}
          <div className="md:col-span-7 flex flex-col bg-white">
            {activeThread ? (
              <>
                {/* Active Conversation Header */}
                {(() => {
                  const counterpart = getCounterpart(activeThread);
                  return (
                    <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                          <Image
                            src={counterpart.avatar || "/images/avatar-ahmad.jpg"}
                            alt={counterpart.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#0F172A] truncate">
                              {counterpart.name}
                            </h3>
                            {counterpart.graduationYear && (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#64748B] text-[10px] font-semibold">
                                Angkatan {counterpart.graduationYear}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#64748B] truncate">
                            {counterpart.occupation || "Alumni MAN 3 Sleman"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/alumni/${counterpart.id}`}
                          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold transition-colors"
                        >
                          Lihat Profil
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Subject Banner */}
                <div className="px-5 py-2.5 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#475569]">
                    <span className="font-semibold text-[#0F172A]">Perihal:</span>
                    <span className="font-bold text-[#0D9488]">{activeThread.subject}</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">
                    {activeThread.messages.length} pesan
                  </span>
                </div>

                {/* Message Stream */}
                <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[460px]">
                  {activeThread.messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${
                          isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 mt-1">
                          <Image
                            src={msg.senderAvatar || "/images/avatar-ahmad.jpg"}
                            alt={msg.senderName}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="space-y-1">
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? "bg-[#0D9488] text-white rounded-tr-xs"
                                : "bg-slate-100 text-[#0F172A] border border-slate-200/80 rounded-tl-xs"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.body}</p>
                          </div>

                          <div
                            className={`text-[10px] text-[#94A3B8] px-1 ${
                              isMe ? "text-right" : "text-left"
                            }`}
                          >
                            <span>{msg.senderName.split(",")[0]} • </span>
                            <span>{formatTime(msg.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Composer Bar - Strictly Inline Layout */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 sm:p-4 border-t border-[#E2E8F0] bg-white"
                >
                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-1.5 pl-3.5 focus-within:border-[#0D9488] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0D9488]/20 transition-all">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Ketik balasan pesan Anda di sini..."
                      className="w-full py-2 bg-transparent text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                    />

                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="inline-flex items-center justify-center h-9 px-4 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors gap-1.5 shrink-0"
                    >
                      <span>Kirim</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-[#64748B]">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                  ✉️
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">Belum Ada Percakapan Dipilih</h3>
                <p className="text-xs max-w-xs">
                  Pilih salah satu percakapan di sebelah kiri atau kirim pesan baru melalui direktori alumni.
                </p>
                <Link
                  href="/alumni"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#0D9488] rounded-full shadow-xs hover:bg-[#0f766e] transition-colors"
                >
                  Jelajahi Direktori Alumni
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function MessagesInboxPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-[#64748B]">
          <div className="w-8 h-8 rounded-full border-2 border-[#0D9488] border-t-transparent animate-spin mx-auto mb-3" />
          <p>Memuat kotak masuk pesan...</p>
        </div>
      }
    >
      <MessagesInboxContent />
    </Suspense>
  );
}
