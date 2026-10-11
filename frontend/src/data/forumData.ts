import { API_BASE_URL } from "@/lib/api";

export interface ForumCategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  image: string;
  sortOrder: number;
  topicCount: number;
  postCount: number;
  isMembersOnly?: boolean;
}

export interface ForumAuthor {
  id: string;
  name: string;
  avatar: string;
  graduationYear?: number;
  graduationClass?: string;
  occupation?: string;
  role: "alumni" | "admin" | "moderator";
}

export interface ForumParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  author: ForumAuthor;
  body: string;
  parentId?: string | null;
  parentAuthorName?: string | null;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  categoryColor: string;
  author: ForumAuthor;
  body: string;
  isPinned: boolean;
  isLocked: boolean;
  viewsCount: number;
  repliesCount: number;
  likesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isMembersOnly?: boolean;
  createdAt: string;
  lastActivityAt: string;
  tags: string[];
  participants: ForumParticipant[];
  replies: ForumReply[];
}

export const FORUM_CATEGORIES: ForumCategoryData[] = [
  {
    id: "cat-1",
    name: "Diskusi Umum",
    slug: "diskusi-umum",
    description: "Ruang silaturahmi santai, kabar antar angkatan, dan obrolan bebas warga Mayoga.",
    color: "#0D9488",
    icon: "chat",
    image: "/images/hero-man3-sleman.jpg",
    sortOrder: 1,
    topicCount: 0,
    postCount: 0,
  },
  {
    id: "cat-2",
    name: "Karir & Profesi",
    slug: "karir-dan-profesi",
    description: "Lowongan kerja, info magang, review CV, dan peluang kolaborasi profesional alumni.",
    color: "#2563EB",
    icon: "briefcase",
    image: "/images/news-internasional.jpg",
    sortOrder: 2,
    topicCount: 0,
    postCount: 0,
  },
  {
    id: "cat-3",
    name: "Kegiatan & Reuni",
    slug: "kegiatan-dan-reuni",
    description: "Agenda temu kangen akbar, bakti sosial ramadan, silaturahmi angkatan, dan kepanitiaan.",
    color: "#D97706",
    icon: "calendar",
    image: "/images/news-reuni.jpg",
    sortOrder: 3,
    topicCount: 0,
    postCount: 0,
  },
  {
    id: "cat-4",
    name: "Beasiswa & Pendidikan",
    slug: "beasiswa-dan-pendidikan",
    description: "Informasi beasiswa S1/S2/S3 dalam dan luar negeri, tips seleksi, dan bimbingan studi.",
    color: "#7C3AED",
    icon: "academic",
    image: "/images/news-beasiswa.jpg",
    sortOrder: 4,
    topicCount: 0,
    postCount: 0,
  },
  {
    id: "cat-5",
    name: "Bisnis & UMKM",
    slug: "bisnis-dan-umkm",
    description: "Etalase usaha alumni, kemitraan rantai pasok, dan sharing strategi wirausaha.",
    color: "#059669",
    icon: "store",
    image: "/images/news-peluncuran.jpg",
    sortOrder: 5,
    topicCount: 0,
    postCount: 0,
  },
  {
    id: "cat-6",
    name: "Teknologi & Digital",
    slug: "teknologi-dan-inovasi",
    description: "Diskusi rekayasa perangkat lunak, AI, cloud computing, dan inisiatif digital madrasah.",
    color: "#DC2626",
    icon: "chip",
    image: "/images/doc-wisuda.jpg",
    sortOrder: 6,
    topicCount: 0,
    postCount: 0,
  },
];

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [];

