"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Reply,
  Share2,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  MessageSquare,
} from "lucide-react";

import { ForumAuthor, ForumReply } from "@/data/forumData";
import { RichContentRenderer } from "./RichContentRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ThreadedRepliesStreamProps {
  replies: ForumReply[];
  currentUserId?: string | null;
  onLikeReply: (replyId: string) => void;
  onShareReply: (reply: ForumReply) => void;
  onSubmitReply: (
    body: string,
    parentId?: string,
    parentAuthorName?: string
  ) => Promise<boolean>;
}

interface ReplyTreeNode {
  reply: ForumReply;
  children: ForumReply[];
}

export function ThreadedRepliesStream({
  replies,
  onLikeReply,
  onShareReply,
  onSubmitReply,
}: ThreadedRepliesStreamProps) {
  // Inline reply composer state: which reply ID currently has an open composer
  const [activeInlineReplyId, setActiveInlineReplyId] = useState<string | null>(null);
  const [inlineReplyText, setInlineReplyText] = useState("");
  const [inlineSubmitting, setInlineSubmitting] = useState(false);

  // Collapsed state for threads with replies (map of parentReplyId -> isCollapsed)
  const [collapsedThreads, setCollapsedThreads] = useState<Record<string, boolean>>({});

  // 1. Organize flat replies list into hierarchical tree
  const replyMap = new Map<string, ForumReply>();
  replies.forEach((r) => replyMap.set(r.id, r));

  const treeNodes: ReplyTreeNode[] = [];
  const childrenMap = new Map<string, ForumReply[]>();

  replies.forEach((r) => {
    if (r.parentId && replyMap.has(r.parentId)) {
      const existing = childrenMap.get(r.parentId) || [];
      existing.push(r);
      childrenMap.set(r.parentId, existing);
    }
  });

  // Collect all top-level replies (no parent, or parent not in map)
  replies.forEach((r) => {
    if (!r.parentId || !replyMap.has(r.parentId)) {
      // Gather all direct and indirect children
      const allChildren: ForumReply[] = [];
      const queue = [...(childrenMap.get(r.id) || [])];
      while (queue.length > 0) {
        const item = queue.shift()!;
        allChildren.push(item);
        const subChildren = childrenMap.get(item.id) || [];
        queue.push(...subChildren);
      }
      treeNodes.push({
        reply: r,
        children: allChildren,
      });
    }
  });

  const toggleThreadCollapse = (replyId: string) => {
    setCollapsedThreads((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  const handleOpenInlineReply = (replyId: string) => {
    setActiveInlineReplyId(replyId);
    setInlineReplyText("");
  };

  const handleCancelInlineReply = () => {
    setActiveInlineReplyId(null);
    setInlineReplyText("");
  };

  const handleSendInlineReply = async (
    targetReply: ForumReply
  ) => {
    if (!inlineReplyText.trim() || inlineSubmitting) return;

    setInlineSubmitting(true);
    try {
      const success = await onSubmitReply(
        inlineReplyText.trim(),
        targetReply.id,
        targetReply.author.name
      );
      if (success) {
        setInlineReplyText("");
        setActiveInlineReplyId(null);
        // Ensure child is visible
        setCollapsedThreads((prev) => ({ ...prev, [targetReply.id]: false }));
      }
    } finally {
      setInlineSubmitting(false);
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

  if (replies.length === 0) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Belum Ada Balasan</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Jadilah alumni pertama yang memberikan tanggapan atau opini konstruktif pada topik diskusi ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {treeNodes.map((node, nodeIdx) => {
        const parent = node.reply;
        const children = node.children;
        const isCollapsed = Boolean(collapsedThreads[parent.id]);

        return (
          <div
            key={parent.id}
            id={`reply-${parent.id}`}
            className="group/thread relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300"
          >
            {/* 1. Parent Reply (Alumni B) */}
            <div className="p-4 sm:p-6 space-y-3">
              {/* Header: Avatar, Name, Badges, Time */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100 shrink-0">
                    <Image
                      src={parent.author.avatar || "/images/avatar-ahmad.jpg"}
                      alt={parent.author.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {parent.author.name}
                      </span>

                      {parent.author.role === "admin" && (
                        <Badge variant="destructive" className="text-[10px] py-0 px-1.5 gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Admin</span>
                        </Badge>
                      )}

                      {parent.author.role === "moderator" && (
                        <Badge variant="blue" className="text-[10px] py-0 px-1.5 gap-1">
                          <Award className="w-3 h-3" />
                          <span>Moderator</span>
                        </Badge>
                      )}

                      {parent.author.graduationYear && (
                        <Badge variant="emerald" className="text-[10px] py-0 px-1.5">
                          Alumni &apos;{parent.author.graduationYear.toString().slice(-2)}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{parent.author.occupation || "Alumni Terdaftar"}</span>
                      <span>•</span>
                      <time dateTime={parent.createdAt}>{formatTimestamp(parent.createdAt)}</time>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  #{nodeIdx + 1}
                </span>
              </div>

              {/* Body */}
              <div className="pt-1 text-xs sm:text-sm text-slate-800 leading-relaxed pl-1 sm:pl-2">
                <RichContentRenderer content={parent.body} />
              </div>

              {/* Actions: Suka, Balas, Bagikan */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant={parent.isLiked ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => onLikeReply(parent.id)}
                    className={`h-7 px-2.5 rounded-full text-xs font-semibold gap-1.5 transition-colors ${
                      parent.isLiked
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                        : "text-slate-600 hover:text-rose-600 hover:bg-rose-50/50"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        parent.isLiked ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                    <span>{parent.likesCount}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenInlineReply(parent.id)}
                    className="h-7 px-2.5 rounded-full text-xs font-semibold gap-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Balas</span>
                  </Button>

                  {/* YouTube style Toggle Collapsible for Child Replies */}
                  {children.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleThreadCollapse(parent.id)}
                      className="h-7 px-2.5 rounded-full text-xs font-semibold gap-1.5 text-emerald-700 hover:bg-emerald-50"
                    >
                      {isCollapsed ? (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Lihat {children.length} Balasan</span>
                        </>
                      ) : (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Sembunyikan Balasan</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onShareReply(parent)}
                  className="h-7 px-2.5 rounded-full text-xs text-slate-500 hover:text-slate-800 gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bagikan</span>
                </Button>
              </div>

              {/* Inline Quick Reply Composer under Parent */}
              {activeInlineReplyId === parent.id && (
                <div className="pt-3 pb-1 pl-2 sm:pl-3">
                  <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-emerald-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                        <Reply className="w-3.5 h-3.5" />
                        <span>Membalas @{parent.author.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelInlineReply}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <Textarea
                      rows={2}
                      value={inlineReplyText}
                      onChange={(e) => setInlineReplyText(e.target.value)}
                      placeholder={`Tuliskan tanggapan Anda untuk @${parent.author.name}...`}
                      className="text-xs bg-white resize-y rounded-xl border-slate-300 min-h-[70px] p-2.5 focus-visible:ring-emerald-500"
                    />

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelInlineReply}
                        className="h-7 text-xs rounded-full"
                      >
                        Batal
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={inlineSubmitting || !inlineReplyText.trim()}
                        onClick={() => handleSendInlineReply(parent)}
                        className="h-7 text-xs px-4 rounded-full gap-1.5 shadow-2xs"
                      >
                        {inlineSubmitting ? "Mengirim..." : "Kirim"}
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. YouTube-Style Threaded Replies Hierarchy with Aligned Non-Overlapping Connectors */}
            {children.length > 0 && !isCollapsed && (
              <div className="border-t border-slate-100 bg-slate-50/50 rounded-b-2xl sm:rounded-b-3xl px-3 sm:px-6 pt-3.5 pb-5 space-y-3">
                {/* Thread context info */}
                <div className="flex items-center gap-2 px-1 text-xs text-slate-500 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{children.length} Balasan untuk @{parent.author.name}</span>
                </div>

                <div className="space-y-3">
                  {children.map((child, childIdx) => {
                    const isLastChild = childIdx === children.length - 1;
                    const isSubReply = Boolean(child.parentId && child.parentId !== parent.id);

                    return (
                      <div
                        key={child.id}
                        id={`reply-${child.id}`}
                        className={`relative flex items-start group/child ${
                          isSubReply ? "ml-3 sm:ml-5" : ""
                        }`}
                      >
                        {/* Precise Tree Connector Gutter: 100% matched coordinates with 0px overlap */}
                        <div
                          className="relative shrink-0 w-6 sm:w-8 self-stretch pointer-events-none"
                          aria-hidden="true"
                        >
                          {/* Curved branch from vertical trunk into child card */}
                          <div className="absolute left-2 sm:left-3 top-0 h-6 w-4 sm:w-5 border-l-2 border-b-2 border-slate-300 dark:border-slate-600 rounded-bl-xl" />

                          {/* Continuing vertical trunk to next child (terminates cleanly at last child) */}
                          {!isLastChild && (
                            <div className="absolute left-2 sm:left-3 top-6 -bottom-3 w-0.5 bg-slate-300 dark:bg-slate-600" />
                          )}
                        </div>

                        {/* Child Reply Card */}
                        <div className="flex-1 min-w-0 bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-2xs transition-all">
                          {/* Child Header: Avatar, Name, Mention Badge, Time */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100 shrink-0">
                                <Image
                                  src={child.author.avatar || "/images/avatar-ahmad.jpg"}
                                  alt={child.author.name}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900 leading-tight">
                                    {child.author.name}
                                  </span>

                                  {child.author.role === "admin" && (
                                    <Badge variant="destructive" className="text-[9px] py-0 px-1">
                                      Admin
                                    </Badge>
                                  )}

                                  {child.author.graduationYear && (
                                    <Badge variant="emerald" className="text-[9px] py-0 px-1">
                                      &apos;{child.author.graduationYear.toString().slice(-2)}
                                    </Badge>
                                  )}

                                  {/* Who this child is replying to (e.g. ↩ @Siti Rahmawati) */}
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                    <Reply className="w-2.5 h-2.5 text-emerald-600 inline" />
                                    <span>@{child.parentAuthorName || parent.author.name}</span>
                                  </span>
                                </div>

                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  <time dateTime={child.createdAt}>
                                    {formatTimestamp(child.createdAt)}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Child Body */}
                          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0.5">
                            <RichContentRenderer content={child.body} />
                          </div>

                          {/* Child Actions */}
                          <div className="pt-1.5 flex items-center justify-between border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <Button
                                type="button"
                                variant={child.isLiked ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => onLikeReply(child.id)}
                                className={`h-6 px-2 rounded-full text-[11px] font-semibold gap-1 transition-colors ${
                                  child.isLiked
                                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                                    : "text-slate-500 hover:text-rose-600 hover:bg-rose-50/50"
                                }`}
                              >
                                <Heart
                                  className={`w-3 h-3 ${
                                    child.isLiked ? "fill-rose-500 text-rose-500" : ""
                                  }`}
                                />
                                <span>{child.likesCount}</span>
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenInlineReply(child.id)}
                                className="h-6 px-2 rounded-full text-[11px] font-semibold gap-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                              >
                                <Reply className="w-3 h-3" />
                                <span>Balas</span>
                              </Button>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onShareReply(child)}
                              className="h-6 px-2 rounded-full text-[11px] text-slate-400 hover:text-slate-700"
                            >
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Inline Quick Reply Composer under Child */}
                          {activeInlineReplyId === child.id && (
                            <div className="pt-2">
                              <div className="p-3 bg-slate-50/90 rounded-xl border border-emerald-200 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                                    <Reply className="w-3 h-3" />
                                    <span>Membalas @{child.author.name}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={handleCancelInlineReply}
                                    className="text-slate-400 hover:text-slate-700"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <Textarea
                                  rows={2}
                                  value={inlineReplyText}
                                  onChange={(e) => setInlineReplyText(e.target.value)}
                                  placeholder={`Tuliskan tanggapan Anda untuk @${child.author.name}...`}
                                  className="text-xs bg-white resize-y rounded-xl border-slate-300 min-h-[60px] p-2 focus-visible:ring-emerald-500"
                                />

                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancelInlineReply}
                                    className="h-6 text-[11px] rounded-full"
                                  >
                                    Batal
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    disabled={inlineSubmitting || !inlineReplyText.trim()}
                                    onClick={() => handleSendInlineReply(child)}
                                    className="h-6 text-[11px] px-3.5 rounded-full gap-1 shadow-2xs"
                                  >
                                    {inlineSubmitting ? "Mengirim..." : "Kirim"}
                                    <Send className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
