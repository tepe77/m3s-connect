import Link from "next/link";
import { HeroAurora } from "@/components/velora/hero-aurora";
import { FeaturesIconGrid } from "@/components/velora/features-icon-grid";
import { HomeForumThreads } from "@/components/home/HomeForumThreads";
import { HomeDocumentationSection } from "@/components/home/HomeDocumentationSection";
import { HomeTestimonialsMarquee } from "@/components/home/HomeTestimonialsMarquee";
import { NewsItem } from "@/data/newsData";
import { AlumniItem } from "@/data/alumniData";
import { HomeAlumniCarousel } from "@/components/home/HomeAlumniCarousel";
import { HomeNewsSection } from "@/components/home/HomeNewsSection";
import { HomeCtaBanner } from "@/components/home/HomeCtaBanner";
import { API_BASE_URL, getAssetUrl } from "@/lib/api";

function resolveNewsImage(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return getAssetUrl(url);
}

function resolveAvatarImage(avatar: string | undefined | null, name: string): string {
  if (avatar) {
    const match = avatar.match(/(avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
    if (match) return `/images/${match[0]}`;
    return getAssetUrl(avatar);
  }
  const n = (name || "").toLowerCase();
  if (n.includes("siti")) return "/images/avatar-siti.jpg";
  if (n.includes("rina")) return "/images/avatar-rina.jpg";
  if (n.includes("budi")) return "/images/avatar-budi.jpg";
  if (n.includes("farhan")) return "/images/avatar-farhan.jpg";
  if (n.includes("nurul")) return "/images/avatar-nurul.jpg";
  return "/images/avatar-ahmad.jpg";
}

async function getHomeNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/news?per_page=4`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.data || json?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any) => ({
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
            avatar: resolveNewsImage(item.author?.avatar_url || item.author?.avatar, "/images/avatar-ahmad.jpg"),
          },
          thumbnail: resolveNewsImage(item.cover_image, "/images/news-reuni.jpg"),
          contentImages: [],
          contentHtml: [],
          comments: [],
        }));
      }
    }
  } catch {}
  return [];
}

async function getHomeAlumni(): Promise<AlumniItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/alumni?featured=true&per_page=6`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.data || json?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          name: item.user?.name || item.name || "Alumni Terdaftar",
          email: item.user?.email || "",
          avatar: resolveAvatarImage(item.avatar_url || item.user?.avatar_url || item.user?.avatar, item.user?.name || item.name),
          graduationYear: item.graduation_year || 2015,
          graduationClass: item.graduation_class || "",
          alumniIdentifier: item.alumni_identifier || item.nis || "",
          isVerified: Boolean(item.is_verified || item.verified_at),
          occupation: item.profession || item.occupation || "Alumni Terdaftar",
          company: item.company || "",
          city: item.city || "",
          country: item.country || "Indonesia",
          bio: item.bio || "",
          skills: Array.isArray(item.skills) ? item.skills : [],
          socialLinks: [],
        }));
      }
    }
  } catch {}
  return [];
}

export default async function HomePage() {
  const [newsList, alumniList] = await Promise.all([
    getHomeNews(),
    getHomeAlumni(),
  ]);


  return (
    <div className="flex flex-col pb-16 bg-[#F8FAFC]">
      {/* 1. Hero Section with Boundary-Overlapping Social Proof */}
      <HeroAurora />

      {/* Main Content Sections with top spacing for floating Social Proof card */}
      <div className="pt-16 sm:pt-20 flex flex-col gap-12 sm:gap-16">
        {/* 2. Velora Features Icon Grid */}
        <FeaturesIconGrid />


      {/* 3. Section Row 1: Berita Terbaru (Left) & Alumni Pilihan (Right) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Berita Terbaru (~58% width: 7 cols) with client-side fallback */}
          <HomeNewsSection initialNews={newsList} />

          {/* Right Column: Alumni Pilihan Carousel (~42% width: 5 cols) with client-side fallback */}
          <div className="lg:col-span-5 flex flex-col">
            <HomeAlumniCarousel alumniList={alumniList} />
          </div>
        </div>
      </section>

      {/* 4. Section Row 2: Forum Diskusi Terbaru (Left) & Dokumentasi Terbaru (Right) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Forum Diskusi Terbaru (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Forum Diskusi Terbaru</h2>
              <Link
                href="/forum"
                className="text-xs font-semibold text-[#0D9488] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* 4 Forum Threads List */}
            <HomeForumThreads />
          </div>

          {/* Right Column: Dokumentasi Terbaru (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Dokumentasi Terbaru</h2>
              <Link
                href="/archive"
                className="text-xs font-semibold text-[#0D9488] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Velora UI Apple Cards Carousel */}
            <HomeDocumentationSection />
          </div>
        </div>
      </section>

      {/* 5. Testimonial Marquee (Velora UI Component) */}
      <HomeTestimonialsMarquee />

      {/* 6. Call To Action Banner */}
      <HomeCtaBanner />
      </div>
    </div>
  );
}
