import { Container } from "@/components/ui/Container";
import { ArchiveGalleryView, AlbumItem } from "@/components/archive/ArchiveGalleryView";
import { API_BASE_URL, getAssetUrl } from "@/lib/api";

export const metadata = {
  title: "Dokumentasi & Galeri Kegiatan | M3S Connect",
  description: "Koleksi foto kegiatan, kenangan masa sekolah, dan buku tahunan digital dari berbagai generasi kelulusan MAN 3 Sleman.",
};

const FALLBACK_ALBUMS: AlbumItem[] = [
  {
    id: "album-1",
    slug: "reuni-akbar-2025",
    title: "Reuni Akbar 2025",
    date: "12 Mei 2025",
    count: "128 Foto",
    category: "Reuni & Temu Kangen",
    image: "/images/news-reuni.jpg",
    description: "Dokumentasi kemeriahan temu kangen alumni lintas angkatan yang berlangsung di halaman kampus MAN 3 Sleman.",
    photos: [
      "/images/news-reuni.jpg",
      "/images/hero-building.jpg",
      "/images/hero-man3-sleman.jpg",
      "/images/news-peluncuran.jpg",
    ],
  },
  {
    id: "album-2",
    slug: "kegiatan-bakti-sosial-penyaluran-donasi",
    title: "Kegiatan Bakti Sosial & Penyaluran Donasi",
    date: "20 April 2025",
    count: "45 Foto",
    category: "Sosial & Pengabdian",
    image: "/images/doc-baksos.jpg",
    description: "Aksi nyata kepedulian alumni dalam bakti sosial dan bantuan pendidikan untuk warga sekitar Sleman.",
    photos: [
      "/images/doc-baksos.jpg",
      "/images/news-beasiswa.jpg",
    ],
  },
  {
    id: "album-3",
    slug: "wisuda-pelepasan-siswa-kelas-xii",
    title: "Wisuda & Pelepasan Siswa Kelas XII",
    date: "15 Juni 2024",
    count: "84 Foto",
    category: "Seremoni Madrasah",
    image: "/images/doc-wisuda.jpg",
    description: "Momen bersejarah pelepasan wisudawan dan peresmian bergabungnya angkatan baru ke dalam keluarga besar alumni.",
    photos: [
      "/images/doc-wisuda.jpg",
      "/images/news-internasional.jpg",
    ],
  },
];

function resolveImageUrl(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+|hero-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return getAssetUrl(url);
}

async function getDocumentations(): Promise<AlbumItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/documentations`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.data || json?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any, idx: number) => {
          const fallback = FALLBACK_ALBUMS[idx] || FALLBACK_ALBUMS[0];
          const dateFormatted = item.event_date
            ? new Date(item.event_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : fallback.date;

          const totalPhotos = item.photo_count
            ? `${item.photo_count} Foto`
            : item.photos?.length
            ? `${item.photos.length} Foto`
            : fallback.count;

          const rawPhotos: string[] = Array.isArray(item.photo_urls) && item.photo_urls.length > 0
            ? item.photo_urls
            : Array.isArray(item.photos) && item.photos.length > 0
            ? item.photos
            : fallback.photos;

          const resolvedPhotos = rawPhotos.map((p) => resolveImageUrl(p, fallback.image));

          return {
            id: item.id || fallback.id,
            slug: item.slug || fallback.slug,
            title: item.title || fallback.title,
            date: dateFormatted,
            count: totalPhotos,
            category: item.category || fallback.category,
            image: resolveImageUrl(item.cover_image_url || item.cover_image, fallback.image),
            description: item.description || fallback.description,
            photos: resolvedPhotos,
          };
        });
      }
    }
  } catch {}

  return FALLBACK_ALBUMS;
}

export default async function ArchivePage() {
  const albums = await getDocumentations();

  return (
    <div className="py-8 md:py-12 bg-[#F8FAFC]">
      <Container size="wide">
        <div className="space-y-3 mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
            Galeri & Dokumentasi Kegiatan
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Arsip & Memori Mayoga
          </h1>
          <p className="text-sm md:text-base text-[#64748B] max-w-2xl leading-relaxed">
            Koleksi foto kegiatan, kenangan masa sekolah, dan album digital dari berbagai generasi kelulusan MAN 3 Sleman.
          </p>
        </div>

        <ArchiveGalleryView initialAlbums={albums} />
      </Container>
    </div>
  );
}
