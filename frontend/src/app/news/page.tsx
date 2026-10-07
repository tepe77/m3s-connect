import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { NEWS_ITEMS, NewsItem } from "@/data/newsData";

function resolveImageUrl(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return url;
}

async function getNewsList(): Promise<NewsItem[]> {
  try {
    const res = await fetch("http://localhost:8000/api/v1/news", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any) => {
          const fallback = NEWS_ITEMS.find((n) => n.slug === item.slug);
          return {
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt || fallback?.excerpt || "",
            category: {
              name: item.category?.parent?.name || item.category?.name || fallback?.category?.name || "Berita",
              slug: item.category?.parent?.slug || item.category?.slug || fallback?.category?.slug || "berita",
            },
            subCategory: {
              name: item.category?.parent ? item.category?.name : (fallback?.subCategory?.name || ""),
              slug: item.category?.parent ? item.category?.slug : (fallback?.subCategory?.slug || ""),
            },
            tags: Array.isArray(item.tags) ? item.tags : (fallback?.tags || []),
            publishedAt: fallback?.publishedAt || (item.published_at ? new Date(item.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""),
            readTime: fallback?.readTime || "4 menit baca",
            author: {
              name: item.author?.name || fallback?.author?.name || "Redaksi M3S Connect",
              role: fallback?.author?.role || "Divisi Publikasi",
              avatar: resolveImageUrl(item.author?.avatar_url || item.author?.avatar, fallback?.author?.avatar || "/images/avatar-ahmad.jpg"),
            },
            thumbnail: resolveImageUrl(item.cover_image_url || item.cover_image, fallback?.thumbnail || "/images/news-reuni.jpg"),
            contentImages: fallback?.contentImages || [],
            contentHtml: fallback?.contentHtml || [item.content],
            comments: fallback?.comments || [],
          };
        });
      }
    }
  } catch {}
  return NEWS_ITEMS;
}

export default async function NewsIndexPage() {
  const newsList = await getNewsList();
  const featured = newsList[0];
  const rest = newsList.slice(1);

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

        {/* Featured Big News */}
        {featured && (
          <div className="mb-12 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] bg-slate-100">
                <Image
                  src={featured.thumbnail}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
                      {featured.category.name}
                    </span>
                    <span className="text-xs text-[#64748B]">
                      Sub: {featured.subCategory.name}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug hover:text-[#0D9488] transition-colors">
                    <Link href={`/news/${featured.slug}`}>
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E2E8F0] mt-6 flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <span>{featured.publishedAt}</span>
                    <span>•</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <Link
                    href={`/news/${featured.slug}`}
                    className="inline-flex items-center font-bold text-[#0D9488] hover:text-[#0f766e]"
                  >
                    Baca Lengkap &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Other Articles */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0F172A]">Daftar Berita Lainnya</h2>
          <span className="text-xs text-[#64748B] font-medium">
            Menampilkan {NEWS_ITEMS.length} Artikel
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col"
            >
              <div className="relative aspect-16/10 w-full bg-slate-100">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 font-semibold rounded-full bg-emerald-50 text-[#0D9488]">
                      {item.category.name}
                    </span>
                    <span className="text-[#94A3B8]">•</span>
                    <span className="text-[#64748B]">{item.publishedAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] leading-snug line-clamp-2 hover:text-[#0D9488] transition-colors">
                    <Link href={`/news/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{item.comments.length} Komentar</span>
                  </div>

                  <Link
                    href={`/news/${item.slug}`}
                    className="font-semibold text-[#0D9488] hover:underline"
                  >
                    Selengkapnya &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
