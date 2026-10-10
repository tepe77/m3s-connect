"use client";

import Link from "next/link";
import Image from "next/image";
import { Pin, Lock } from "lucide-react";
import { ForumTopic } from "@/data/forumData";
import { Badge } from "@/components/ui/badge";

interface TopicListRowProps {
  topic: ForumTopic;
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (slug: string) => void;
}

export function TopicListRow({
  topic,
  onTagClick,
  onCategoryClick,
}: TopicListRowProps) {
  // Format relative timestamp
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 60) return `${Math.max(1, minutes)}m`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}j`;
      const days = Math.floor(hours / 24);
      return `${days}h`;
    } catch {
      return "baru saja";
    }
  };

  return (
    <div className="group relative p-4 sm:p-5 hover:bg-slate-50/80 transition-colors border-b border-slate-200 last:border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* 1. Left Section: Title, Category Badge & Tags */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start gap-2">
          {topic.isPinned && (
            <span
              title="Topik Disematkan (Pinned)"
              className="inline-flex items-center text-amber-600 shrink-0 mt-0.5"
            >
              <Pin className="w-4 h-4 fill-amber-600" />
            </span>
          )}

          {topic.isLocked && (
            <span
              title="Topik Terkunci (Locked)"
              className="inline-flex items-center text-slate-400 shrink-0 mt-0.5"
            >
              <Lock className="w-3.5 h-3.5" />
            </span>
          )}

          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
            <Link href={`/forum/${topic.slug}`} className="focus:outline-none">
              {topic.title}
            </Link>
          </h3>
        </div>

        {/* Metadata Badges (Discourse Category Pill + Tags) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Badge
            variant="outline"
            className="text-[10px] font-bold text-emerald-800 bg-emerald-50/70 border-emerald-200 px-2 py-0"
          >
            Khusus Alumni
          </Badge>

          {/* Category Pill with Colored Box */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onCategoryClick) onCategoryClick(topic.categorySlug);
            }}
          >
            <Badge
              variant="outline"
              className="gap-1.5 px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border-slate-200 transition-colors"
            >
              <span
                className="w-2 h-2 rounded-xs shrink-0"
                style={{ backgroundColor: topic.categoryColor }}
              />
              <span>{topic.categoryName}</span>
            </Badge>
          </button>

          {/* Tags */}
          {topic.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (onTagClick) onTagClick(tag);
              }}
            >
              <Badge
                variant="secondary"
                className="text-[11px] text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 font-normal px-2 py-0 transition-colors"
              >
                #{tag}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Right Section: Discourse Participants Stack + Replies + Views + Activity */}
      <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        {/* Participants Avatar Stack (Signature Discourse feature) */}
        <div className="flex -space-x-1.5 overflow-hidden py-1">
          {topic.participants.slice(0, 4).map((p) => (
            <div
              key={p.id}
              title={p.name}
              className="relative inline-block w-6 h-6 rounded-full ring-2 ring-white overflow-hidden bg-slate-200"
            >
              <Image
                src={p.avatar}
                alt={p.name}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Discourse Metric Columns */}
        <div className="flex items-center gap-4 text-xs font-mono">
          {/* Replies */}
          <Badge
            variant={(topic.replies?.length ?? topic.repliesCount) > 0 ? "emerald" : "secondary"}
            title={`${topic.replies?.length ?? topic.repliesCount} balasan`}
            className="min-w-[40px] justify-center px-2 py-0.5 font-bold"
          >
            {topic.replies?.length ?? topic.repliesCount}
          </Badge>

          {/* Views */}
          <div
            title={`${topic.viewsCount} dilihat`}
            className="w-12 text-right text-slate-500 hidden sm:block font-sans"
          >
            {topic.viewsCount >= 1000
              ? `${(topic.viewsCount / 1000).toFixed(1)}k`
              : topic.viewsCount}
          </div>

          {/* Last Activity */}
          <div
            title={`Aktivitas terakhir: ${new Date(topic.lastActivityAt).toLocaleString("id-ID")}`}
            className="w-10 text-right text-slate-400 font-semibold text-[11px]"
          >
            {formatTimeAgo(topic.lastActivityAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