export function mapApiThreadToTopic(item: any): ForumTopic {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    categoryId: item.category_id || item.category?.id || "",
    categorySlug: item.category?.slug || "diskusi-umum",
    categoryName: item.category?.name || "Diskusi Umum",
    categoryColor: item.category?.color || "#0D9488",
    author: {
      id: item.author?.id || "user-author",
      name: item.author?.name || "Alumni Terverifikasi",
      avatar: item.author?.avatar || "/images/avatar-ahmad.jpg",
      role: (item.author?.role as "alumni" | "admin" | "moderator") || "alumni",
      graduationYear: item.author?.graduation_year,
      graduationClass: item.author?.graduation_class,
      occupation: item.author?.occupation,
    },
    body: item.body || "",
    isPinned: Boolean(item.is_pinned),
    isLocked: Boolean(item.is_locked),
    viewsCount: item.views_count || 0,
    repliesCount: item.posts_count ?? item.replies_count ?? (Array.isArray(item.posts) ? item.posts.length : 0),
    likesCount: item.likes_count ?? (Array.isArray(item.likes) ? item.likes.length : 0),
    isLiked: Boolean(item.is_liked),
    isBookmarked: Boolean(item.is_bookmarked),
    isMembersOnly: true,
    createdAt: item.created_at || new Date().toISOString(),
    lastActivityAt: item.last_post_at || item.updated_at || item.created_at || new Date().toISOString(),
    tags: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : ["Mayoga", "Diskusi"],
    participants: Array.isArray(item.participants) && item.participants.length > 0
      ? item.participants
      : item.author
        ? [{ id: item.author.id, name: item.author.name, avatar: item.author.avatar || "/images/avatar-ahmad.jpg" }]
        : [],
    replies: Array.isArray(item.posts)
      ? item.posts.map(mapApiPostToReply)
      : Array.isArray(item.replies)
        ? item.replies
        : [],
  };
}

export function mapApiPostToReply(post: any): ForumReply {
  return {
    id: post.id,
    threadId: post.thread_id,
    author: {
      id: post.author?.id || post.user_id || "user-unknown",
      name: post.author?.name || "Alumni Terdaftar",
      avatar: post.author?.avatar || "/images/avatar-ahmad.jpg",
      role: (post.author?.role as "alumni" | "admin" | "moderator") || "alumni",
      graduationYear: post.author?.graduation_year,
      occupation: post.author?.occupation,
    },
    body: post.body,
    parentId: post.parent_id,
    parentAuthorName: post.parent?.author?.name || null,
    createdAt: post.created_at,
    likesCount: post.likes_count ?? (Array.isArray(post.likes) ? post.likes.length : 0),
    isLiked: Boolean(post.is_liked),
  };
}

export function mapApiCategory(cat: any): ForumCategoryData {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    color: cat.color || "#0D9488",
    icon: cat.icon || "chat",
    image: cat.image ? (cat.image.startsWith("http") || cat.image.startsWith("/") ? cat.image : `/images/${cat.image.split("/").pop()}`) : "/images/hero-man3-sleman.jpg",
    sortOrder: cat.sort_order || 0,
    topicCount: cat.topic_count ?? cat.threads_count ?? 0,
    postCount: cat.post_count ?? 0,
    isMembersOnly: true,
  };
}

// LocalStorage helpers for reactive state & user interaction persistence
const STORAGE_KEY_TOPICS = "m3s_forum_topics_v1";

export function getStoredTopics(): ForumTopic[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOPICS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredTopics(topics: ForumTopic[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(topics));
    window.dispatchEvent(new Event("m3s_forum_change"));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function addTopic(newTopic: Omit<ForumTopic, "id" | "viewsCount" | "repliesCount" | "likesCount" | "createdAt" | "lastActivityAt" | "participants" | "replies">): ForumTopic {
  const topics = getStoredTopics();
  const created: ForumTopic = {
    ...newTopic,
    id: `topic-${Date.now()}`,
    viewsCount: 1,
    repliesCount: 0,
    likesCount: 0,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    participants: [{ id: newTopic.author.id, name: newTopic.author.name, avatar: newTopic.author.avatar }],
    replies: [],
  };

  const updated = [created, ...topics];
  saveStoredTopics(updated);

  // Background sync to backend API if authenticated
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      fetch(`${API_BASE_URL}/forum/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id: newTopic.categoryId,
          title: newTopic.title,
          body: newTopic.body,
        }),
      }).catch(() => {});
    }
  } catch {}

  return created;
}

export function addReply(threadSlug: string, replyData: { body: string; author: ForumAuthor; parentId?: string; parentAuthorName?: string }): ForumReply | null {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return null;

  const topic = topics[topicIndex];
  const newReply: ForumReply = {
    id: `reply-${Date.now()}`,
    threadId: topic.id,
    author: replyData.author,
    body: replyData.body,
    parentId: replyData.parentId,
    parentAuthorName: replyData.parentAuthorName,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    isLiked: false,
  };

  const hasParticipant = topic.participants.some((p) => p.name === replyData.author.name);
  const updatedParticipants = hasParticipant
    ? topic.participants
    : [...topic.participants, { id: replyData.author.id, name: replyData.author.name, avatar: replyData.author.avatar }].slice(0, 5);

  const updatedTopic: ForumTopic = {
    ...topic,
    repliesCount: topic.repliesCount + 1,
    lastActivityAt: new Date().toISOString(),
    participants: updatedParticipants,
    replies: [...topic.replies, newReply],
  };

  topics[topicIndex] = updatedTopic;
  saveStoredTopics(topics);

  // Background sync to backend API if authenticated
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      fetch(`${API_BASE_URL}/forum/threads/${threadSlug}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          body: replyData.body,
          parent_id: replyData.parentId,
        }),
      }).catch(() => {});
    }
  } catch {}

  return newReply;
}

