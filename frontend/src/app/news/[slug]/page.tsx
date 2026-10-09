import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NEWS_ITEMS, NewsItem, NewsComment } from "@/data/newsData";
import { NewsDetailClient } from "./NewsDetailClient";
import { API_BASE_URL, getAssetUrl } from "@/lib/api";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function resolveNewsImage(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return getAssetUrl(url);
}

async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const fallback = NEWS_ITEMS.find((n) => n.slug === slug) || null;

  try {
    const res = await fetch(`${API_BASE_URL}/news/${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const apiData = json?.data;
      if (apiData) {
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
          excerpt: apiData.excerpt || fallback?.excerpt || "",
          category: {
            name: apiData.category?.parent?.name || apiData.category?.name || fallback?.category?.name || "Berita",
            slug: apiData.category?.parent?.slug || apiData.category?.slug || fallback?.category?.slug || "berita",
          },
          subCategory: {
            name: apiData.category?.parent ? apiData.category?.name : (fallback?.subCategory?.name || ""),
            slug: apiData.category?.parent ? apiData.category?.slug : (fallback?.subCategory?.slug || ""),
          },
          tags: Array.isArray(apiData.tags) ? apiData.tags : (fallback?.tags || []),
          publishedAt: fallback?.publishedAt || (apiData.published_at ? new Date(apiData.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""),
          readTime: fallback?.readTime || "4 menit baca",
          author: {
            name: apiData.author?.name || fallback?.author?.name || "Redaksi IKAMAYOGA",
            role: fallback?.author?.role || "Divisi Publikasi",
            avatar: resolveNewsImage(apiData.author?.avatar_url || apiData.author?.avatar, fallback?.author?.avatar || "/images/avatar-ahmad.jpg"),
          },
          thumbnail: resolveNewsImage(apiData.cover_image, fallback?.thumbnail || "/images/news-reuni.jpg"),
          contentImages: Array.isArray(apiData.content_images) && apiData.content_images.length > 0 ? apiData.content_images : (fallback?.contentImages || []),
          contentHtml: fallback?.contentHtml || [apiData.content],
          comments,
        };
      }
    }
  } catch {
    // API not reachable or static fallback
  }

  return fallback;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    return {
      title: "Berita Tidak Ditemukan | IKAMAYOGA",
    };
  }

  return {
    title: `${item.title} | IKAMAYOGA`,
    description: item.excerpt,
    openGraph: {
      title: item.title,
      description: item.excerpt,
      images: [item.thumbnail],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return <NewsDetailClient initialNews={item} />;
}
