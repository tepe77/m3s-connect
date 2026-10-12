import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NewsItem, mapNewsItem } from "@/data/newsData";
import { NewsDetailClient } from "./NewsDetailClient";
import { API_BASE_URL } from "@/lib/api";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/news/${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const apiData = json?.data;
      if (apiData) {
        return mapNewsItem(apiData);
      }
    }
  } catch {
    // API not reachable
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    const formattedTitle = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      title: `${formattedTitle} | Berita IKAMAYOGA`,
      description: "Portal Berita dan Pengumuman Resmi Alumni MAN 3 Sleman (IKAMAYOGA).",
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

  return <NewsDetailClient initialNews={item} slug={slug} />;
}
