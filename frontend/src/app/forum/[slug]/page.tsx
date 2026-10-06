"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PostItem } from "@/components/forum/PostItem";
import { ReplyComposer } from "@/components/forum/ReplyComposer";
import {
  ForumTopic,
  ForumAuthor,
  getStoredTopics,
  addReply,
  toggleTopicLike,
  toggleReplyLike,
  toggleTopicBookmark,
} from "@/data/forumData";

interface ForumTopicPageProps {
  params: Promise<{ slug: string }>;
}

export default function ForumTopicPage({ params }: ForumTopicPageProps) {
  const { slug } = use(params);

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyTarget, setReplyTarget] = useState<{ author: ForumAuthor; postId: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const refreshTopic = () => {
    const all = getStoredTopics();
    const found = all.find((t) => t.slug === slug);
    if (found) {
      setTopic(found);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshTopic();
    window.addEventListener("m3s_forum_change", refreshTopic);
    return () => window.removeEventListener("m3s_forum_change", refreshTopic);
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-[#64748B]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D9488] border-t-transparent animate-spin mx-auto mb-3" />
        <p>Memuat percakapan topik...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="py-20 bg-[#F8FAFC]">
        <Container size="narrow">
          <div className="p-8 sm:p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-[#0F172A]">Topik Tidak Ditemukan</h1>
            <p className="text-xs text-[#64748B]">
              Topik diskusi yang Anda cari mungkin telah dipindahkan atau dihapus oleh moderator.
            </p>
            <div className="pt-2">
              <Link
                href="/forum"
                className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-full transition-colors shadow-xs"
              >
                &larr; Kembali ke Forum
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const handleLikeOP = () => {
    toggleTopicLike(topic.slug);
    refreshTopic();
  };

  const handleLikeReply = (replyId: string) => {
    toggleReplyLike(topic.slug, replyId);
    refreshTopic();
  };

  const handleBookmark = () => {
    toggleTopicBookmark(topic.slug);
    refreshTopic();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddReply = async (
    body: string,
    parentId?: string,
    parentAuthorName?: string
  ) => {
    try {
      const userStr = localStorage.getItem("m3s_user");
      let author: ForumAuthor = {
        id: "user-anonymous",
        name: "Alumni Terdaftar",
        avatar: "/images/avatar-ahmad.jpg",
        role: "alumni",
      };
      if (userStr) {
        const parsed = JSON.parse(userStr);
        author = {
          id: parsed.id || "user-current",
          name: parsed.name || "Alumni Terdaftar",
          avatar: "/images/avatar-ahmad.jpg",
          role: parsed.role || "alumni",
          graduationYear: 2018,
          occupation: "Alumni Terverifikasi",
        };
      }

      const res = addReply(topic.slug, {
        body,
        author,
        parentId,
        parentAuthorName,
      });

      if (res) {
        refreshTopic();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F8FAFC]">
      <Container size="default">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          <Link href="/" className="hover:text-[#0D9488] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/forum" className="hover:text-[#0D9488] transition-colors">
            Forum
          </Link>
          <span>/</span>
          <Link
            href={`/forum?category=${topic.categorySlug}`}
            className="hover:text-[#0D9488] font-medium transition-colors"
          >
            {topic.categoryName}
          </Link>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold truncate max-w-xs">
            {topic.title}
          </span>
        </nav>

        {/* 2. Topic Header Title & Badges */}
        <header className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {topic.isPinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019L11 15.323V18a1 1 0 11-2 0v-2.677l-1.333-1.342A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.789l1.599.799L9 4.323V3a1 1 0 011-1z" />
                </svg>
                <span>Disematkan</span>
              </span>
            )}

            {topic.isLocked && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <svg className="w-3 h-3 fill-none stroke-current" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Terkunci</span>
              </span>
            )}

            <Link
              href={`/forum?category=${topic.categorySlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#0F172A] bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <span
                className="w-2.5 h-2.5 rounded-xs"
                style={{ backgroundColor: topic.categoryColor }}
              />
              <span>{topic.categoryName}</span>
            </Link>

            {topic.tags.map((tag) => (
              <Link
                key={tag}
                href={`/forum?tag=${tag}`}
                className="text-xs font-medium text-[#64748B] hover:text-[#0D9488] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
            {topic.title}
          </h1>

          {/* Quick Metrics & Bookmark Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60 text-xs text-[#64748B]">
            <div className="flex items-center gap-4">
              <span>
                Diposting oleh <strong className="text-[#0F172A]">{topic.author.name}</strong>
              </span>
              <span>•</span>
              <span className="font-mono font-bold text-[#0D9488]">
                {topic.repliesCount} Balasan
              </span>
              <span>•</span>
              <span className="font-mono">{topic.viewsCount} Dilihat</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBookmark}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  topic.isBookmarked
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-white text-[#475569] border-[#CBD5E1] hover:text-[#0F172A]"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${topic.isBookmarked ? "fill-current" : "fill-none"}`}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{topic.isBookmarked ? "Tersimpan" : "Simpan Topik"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-[#475569] border border-[#CBD5E1] hover:text-[#0F172A] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>{copiedLink ? "Tersalin!" : "Bagikan"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* 3. Post Stream (Discourse Posts / Replies Flow) */}
        <div className="space-y-6 mb-10">
          {/* Post #1: The Original Post (OP) */}
          <PostItem
            id={topic.id}
            postNumber={1}
            author={topic.author}
            body={topic.body}
            createdAt={topic.createdAt}
            likesCount={topic.likesCount}
            isLiked={topic.isLiked}
            isOP={true}
            onLike={handleLikeOP}
            onReply={(author, postId) => {
              setReplyTarget({ author, postId });
              const composerEl = document.getElementById("reply-composer-area");
              if (composerEl) composerEl.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Timeline separator if replies exist */}
          {topic.replies.length > 0 && (
            <div className="relative py-2 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-[#F8FAFC] px-4 text-xs font-bold font-mono text-[#94A3B8] uppercase tracking-wider shrink-0">
                {topic.replies.length} Tanggapan Diskusi
              </span>
            </div>
          )}

          {/* Replies Stream (Post #2, Post #3, etc.) */}
          {topic.replies.map((reply, idx) => (
            <PostItem
              key={reply.id}
              id={reply.id}
              postNumber={idx + 2}
              author={reply.author}
              body={reply.body}
              createdAt={reply.createdAt}
              likesCount={reply.likesCount}
              isLiked={reply.isLiked}
              parentAuthorName={reply.parentAuthorName}
              isOP={false}
              onLike={() => handleLikeReply(reply.id)}
              onReply={(author, postId) => {
                setReplyTarget({ author, postId });
                const composerEl = document.getElementById("reply-composer-area");
                if (composerEl) composerEl.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ))}
        </div>

        {/* 4. Discourse Bottom Reply Composer */}
        <div id="reply-composer-area">
          <ReplyComposer
            isLocked={topic.isLocked}
            replyTarget={replyTarget}
            onClearTarget={() => setReplyTarget(null)}
            onSubmitReply={handleAddReply}
          />
        </div>
      </Container>
    </div>
  );
}
