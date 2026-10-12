export interface NewsComment {
  id: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  avatarUrl?: string;
  createdAt: string;
  content: string;
  isVerifiedAlumni?: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: {
    name: string;
    slug: string;
  };
  subCategory: {
    name: string;
    slug: string;
  };
  tags: string[];
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  contentImages: {
    url: string;
    caption: string;
    alt: string;
  }[];
  contentHtml: string[];
  comments: NewsComment[];
}

export const NEWS_ITEMS: NewsItem[] = [];

import { getAssetUrl } from "@/lib/api";

export function resolveNewsImage(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return getAssetUrl(url);
}

export function mapNewsItem(apiData: any): NewsItem {
  const comments: NewsComment[] = Array.isArray(apiData.comments)
    ? apiData.comments.map((c: any) => {
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
      })
    : [];

  return {
    id: apiData.id,
    slug: apiData.slug,
    title: apiData.title,
    excerpt: apiData.excerpt || "",
    category: {
      name: apiData.category?.parent?.name || apiData.category?.name || "Berita",
      slug: apiData.category?.parent?.slug || apiData.category?.slug || "berita",
    },
    subCategory: {
      name: apiData.category?.parent ? apiData.category?.name : "",
      slug: apiData.category?.parent ? apiData.category?.slug : "",
    },
    tags: Array.isArray(apiData.tags) ? apiData.tags : [],
    publishedAt: apiData.published_at
      ? new Date(apiData.published_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
    readTime: apiData.read_time ? `${apiData.read_time} menit baca` : "4 menit baca",
    author: {
      name: apiData.author?.name || "Redaksi IKAMAYOGA",
      role: apiData.author?.role || "Divisi Publikasi",
      avatar: resolveNewsImage(apiData.author?.avatar_url || apiData.author?.avatar, "/images/avatar-ahmad.jpg"),
    },
    thumbnail: resolveNewsImage(apiData.cover_image, "/images/news-reuni.jpg"),
    contentImages: Array.isArray(apiData.content_images) && apiData.content_images.length > 0 ? apiData.content_images : [],
    contentHtml: Array.isArray(apiData.content_html)
      ? apiData.content_html
      : typeof apiData.content === "string"
        ? apiData.content.split("\n\n").filter(Boolean)
        : [apiData.content || ""],
    comments,
  };
}
