"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Pin,
  Lock,
  Bookmark,
  Share2,
  Check,
  MessageSquare,
  Eye,
  ArrowLeft,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { PostItem } from "@/components/forum/PostItem";
import { ReplyComposer } from "@/components/forum/ReplyComposer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="py-24 text-center text-xs text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p>Memuat percakapan topik...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="py-20 bg-slate-50/50">
        <Container size="narrow">
          <Card className="p-8 sm:p-12 text-center space-y-4 border-slate-200">
            <CardContent className="space-y-4 pt-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Topik Tidak Ditemukan
              </h1>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Topik diskusi yang Anda cari mungkin telah dipindahkan atau dihapus oleh moderator.
              </p>
              <div className="pt-2">
                <Button asChild className="rounded-full px-6 gap-2">
                  <Link href="/forum">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Forum</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
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

  const formatCreationDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-slate-50/50 min-h-screen">
      <Container size="default">
        {/* 1. Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
        >
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/forum" className="hover:text-emerald-700 transition-colors">
            Forum
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/forum?category=${topic.categorySlug}`}
            className="hover:text-emerald-700 font-medium transition-colors"
          >
            {topic.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">
            {topic.title}
          </span>
        </nav>

        {/* 2. Topic Header Title & Badges */}
        <header className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {topic.isPinned && (
              <Badge variant="amber" className="gap-1 px-2.5 py-0.5 text-[11px] font-bold">
                <Pin className="w-3 h-3 fill-amber-700" />
                <span>Disematkan</span>
              </Badge>
            )}

            {topic.isLocked && (
              <Badge
                variant="secondary"
                className="gap-1 px-2.5 py-0.5 text-[11px] font-bold border border-slate-200"
              >
                <Lock className="w-3 h-3 text-slate-600" />
                <span>Terkunci</span>
              </Badge>
            )}

            <Link href={`/forum?category=${topic.categorySlug}`}>
              <Badge
                variant="outline"
                className="gap-1.5 px-3 py-1 text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-900"
              >
                <span
                  className="w-2.5 h-2.5 rounded-xs"
                  style={{ backgroundColor: topic.categoryColor }}
                />
                <span>{topic.categoryName}</span>
              </Badge>
            </Link>

            {topic.tags.map((tag) => (
              <Link key={tag} href={`/forum?tag=${tag}`}>
                <Badge
                  variant="secondary"
                  className="text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {topic.title}
          </h1>

          {/* Quick Metrics & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/70 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Oleh <strong className="text-slate-900 font-semibold">{topic.author.name}</strong>
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatCreationDate(topic.createdAt)}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-mono text-emerald-700 font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{topic.repliesCount} Balasan</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{topic.viewsCount} Dilihat</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={topic.isBookmarked ? "secondary" : "outline"}
                size="sm"
                onClick={handleBookmark}
                className={`rounded-full gap-1.5 text-xs font-semibold h-8 transition-colors ${
                  topic.isBookmarked
                    ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                    : "border-slate-300 text-slate-700 hover:text-slate-900"
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    topic.isBookmarked ? "fill-amber-600 text-amber-600" : ""
                  }`}
                />
                <span>{topic.isBookmarked ? "Tersimpan" : "Simpan Topik"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShare}
                className={`rounded-full gap-1.5 text-xs font-semibold h-8 border-slate-300 transition-colors ${
                  copiedLink
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* 3. Post Stream (Discourse Flow: OP followed by Replies) */}
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
            <div className="relative py-4 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <Badge
                variant="outline"
                className="absolute bg-slate-50 border-slate-200 px-4 py-1 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider shadow-2xs"
              >
                <MessageSquare className="w-3 h-3 mr-1.5 text-emerald-600 inline" />
                {topic.replies.length} Tanggapan Diskusi
              </Badge>
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
