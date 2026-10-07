"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Heart,
  Reply,
  Share2,
  Check,
  CornerDownRight,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";

import { ForumAuthor } from "@/data/forumData";
import { RichContentRenderer } from "./RichContentRenderer";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <Card
      id={`post-${postNumber}`}
      className={`relative transition-all duration-200 border ${
        isOP
          ? "bg-white border-slate-200/90 shadow-xs ring-1 ring-emerald-500/10"
          : "bg-white/95 border-slate-200/80 hover:border-slate-300 shadow-2xs"
      }`}
    >
      {/* OP Subtle Accent Strip */}
      {isOP && (
        <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent rounded-t-full" />
      )}

      <CardContent className="p-5 sm:p-7 space-y-4">
        {/* 1. Header: Author Avatar & Badges */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100 shrink-0">
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
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  {author.name}
                </h4>

                {isOP && (
                  <Badge
                    variant="outline"
                    className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0"
                  >
                    Penulis Topik
                  </Badge>
                )}

                {author.role === "admin" && (
                  <Badge
                    variant="destructive"
                    className="text-[10px] font-bold gap-1 px-2 py-0"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin</span>
                  </Badge>
                )}

                {author.role === "moderator" && (
                  <Badge
                    variant="blue"
                    className="text-[10px] font-bold gap-1 px-2 py-0"
                  >
                    <Award className="w-3 h-3" />
                    <span>Moderator</span>
                  </Badge>
                )}

                {author.graduationYear && (
                  <Badge
                    variant="emerald"
                    className="text-[10px] font-bold px-2 py-0"
                  >
                    Alumni &apos;{author.graduationYear.toString().slice(-2)}
                    {author.graduationClass ? ` (${author.graduationClass})` : ""}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                <span>{author.occupation || "Anggota Komunitas"}</span>
                <span>•</span>
                <time dateTime={createdAt}>{formatTimestamp(createdAt)}</time>
              </div>
            </div>
          </div>

          {/* Post Number Badge */}
          <Badge
            variant="outline"
            className="font-mono text-[11px] text-slate-400 border-slate-200 bg-slate-50 px-2 py-0.5"
          >
            #{postNumber}
          </Badge>
        </div>

        {/* 2. Parent reply quote callout */}
        {parentAuthorName && (
          <div className="px-3.5 py-2 rounded-xl bg-slate-50/90 border-l-2 border-emerald-500 text-xs text-slate-600 flex items-center gap-2">
            <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Membalas tanggapan dari{" "}
              <strong className="text-slate-900 font-semibold">
                @{parentAuthorName}
              </strong>
            </span>
          </div>
        )}

        {/* 3. Post Body */}
        <div className="pt-1">
          <RichContentRenderer content={body} />
        </div>

        {/* 4. Interaction Bar with Shadcn Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Like Button */}
            <Button
              type="button"
              variant={isLiked ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onLike && onLike(id)}
              className={`rounded-full h-8 px-3 text-xs font-semibold gap-1.5 transition-colors ${
                isLiked
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200"
                  : "text-slate-600 hover:text-rose-600 hover:bg-rose-50/60"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isLiked ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
              <span>{likesCount}</span>
            </Button>

            {/* Reply Button */}
            {onReply && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onReply(author, id)}
                className="rounded-full h-8 px-3 text-xs font-semibold gap-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Balas</span>
              </Button>
            )}
          </div>

          {/* Share Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className={`rounded-full h-8 px-3 text-xs font-medium gap-1.5 transition-colors ${
              copied
                ? "text-emerald-700 bg-emerald-50"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
