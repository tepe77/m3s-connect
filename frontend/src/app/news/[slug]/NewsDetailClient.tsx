"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { NEWS_ITEMS, NewsItem, NewsComment } from "@/data/newsData";

interface NewsDetailClientProps {
  initialNews: NewsItem;
}

export function NewsDetailClient({ initialNews }: NewsDetailClientProps) {
  const [news, setNews] = useState<NewsItem>(initialNews);
  const [comments, setComments] = useState<NewsComment[]>(initialNews.comments);

  // Form State
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorUrl, setAuthorUrl] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Social share URL with hydration-safe initial state
  const [shareUrl, setShareUrl] = useState(`https://m3s-connect.id/news/${news.slug}`);

  // Fetch real-time live comments from backend API
  const fetchLiveComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/news/${initialNews.slug}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const apiData = json?.data;
        if (apiData?.comments && Array.isArray(apiData.comments)) {
          const liveComments: NewsComment[] = apiData.comments.map((c: any) => {
            const d = new Date(c.created_at);
            const formattedDate = !isNaN(d.getTime())
              ? `${d.getDate()} ${d.toLocaleString("id-ID", { month: "long" })} ${d.getFullYear()} pukul ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
              : c.created_at;

            return {
              id: c.id,
              authorName: c.author_name,
              authorEmail: c.author_email,
              authorUrl: c.author_url || undefined,
              avatarUrl: "/images/avatar-ahmad.jpg",
              createdAt: formattedDate,
              content: c.content,
              isVerifiedAlumni: Boolean(c.user_id),
            };
          });
          setComments(liveComments);
        }
      }
    } catch {
      // Backend not accessible, keep current state
    }
  };

  // Load saved commenter info from localStorage and set client URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }

    try {
      const savedName = localStorage.getItem("m3s_comment_name");
      const savedEmail = localStorage.getItem("m3s_comment_email");
      const savedUrl = localStorage.getItem("m3s_comment_url");
      if (savedName) setAuthorName(savedName);
      if (savedEmail) setAuthorEmail(savedEmail);
      if (savedUrl) setAuthorUrl(savedUrl);
      if (savedName || savedEmail) setSaveInfo(true);
    } catch {
      // LocalStorage error handled gracefully
    }

    fetchLiveComments();
  }, [initialNews.slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const shareTitle = encodeURIComponent(news.title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim() || !authorEmail.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/news/${news.slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          author_name: authorName.trim(),
          author_email: authorEmail.trim(),
          author_url: authorUrl.trim() || undefined,
          content: commentText.trim(),
        }),
      });

      if (res.ok) {
        await fetchLiveComments();
      }
    } catch {
      // Backend request fails silently in offline/static environments
    }

    if (saveInfo) {
      localStorage.setItem("m3s_comment_name", authorName.trim());
      localStorage.setItem("m3s_comment_email", authorEmail.trim());
      if (authorUrl.trim()) {
        localStorage.setItem("m3s_comment_url", authorUrl.trim());
      }
    } else {
      localStorage.removeItem("m3s_comment_name");
      localStorage.removeItem("m3s_comment_email");
      localStorage.removeItem("m3s_comment_url");
    }

    setCommentText("");
    setIsSubmitting(false);
    setSuccessMessage("Komentar Anda berhasil dikirimkan!");
    setTimeout(() => setSuccessMessage(""), 6000);
  };

  return (
    <article className="py-8 md:py-12 bg-[#F8FAFC]">
      <Container size="default">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          <Link href="/" className="hover:text-[#0D9488] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/news" className="hover:text-[#0D9488] transition-colors">
            Berita
          </Link>
          <span>/</span>
          <span className="text-[#0D9488] font-medium">{news.category.name}</span>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold truncate max-w-[200px] sm:max-w-xs">
            {news.title}
          </span>
        </nav>

        {/* 2. Header Categories & Sub Categories */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <Link
            href={`/news?category=${news.category.slug}`}
            className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
          >
            {news.category.name}
          </Link>
          <span className="text-[#94A3B8]">•</span>
          <Link
            href={`/news?subCategory=${news.subCategory.slug}`}
            className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-[#475569] hover:bg-slate-200 transition-colors"
          >
            Sub: {news.subCategory.name}
          </Link>
        </div>

        {/* 3. Main Title & Meta */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0] mb-8 text-xs sm:text-sm text-[#64748B]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-white shadow-xs">
              <Image
                src={news.author.avatar}
                alt={news.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-semibold text-[#0F172A]">{news.author.name}</div>
              <div className="text-xs text-[#64748B]">{news.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {news.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {news.readTime}
            </span>
          </div>
        </div>

        {/* 4. Social Media Sharing Buttons (Top) */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
            Bagikan Berita Ini:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg transition-colors"
              title="Bagikan ke WhatsApp"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.346.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.087-.179.182-.077.357.101.174.45 0.742.967 1.203.666.593 1.228.777 1.402.864.173.086.275.072.376-.044.101-.116.433-.505.549-.679.116-.173.231-.144.39-.087s1.011.477 1.184.563c.173.087.289.13.332.203.043.072.043.419-.101.824z" />
              </svg>
              WhatsApp
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-slate-800 rounded-lg transition-colors"
              title="Bagikan ke X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#166fe5] rounded-lg transition-colors"
              title="Bagikan ke Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0A66C2] hover:bg-[#095196] rounded-lg transition-colors"
              title="Bagikan ke LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </a>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors relative"
              title="Salin tautan ke clipboard"
            >
              <svg className="w-3.5 h-3.5 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copiedLink ? "Tersalin!" : "Salin Link"}
            </button>
          </div>
        </div>

        {/* 5. Featured Thumbnail Image Banner */}
        <figure className="mb-8 rounded-2xl overflow-hidden bg-slate-100 border border-[#E2E8F0] shadow-sm">
          <div className="relative aspect-16/9 w-full">
            <Image
              src={news.thumbnail}
              alt={news.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          <figcaption className="p-3 text-xs text-[#64748B] italic bg-slate-50 border-t border-[#E2E8F0]">
            Gambar Sampul: {news.title}
          </figcaption>
        </figure>

        {/* 6. Lead Excerpt */}
        <div className="text-lg text-[#334155] leading-relaxed font-medium mb-8 p-5 bg-white rounded-xl border-l-4 border-[#0D9488] shadow-xs">
          {news.excerpt}
        </div>

        {/* 7. Article Body Content with Embedded Content Images (WordPress style) */}
        <div className="space-y-6 text-[#1E293B] text-base leading-relaxed mb-10">
          <p>{news.contentHtml[0]}</p>

          {news.contentHtml[1] && <p>{news.contentHtml[1]}</p>}

          {/* Embedded Content Image 1 */}
          {news.contentImages[0] && (
            <figure className="my-8 rounded-xl overflow-hidden bg-white border border-[#E2E8F0] shadow-xs">
              <div className="relative aspect-16/10 w-full max-h-[420px]">
                <Image
                  src={news.contentImages[0].url}
                  alt={news.contentImages[0].alt}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="p-3 text-xs sm:text-sm text-[#475569] bg-slate-50 border-t border-[#E2E8F0]">
                {news.contentImages[0].caption}
              </figcaption>
            </figure>
          )}

          {news.contentHtml[2] && <p>{news.contentHtml[2]}</p>}

          {/* Highlight Quote Box */}
          <blockquote className="my-6 p-6 rounded-xl bg-emerald-50/60 border-l-4 border-[#0D9488] text-[#064E3B] font-medium italic text-lg">
            &ldquo;Satu Alumni, Seribu Cerita, Satu Tujuan. Kehadiran setiap angkatan menjadi energi utama kemajuan madrasah ke depan.&rdquo;
          </blockquote>

          {news.contentHtml[3] && <p>{news.contentHtml[3]}</p>}

          {/* Embedded Content Image 2 */}
          {news.contentImages[1] && (
            <figure className="my-8 rounded-xl overflow-hidden bg-white border border-[#E2E8F0] shadow-xs">
              <div className="relative aspect-16/10 w-full max-h-[420px]">
                <Image
                  src={news.contentImages[1].url}
                  alt={news.contentImages[1].alt}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="p-3 text-xs sm:text-sm text-[#475569] bg-slate-50 border-t border-[#E2E8F0]">
                {news.contentImages[1].caption}
              </figcaption>
            </figure>
          )}

          {news.contentHtml[4] && <p>{news.contentHtml[4]}</p>}
        </div>

        {/* 8. WordPress-style Tags Cloud */}
        <div className="py-6 border-y border-[#E2E8F0] mb-8">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-[#0D9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Tags Artikel:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {news.tags.map((tag) => (
              <Link
                key={tag}
                href={`/news?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-[#0D9488] text-[#334155] border border-slate-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* 9. Author Bio Card (WordPress style) */}
        <div className="p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500 shadow-sm">
            <Image
              src={news.author.avatar}
              alt={news.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
              Tentang Penulis
            </span>
            <h3 className="text-lg font-bold text-[#0F172A]">{news.author.name}</h3>
            <p className="text-xs text-[#64748B] font-medium">{news.author.role}</p>
            <p className="text-sm text-[#475569] leading-relaxed pt-1">
              Mengelola publikasi kabar resmi, liputan agenda madrasah, serta dokumentasi prestasi alumni MAN 3 Sleman untuk mempererat ukhuwah civitas akademika.
            </p>
          </div>
        </div>

        {/* 10. Comments Section (WordPress Style) */}
        <section id="comments" className="space-y-10">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
              <span>Tanggapan & Komentar</span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-[#0D9488]">
                {comments.length}
              </span>
            </h2>
          </div>

          {/* List of Comments */}
          {comments.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-dashed border-[#CBD5E1] text-[#64748B] text-sm">
              Belum ada komentar untuk berita ini. Jadilah yang pertama memberikan tanggapan!
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-5 sm:p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#0D9488] font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A]">
                            {comment.authorName}
                          </span>
                          {comment.isVerifiedAlumni && (
                            <span className="inline-flex items-center px-2 py-0.2 text-[10px] font-semibold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
                              Alumni Terverifikasi
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#94A3B8]">{comment.createdAt}</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-line pl-1 sm:pl-13">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* WordPress-style Comment Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div className="mb-6 space-y-1">
              <h3 className="text-xl font-bold text-[#0F172A]">Tinggalkan Balasan</h3>
              <p className="text-xs text-[#64748B]">
                Alamat email Anda tidak akan dipublikasikan. Ruas yang wajib ditandai <span className="text-rose-500 font-bold">*</span>
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitComment} className="space-y-5">
              <div>
                <label htmlFor="commentText" className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                  Komentar <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="commentText"
                  rows={4}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Tuliskan apresiasi, pertanyaan, atau tanggapan Anda di sini..."
                  className="w-full px-4 py-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent text-sm text-[#0F172A] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="authorName" className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                    Nama <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent text-sm text-[#0F172A] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="authorEmail" className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="authorEmail"
                    required
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent text-sm text-[#0F172A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="authorUrl" className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                  Situs Web (Opsional)
                </label>
                <input
                  type="url"
                  id="authorUrl"
                  value={authorUrl}
                  onChange={(e) => setAuthorUrl(e.target.value)}
                  placeholder="https://website-anda.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent text-sm text-[#0F172A] transition-colors"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="saveInfo"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]"
                />
                <label htmlFor="saveInfo" className="text-xs text-[#64748B] leading-relaxed cursor-pointer">
                  Simpan nama, email, dan situs web saya pada peramban ini untuk komentar saya berikutnya.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] disabled:bg-[#94A3B8] rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2"
                >
                  {isSubmitting ? "Mengirim Komentar..." : "Kirim Komentar"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </Container>
    </article>
  );
}
