"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { INITIAL_FORUM_TOPICS, ForumTopic, getStoredTopics } from "@/data/forumData";

export function HomeForumThreads() {
  const [threads, setThreads] = useState<ForumTopic[]>(INITIAL_FORUM_TOPICS.slice(0, 4));

  useEffect(() => {
    const loaded = getStoredTopics();
    const sorted = [...loaded].sort(
      (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    );
    setThreads(sorted.slice(0, 4));

    const handleUpdate = () => {
      const updated = getStoredTopics();
      const updatedSorted = [...updated].sort(
        (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
      );
      setThreads(updatedSorted.slice(0, 4));
    };

    window.addEventListener("m3s_forum_change", handleUpdate);
    return () => window.removeEventListener("m3s_forum_change", handleUpdate);
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return "Baru saja";
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "Kemarin";
      if (diffDays < 30) return `${diffDays} hari yang lalu`;
      return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return "Beberapa waktu lalu";
    }
  };

  return (
    <div className="space-y-3 flex-1">
      {threads.map((thread) => (
        <Link
          key={thread.id}
          href={`/forum/${thread.slug}`}
          className="group block bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#0D9488]/50 hover:shadow-xs shadow-2xs transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <Image
                  src={thread.author.avatar || "/images/avatar-ahmad.jpg"}
                  alt={thread.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#0D9488] transition-colors">
                  {thread.title}
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  {thread.author.name} • {formatTimeAgo(thread.lastActivityAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{thread.replies?.length ?? thread.repliesCount}</span>
              </div>
              <span
                className="px-2.5 py-1 text-[10px] font-semibold rounded-full border border-slate-100"
                style={{
                  backgroundColor: `${thread.categoryColor}15`,
                  color: thread.categoryColor,
                }}
              >
                {thread.categoryName}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
