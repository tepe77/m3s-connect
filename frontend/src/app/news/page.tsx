import { Container } from "@/components/ui/Container";
import { NewsItem } from "@/data/newsData";
import { NewsListClient } from "@/components/news/NewsListClient";
import { API_BASE_URL, getAssetUrl } from "@/lib/api";

function resolveImageUrl(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return getAssetUrl(url);
}

async function getNewsList(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/news`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any) => {
          return {
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt || "",
            category: {
              name: item.category?.parent?.name || item.category?.name || "Berita",
              slug: item.category?.parent?.slug || item.category?.slug || "berita",
            },
            subCategory: {
              name: item.category?.parent ? item.category?.name : "",
              slug: item.category?.parent ? item.category?.slug : "",
            },
            tags: Array.isArray(item.tags) ? item.tags : [],
            publishedAt: item.published_at
              ? new Date(item.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "",
            readTime: item.read_time ? `${item.read_time} menit baca` : "4 menit baca",
            author: {
              name: item.author?.name || "Redaksi IKAMAYOGA",
              role: item.author?.role || "Divisi Publikasi",
              avatar: resolveImageUrl(item.author?.avatar_url || item.author?.avatar, "/images/avatar-ahmad.jpg"),
            },
            thumbnail: resolveImageUrl(item.cover_image_url || item.cover_image, "/images/news-reuni.jpg"),
            contentImages: Array.isArray(item.content_images) ? item.content_images : [],
            contentHtml: Array.isArray(item.content_html) ? item.content_html : [item.content || ""],
            comments: Array.isArray(item.comments) ? item.comments : [],
          };
        });
      }
    }
  } catch {}
  return [];
}

export default async function NewsIndexPage() {
  const newsList = await getNewsList();

  return (
    <div className="py-8 md:py-12 bg-[#F8FAFC]">
      <Container size="wide">
        {/* Header Title */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D9488] text-xs font-semibold border border-emerald-200">
            <span>Warta & Informasi Madrasah</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Kabar Berita & Cerita Alumni
          </h1>
          <p className="text-sm md:text-base text-[#64748B] max-w-2xl leading-relaxed">
            Pusat publikasi agenda resmi, liputan reuni, kabar beasiswa, dan dokumentasi pencapaian keluarga besar MAN 3 Sleman.
          </p>
        </div>

        {/* Client-hydrated News List */}
        <NewsListClient initialNews={newsList} />
      </Container>
    </div>
  );
}