export function toggleTopicLike(threadSlug: string): boolean {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return false;

  const topic = topics[topicIndex];
  const isLiked = !topic.isLiked;
  const likesCount = isLiked ? topic.likesCount + 1 : Math.max(0, topic.likesCount - 1);

  topics[topicIndex] = { ...topic, isLiked, likesCount };
  saveStoredTopics(topics);

  // Background sync to backend API if authenticated
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      fetch(`${API_BASE_URL}/forum/threads/${threadSlug}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }
  } catch {}

  return isLiked;
}

export function toggleReplyLike(threadSlug: string, replyId: string): boolean {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return false;

  const topic = topics[topicIndex];
  const replyIndex = topic.replies.findIndex((r) => r.id === replyId);
  if (replyIndex === -1) return false;

  const reply = topic.replies[replyIndex];
  const isLiked = !reply.isLiked;
  const likesCount = isLiked ? reply.likesCount + 1 : Math.max(0, reply.likesCount - 1);

  topic.replies[replyIndex] = { ...reply, isLiked, likesCount };
  topics[topicIndex] = { ...topic };
  saveStoredTopics(topics);

  // Background sync to backend API if authenticated
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      fetch(`${API_BASE_URL}/forum/posts/${replyId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }
  } catch {}

  return isLiked;
}

export function toggleTopicBookmark(threadSlug: string): boolean {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return false;

  const topic = topics[topicIndex];
  const isBookmarked = !topic.isBookmarked;

  topics[topicIndex] = { ...topic, isBookmarked };
  saveStoredTopics(topics);

  // Background sync to backend API if authenticated
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      fetch(`${API_BASE_URL}/forum/threads/${threadSlug}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }
  } catch {}

  return isBookmarked;
}

export function incrementTopicViews(threadSlug: string): number {
  const topics = getStoredTopics();
  const topicIndex = topics.findIndex((t) => t.slug === threadSlug);
  if (topicIndex === -1) return 0;

  const topic = topics[topicIndex];
  const viewsCount = (topic.viewsCount || 0) + 1;
  topics[topicIndex] = { ...topic, viewsCount };
  saveStoredTopics(topics);

  // Background sync to backend API
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`${API_BASE_URL}/forum/threads/${threadSlug}/view`, {
      method: "POST",
      headers,
    }).catch(() => {});
  } catch {}

  return viewsCount;
}

export function getForumCategories(topicsList?: ForumTopic[]): ForumCategoryData[] {
  const topics = topicsList || getStoredTopics();
  return FORUM_CATEGORIES.map((cat) => {
    const catTopics = topics.filter(
      (t) => t.categoryId === cat.id || t.categorySlug === cat.slug
    );
    const topicCount = catTopics.length;
    const postCount = catTopics.reduce(
      (acc, t) => acc + (t.replies ? t.replies.length : t.repliesCount || 0),
      0
    );
    return {
      ...cat,
      topicCount,
      postCount,
      isMembersOnly: true,
    };
  });
}
