"use client";

import Link from "next/link";
import Image from "next/image";
import { ForumTopic } from "@/data/forumData";

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
    <div className="group relative p-4 sm:p-5 hover:bg-slate-50/80 transition-colors border-b border-[#E2E8F0] last:border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* 1. Left Section: Title, Category Badge & Tags */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start gap-2">
          {topic.isPinned && (
            <span
              title="Topik Disematkan (Pinned)"
              className="inline-flex items-center text-amber-600 shrink-0 mt-0.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019L11 15.323V18a1 1 0 11-2 0v-2.677l-1.333-1.342A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.789l1.599.799L9 4.323V3a1 1 0 011-1z" />
              </svg>
            </span>
          )}

          {topic.isLocked && (
            <span
              title="Topik Terkunci (Locked)"
              className="inline-flex items-center text-slate-400 shrink-0 mt-0.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
          )}

          <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#0D9488] transition-colors leading-snug">
            <Link href={`/forum/${topic.slug}`} className="focus:outline-none">
              {topic.title}
            </Link>
          </h3>
        </div>

        {/* Metadata Badges (Discourse Category Pill + Tags) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Pill with Colored Box */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onCategoryClick) onCategoryClick(topic.categorySlug);
            }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[#334155] text-[11px] font-semibold transition-colors"
          >
            <span
              className="w-2 h-2 rounded-xs shrink-0"
              style={{ backgroundColor: topic.categoryColor }}
            />
            <span>{topic.categoryName}</span>
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
              className="text-[11px] text-[#64748B] hover:text-[#0D9488] font-medium transition-colors"
            >
              #{tag}
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
          <div
            title={`${topic.repliesCount} balasan`}
            className={`min-w-[42px] px-2 py-1 rounded-md text-center font-bold transition-colors ${
              topic.repliesCount > 0
                ? "bg-emerald-50 text-[#0D9488] border border-emerald-100"
                : "bg-slate-50 text-[#94A3B8]"
            }`}
          >
            {topic.repliesCount}
          </div>

          {/* Views */}
          <div
            title={`${topic.viewsCount} dilihat`}
            className="w-12 text-right text-[#64748B] hidden sm:block"
          >
            {topic.viewsCount >= 1000
              ? `${(topic.viewsCount / 1000).toFixed(1)}k`
              : topic.viewsCount}
          </div>

          {/* Last Activity */}
          <div
            title={`Aktivitas terakhir: ${new Date(topic.lastActivityAt).toLocaleString("id-ID")}`}
            className="w-10 text-right text-[#94A3B8] font-semibold text-[11px]"
          >
            {formatTimeAgo(topic.lastActivityAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
