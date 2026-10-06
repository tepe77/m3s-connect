import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NEWS_ITEMS } from "@/data/newsData";
import { NewsDetailClient } from "./NewsDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((n) => n.slug === slug);

  if (!item) {
    return {
      title: "Berita Tidak Ditemukan | M3S Connect",
    };
  }

  return {
    title: `${item.title} | M3S Connect`,
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
  const item = NEWS_ITEMS.find((n) => n.slug === slug);

  if (!item) {
    notFound();
  }

  return <NewsDetailClient initialNews={item} />;
}
