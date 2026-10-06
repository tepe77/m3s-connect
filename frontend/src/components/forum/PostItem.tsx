"use client";

import Image from "next/image";
import { useState } from "react";
import { ForumAuthor } from "@/data/forumData";
import { RichContentRenderer } from "./RichContentRenderer";

interface PostItemProps {
  id: string;
  postNumber: number;
  author: ForumAuthor;
  body: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string | null;
  parentAuthorName?: string | null;
  isOP?: boolean;
  onLike?: (id: string) => void;
  onReply?: (author: ForumAuthor, postId: string) => void;
}

export function PostItem({
  id,
  postNumber,
  author,
  body,
  createdAt,
  likesCount,
  isLiked = false,
  parentAuthorName,
  isOP = false,
  onLike,
  onReply,
}: PostItemProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article
      id={`post-${postNumber}`}
      className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isOP
          ? "bg-white border-[#E2E8F0] shadow-xs"
          : "bg-white/80 border-[#E2E8F0] hover:border-[#CBD5E1]"
      }`}
    >
      {/* 1. Post Header: Author Avatar & Metadata */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-200 ring-2 ring-emerald-50 shrink-0">
            <Image
              src={author.avatar || "/images/avatar-ahmad.jpg"}
              alt={author.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                {author.name}
              </h4>
              {author.role === "admin" && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Admin
                </span>
              )}
              {author.role === "moderator" && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Moderator
                </span>
              )}
              {author.graduationYear && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
                  Alumni &apos;{author.graduationYear.toString().slice(-2)}
                  {author.graduationClass ? ` (${author.graduationClass})` : ""}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
              <span>{author.occupation || "Anggota Komunitas"}</span>
              <span>•</span>
              <time dateTime={createdAt}>{formatTimestamp(createdAt)}</time>
            </div>
          </div>
        </div>

        {/* Post Number Badge */}
        <div className="text-xs font-mono font-bold text-[#94A3B8]">
          #{postNumber}
        </div>
      </div>

      {/* 2. Parent reply quote callout if nested */}
      {parentAuthorName && (
        <div className="mb-4 px-3.5 py-2 rounded-xl bg-slate-50 border-l-3 border-[#0D9488] text-xs text-[#475569] flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-[#0D9488] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span>
            Membalas <strong className="text-[#0F172A]">@{parentAuthorName}</strong>
          </span>
        </div>
      )}

      {/* 3. Post Body (Rich Content with Photo, Video, Link, and Formatting support) */}
      <div className="py-1">
        <RichContentRenderer content={body} />
      </div>

      {/* 4. Interaction Bar (Discourse Like, Reply, Share) */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            type="button"
            onClick={() => onLike && onLike(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              isLiked
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "text-[#64748B] hover:text-rose-600 hover:bg-rose-50/50"
            }`}
          >
            <svg
              className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : "fill-none"}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likesCount}</span>
          </button>

          {/* Reply Button */}
          {onReply && (
            <button
              type="button"
              onClick={() => onReply(author, id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#64748B] hover:text-[#0D9488] hover:bg-emerald-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              <span>Balas</span>
            </button>
          )}
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>{copied ? "Tautan Tersalin!" : "Bagikan"}</span>
        </button>
      </div>
    </article>
  );
}
