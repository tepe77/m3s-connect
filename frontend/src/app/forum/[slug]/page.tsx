"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  ShieldCheck,
  Award,
  Heart,
  Reply,
  ShieldAlert,
  LogIn,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { ThreadedRepliesStream } from "@/components/forum/ThreadedRepliesStream";
import { ReplyComposer } from "@/components/forum/ReplyComposer";
import { ShareModal } from "@/components/forum/ShareModal";
import { RichContentRenderer } from "@/components/forum/RichContentRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  ForumTopic,
  ForumAuthor,
  ForumReply,
  getStoredTopics,
  addReply,
  toggleTopicLike,
  toggleReplyLike,
  toggleTopicBookmark,
  incrementTopicViews,
} from "@/data/forumData";

interface ForumTopicPageProps {
  params: Promise<{ slug: string }>;
}

export default function ForumTopicPage({ params }: ForumTopicPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<ForumAuthor | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ author: ForumAuthor; postId: string } | null>(null);

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string; subtitle?: string }>({
    title: "",
    url: "",
  });

  // Bookmark notification toast
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  const viewIncrementedRef = useRef(false);

  // 1. Auth check
  useEffect(() => {
    try {
      const token = localStorage.getItem("m3s_token");
      const userStr = localStorage.getItem("m3s_user");
      if (token && userStr) {
        setIsAuthenticated(true);
        const parsed = JSON.parse(userStr);
        setCurrentUser({
          id: parsed.id || "user-current",
          name: parsed.name || "Alumni Terdaftar",
          avatar: parsed.avatar || "/images/avatar-ahmad.jpg",
          role: parsed.role || "alumni",
          graduationYear: 2018,
          occupation: "Alumni Terverifikasi",
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

  // 2. Load topic data
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

  // 3. Increment topic views once when authenticated user visits
  useEffect(() => {
    if (isAuthenticated && topic && !viewIncrementedRef.current) {
      viewIncrementedRef.current = true;
      const sessionKey = `m3s_viewed_topic_${slug}`;
      if (typeof window !== "undefined" && !sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "1");
        incrementTopicViews(slug);
        refreshTopic();
      }
    }
  }, [isAuthenticated, topic, slug]);

  // 4. Smooth scroll to hash reply if present in URL
  useEffect(() => {
    if (!loading && topic && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#reply-")) {
        const timer = setTimeout(() => {
          const targetEl = document.getElementById(hash.substring(1));
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
            targetEl.classList.add("ring-2", "ring-emerald-500", "transition-all", "duration-500");
            setTimeout(() => {
              targetEl.classList.remove("ring-2", "ring-emerald-500");
            }, 3000);
          }
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, topic]);

  // Handle Likes & Bookmarks
  const handleLikeOP = () => {
    if (!currentUser) {
      router.push(`/login?redirect=/forum/${slug}`);
      return;
    }
    if (!topic) return;
    toggleTopicLike(topic.slug);
    refreshTopic();
  };

  const handleLikeReply = (replyId: string) => {
    if (!currentUser) {
      router.push(`/login?redirect=/forum/${slug}`);
      return;
    }
    if (!topic) return;
    toggleReplyLike(topic.slug, replyId);
    refreshTopic();
  };

  const handleBookmark = () => {
    if (!currentUser) {
      router.push(`/login?redirect=/forum/${slug}`);
      return;
    }
    if (!topic) return;
    const isNowBookmarked = toggleTopicBookmark(topic.slug);
    refreshTopic();
    setBookmarkToast(
      isNowBookmarked
        ? "Topik berhasil disimpan ke daftar penanda Anda."
        : "Topik dihapus dari daftar penanda."
    );
    setTimeout(() => setBookmarkToast(null), 3000);
  };

  // Handle Share triggers
  const handleOpenShare = (title: string, url: string, subtitle?: string) => {
    setShareData({ title, url, subtitle });
    setIsShareModalOpen(true);
  };

  const handleShareOP = () => {
    if (!topic || typeof window === "undefined") return;
    handleOpenShare(
      topic.title,
      window.location.href,
      `Topik diskusi di kategori ${topic.categoryName} oleh ${topic.author.name}`
    );
  };

  const handleShareReply = (reply: ForumReply) => {
    if (!topic || typeof window === "undefined") return;
    const replyUrl = `${window.location.origin}/forum/${topic.slug}#reply-${reply.id}`;
    handleOpenShare(
      `Balasan dari ${reply.author.name} pada "${topic.title}"`,
      replyUrl,
      `Tanggapan diskusi oleh ${reply.author.name}`
    );
  };

  const handleAddReply = async (
    body: string,
    parentId?: string,
    parentAuthorName?: string
  ): Promise<boolean> => {
    if (!topic || !currentUser) return false;
    try {
      const res = addReply(topic.slug, {
        body,
        author: currentUser,
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

  // State: Loading
  if (loading || isAuthenticated === null) {
    return (
      <div className="py-24 text-center text-xs text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p>Memuat percakapan topik diskusi...</p>
      </div>
    );
  }

  // State: Topic not found
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

  const realRepliesCount = topic.replies ? topic.replies.length : topic.repliesCount;

  return (
    <div className="py-6 sm:py-10 bg-slate-50/50 min-h-screen">
      <Container size="default">
        {/* Toast Notification Banner */}
        {bookmarkToast && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between shadow-2xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>{bookmarkToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setBookmarkToast(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

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

            <Badge
              variant="outline"
              className="gap-1 px-2.5 py-0.5 text-[11px] font-bold border-emerald-200 bg-emerald-50 text-emerald-800"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Khusus Member Alumni</span>
            </Badge>

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
                <span>{realRepliesCount} Balasan</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{topic.viewsCount} Dilihat</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Like Topic Button */}
              <Button
                type="button"
                variant={topic.isLiked ? "secondary" : "outline"}
                size="sm"
                onClick={handleLikeOP}
                className={`rounded-full gap-1.5 text-xs font-semibold h-8 transition-colors ${
                  topic.isLiked
                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    : "border-slate-300 text-slate-700 hover:text-slate-900"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    topic.isLiked ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
                <span>{topic.likesCount} Suka</span>
              </Button>

              {/* Simpan Topik Button */}
              <Button
                type="button"
                variant={topic.isBookmarked ? "secondary" : "outline"}
                size="sm"
                onClick={handleBookmark}
                className={`rounded-full gap-1.5 text-xs font-semibold h-8 transition-colors ${
                  topic.isBookmarked
                    ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 font-bold"
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

              {/* Fungsi Bagikan Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShareOP}
                className="rounded-full gap-1.5 text-xs font-semibold h-8 border-slate-300 text-slate-700 hover:text-slate-900 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan</span>
              </Button>
            </div>
          </div>
        </header>

        {/* 3. Original Post & Threaded Replies Area */}
        {!isAuthenticated ? (
          <div className="relative my-6 rounded-3xl overflow-hidden border border-slate-200/90 bg-white/50 shadow-xs">
            {/* Blurred Background Preview of Real Topic & Replies */}
            <div
              className="filter blur-md select-none pointer-events-none opacity-40 max-h-[560px] overflow-hidden p-2 space-y-6"
              aria-hidden="true"
            >
              <Card className="bg-white border-slate-200/90 rounded-3xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-emerald-100 shrink-0">
                      <Image
                        src={topic.author.avatar || "/images/avatar-ahmad.jpg"}
                        alt={topic.author.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {topic.author.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {topic.author.occupation || "Alumni Terdaftar"} • {formatCreationDate(topic.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 text-sm text-slate-800 leading-relaxed">
                    <RichContentRenderer content={topic.body} />
                  </div>
                </CardContent>
              </Card>

              {/* Blurred Threaded Replies Preview */}
              <ThreadedRepliesStream
                replies={topic.replies || []}
                currentUserId={null}
                onLikeReply={() => {}}
                onShareReply={() => {}}
                onSubmitReply={async () => false}
              />
            </div>

            {/* Floating Glassmorphism Login Wall Modal */}
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-gradient-to-t from-slate-900/10 via-white/80 to-transparent backdrop-blur-[2px]">
              <div className="w-full max-w-lg p-6 sm:p-8 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-2xs">
                  <ShieldAlert className="w-7 h-7" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-0.5">
                    Akses Komunitas Tertutup
                  </Badge>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Masuk untuk Membaca Diskusi Lengkap
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Topik diskusi <span className="font-semibold text-slate-800">&ldquo;{topic.title}&rdquo;</span> dan{" "}
                    <span className="font-bold text-emerald-700">{realRepliesCount} tanggapan diskusi</span> di dalamnya bersifat privat khusus bagi anggota alumni MAN 3 Sleman (Mayoga).
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-7 gap-2 shadow-xs">
                    <Link href={`/login?redirect=/forum/${slug}`}>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk ke Akun Alumni</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-6 gap-2">
                    <Link href={`/register?redirect=/forum/${slug}`}>
                      <span>Daftar Akun Baru</span>
                    </Link>
                  </Button>
                </div>

                <div className="pt-1">
                  <Link
                    href="/forum"
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Beranda Forum</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 3. Original Post (Topic A) */}
            <div className="space-y-6 mb-10">
              <Card className="bg-white border-slate-200/90 shadow-xs ring-1 ring-emerald-500/10 rounded-3xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-emerald-100 shrink-0">
                        <Image
                          src={topic.author.avatar || "/images/avatar-ahmad.jpg"}
                          alt={topic.author.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                            {topic.author.name}
                          </h3>
                          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0">
                            Penulis Topik
                          </Badge>
                          {topic.author.graduationYear && (
                            <Badge variant="emerald" className="text-[10px] font-bold px-2 py-0">
                              Alumni &apos;{topic.author.graduationYear.toString().slice(-2)}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span>{topic.author.occupation || "Alumni Terdaftar"}</span>
                          <span>•</span>
                          <time dateTime={topic.createdAt}>{formatCreationDate(topic.createdAt)}</time>
                        </div>
                      </div>
                    </div>

                    <Badge variant="outline" className="font-mono text-xs text-slate-400 border-slate-200 bg-slate-50 px-2.5 py-0.5">
                      #1 OP
                    </Badge>
                  </div>

                  {/* Body */}
                  <div className="pt-2 text-sm sm:text-base text-slate-800 leading-relaxed">
                    <RichContentRenderer content={topic.body} />
                  </div>

                  {/* OP Footer Interaction */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={topic.isLiked ? "secondary" : "ghost"}
                        size="sm"
                        onClick={handleLikeOP}
                        className={`rounded-full h-8 px-3 text-xs font-semibold gap-1.5 ${
                          topic.isLiked
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "text-slate-600 hover:text-rose-600 hover:bg-rose-50/50"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${topic.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>{topic.likesCount} Suka</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyTarget({ author: topic.author, postId: topic.id });
                          const el = document.getElementById("reply-composer-area");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="rounded-full h-8 px-3 text-xs font-semibold gap-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Balas Topik</span>
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleShareOP}
                      className="rounded-full h-8 px-3 text-xs text-slate-500 hover:text-slate-800 gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline separator for replies */}
              <div className="relative py-4 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <Badge
                  variant="outline"
                  className="absolute bg-slate-50 border-slate-200 px-4 py-1 text-xs font-mono font-bold text-slate-600 uppercase tracking-wider shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-emerald-600 inline" />
                  {realRepliesCount} Tanggapan Pada Diskusi Ini
                </Badge>
              </div>

              {/* 4. YouTube-Style Threaded Replies Hierarchy with Connector Lines */}
              <ThreadedRepliesStream
                replies={topic.replies || []}
                currentUserId={currentUser?.id}
                onLikeReply={handleLikeReply}
                onShareReply={handleShareReply}
                onSubmitReply={handleAddReply}
              />
            </div>

            {/* 5. Bottom Discourse/YouTube Reply Composer */}
            <div id="reply-composer-area" className="pt-4">
              <ReplyComposer
                isLocked={topic.isLocked}
                replyTarget={replyTarget}
                onClearTarget={() => setReplyTarget(null)}
                onSubmitReply={handleAddReply}
              />
            </div>
          </>
        )}

        {/* 6. Universal Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title={shareData.title}
          url={shareData.url}
          subtitle={shareData.subtitle}
        />
      </Container>
    </div>
  );
}
