import { Container } from "@/components/ui/Container";
import { StoriesView, StoryItem } from "@/components/stories/StoriesView";
import { API_BASE_URL, getAssetUrl } from "@/lib/api";

export const metadata = {
  title: "Riwayat & Kisah Alumni | IKAMAYOGA",
  description:
    "Kumpulan catatan perjalanan, rekam jejak dedikasi, dan dinamika profesi alumni MAN 3 Sleman di berbagai bidang kehidupan.",
};

const FALLBACK_STORIES: StoryItem[] = [
  {
    id: "story-1",
    slug: "dari-mayoga-menuju-rekayasa-komputasi-global",
    title: "Dari Bangku Laboratorium Mayoga Menuju Rekayasa Komputasi Terdistribusi Skala Global",
    author_name: "Budi Santoso, S.Kom.",
    author_avatar: "/images/avatar-ahmad.jpg",
    display_author: "Budi Santoso, S.Kom.",
    display_avatar: "/images/avatar-ahmad.jpg",
    graduation_year: "2018 (IPA 2)",
    profession: "Senior Infrastructure Engineer",
    company: "Global Cloud Technologies",
    display_role: "Senior Infrastructure Engineer di Global Cloud Technologies",
    category: "Teknologi & Rekayasa",
    excerpt:
      "Nilai ketekunan, integritas madrasah, dan bimbingan guru sains di Mayoga menjadi bekal kokoh saat menghadapi kompleksitas arsitektur komputasi awan skala dunia.",
    content:
      "<p>Masa studi di MAN 3 Sleman memberikan lebih dari sekadar pemahaman rumus dan teori sains. Ekosistem madrasah yang menekankan integritas, kedisiplinan riset, dan kepekaan sosial menjadi bekal berharga saat melangkah ke bangku perguruan tinggi negeri dan berkarir di industri komputasi terdistribusi.</p><h3>Menemukan Minat di Laboratorium Komputer Madrasah</h3><p>Ingatan saya selalu kembali ke ruang laboratorium sains dan komputer Mayoga. Di sana, guru pembimbing memberikan keleluasaan bereksplorasi di luar jam pelajaran resmi. Dari eksperimen kecil membangun logika algoritma sederhana, tumbuh rasa ingin tahu mendalam tentang bagaimana sistem informasi dapat menghubungkan jutaan manusia secara andal.</p><blockquote>\"Pendidikan madrasah mengajarkan bahwa keunggulan teknis harus selalu dibersamai dengan ketulusan niat dan etika moral dalam memecahkan masalah masyarakat.\"</blockquote><h3>Menembus Panggung Karir Internasional</h3><p>Saat melanjutkan studi ilmu komputer dan kini bekerja menangani keandalan infrastruktur cloud lintas benua, nilai-nilai disiplin belajar dan kerja sama tim yang dipupuk selama aktif di organisasi kesiswaan Mayoga terbukti menjadi fondasi paling tangguh.</p><p>Kepada adik-adik santri dan siswa Mayoga, jangan pernah ragu bermimpi besar. Fasilitas terbaik yang kita miliki adalah kesungguhan belajar dan doa restu para guru kita.</p>",
    cover_image: "/images/news-internasional.jpg",
    cover_image_url: "/images/news-internasional.jpg",
    reading_time: 5,
    is_featured: true,
    published_at: "2026-10-04T08:00:00Z",
  },
  {
    id: "story-2",
    slug: "dedikasi-kesehatan-anak-dan-pengabdian-medis",
    title: "Dedikasi Pelayanan Kesehatan Anak dan Pengabdian Medis Lintas Daerah",
    author_name: "dr. Siti Nurhaliza, Sp.A",
    author_avatar: "/images/avatar-siti.jpg",
    display_author: "dr. Siti Nurhaliza, Sp.A",
    display_avatar: "/images/avatar-siti.jpg",
    graduation_year: "2014 (IPA 1)",
    profession: "Dokter Spesialis Anak",
    company: "RSUP Dr. Sardjito Yogyakarta",
    display_role: "Dokter Spesialis Anak di RSUP Dr. Sardjito Yogyakarta",
    category: "Kesehatan & Medis",
    excerpt:
      "Pendidikan empati dan kepedulian sosial selama di Mayoga membentuk tekad untuk tidak hanya mengobati penyakit fisik anak, namun juga menguatkan harapan keluarga mereka.",
    content:
      "<p>Dunia kedokteran anak menuntut ketelitian sains medis sekaligus kelembutan hati. Dua hal tersebut saya rasakan betul akarnya tertanam sejak masa-masa menimba ilmu di lingkungan madrasah tercinta, MAN 3 Sleman.</p><h3>Kultur Peduli Sesama yang Berakar Kuat</h3><p>Program bakti sosial dan aksi kemanusiaan yang rutin diadakan di Mayoga memberikan pengalaman nyata bersentuhan langsung dengan denyut nadi masyarakat. Pengalaman ini menyadarkan saya bahwa ilmu yang kita pelajari tidak bermakna tanpa kesediaan untuk hadir melayani sesama yang paling membutuhkan pertolongan.</p><p>Perjalanan menempuh pendidikan dokter spesialis tentu penuh tantangan fisik dan mental. Namun doa para asatidz dan kebiasaan menjaga shalat berjamaah di masjid madrasah menjadi jangkar ketenangan dalam situasi-situasi kritis di ruang gawat darurat anak.</p>",
    cover_image: "/images/news-beasiswa.jpg",
    cover_image_url: "/images/news-beasiswa.jpg",
    reading_time: 4,
    is_featured: false,
    published_at: "2026-09-27T08:00:00Z",
  },
  {
    id: "story-3",
    slug: "mengembangkan-agensi-kreatif-kewirausahaan-lokal",
    title: "Mengembangkan Agensi Kreatif dan Ekosistem Kewirausahaan Lokal Berdaya Saing",
    author_name: "Rina Wijayanti, S.E.",
    author_avatar: "/images/avatar-rina.jpg",
    display_author: "Rina Wijayanti, S.E.",
    display_avatar: "/images/avatar-rina.jpg",
    graduation_year: "2019 (IPS 1)",
    profession: "Founder & Creative Director",
    company: "Naratif Digital Nusantara",
    display_role: "Founder & Creative Director di Naratif Digital Nusantara",
    category: "Bisnis & Wirausaha",
    excerpt:
      "Membangun usaha di industri kreatif Yogyakarta dengan misi memberdayakan puluhan pelaku UMKM lokal agar mandiri bersaing di ranah pemasaran digital.",
    content:
      "<p>Memulai langkah di industri kreatif digital membutuhkan kombinasi keberanian mengambil risiko dan pemahaman dinamika komunikasi pasar. Jiwa kepemimpinan dan komunikasi publik saya terasah ketika aktif mengelola kepengurusan OSIS dan kegiatan ekstrakurikuler di Mayoga.</p><h3>Menghubungkan Tradisi dan Modernitas</h3><p>Yogyakarta kaya akan produk kriya dan pangan warisan tradisi. Bersama tim yang sebagian besar juga pemuda daerah, kami membantu ratusan pelaku usaha mikro mengemas cerita produk mereka ke dalam visual sinematik dan strategi media sosial yang efektif.</p><p>Mayoga mengajarkan kami untuk tidak sekadar menjadi pencari kerja, tetapi berani menjadi pembuka jalan rezeki bagi orang lain.</p>",
    cover_image: "/images/doc-baksos.jpg",
    cover_image_url: "/images/doc-baksos.jpg",
    reading_time: 4,
    is_featured: false,
    published_at: "2026-09-21T08:00:00Z",
  },
  {
    id: "story-4",
    slug: "meneliti-material-berkelanjutan-sains-riset",
    title: "Meneliti Material Berkelanjutan: Dari Laboratorium Madrasah Menuju Publikasi Internasional",
    author_name: "Dr. Arif Rahman Hakim, M.Sc.",
    author_avatar: "/images/avatar-ahmad.jpg",
    display_author: "Dr. Arif Rahman Hakim, M.Sc.",
    display_avatar: "/images/avatar-ahmad.jpg",
    graduation_year: "2012 (IPA 3)",
    profession: "Peneliti Pascadoktoral Energi Bersih",
    company: "Pusat Riset Material Maju",
    display_role: "Peneliti Pascadoktoral Energi Bersih di Pusat Riset Material Maju",
    category: "Akademisi & Riset",
    excerpt:
      "Menghadirkan bukti bahwa santri dan pelajar madrasah memiliki kapasitas intelektual tangguh untuk berkontribusi nyata pada krisis iklim global melalui riset ilmiah.",
    content:
      "<p>Fokus penelitian saya saat ini terpusat pada pengembangan material ramah lingkungan untuk penyimpanan energi matahari. Banyak kolega asing bertanya dari mana ketertarikan awal saya bermula. Jawaban saya sederhana: dari bimbingan karya ilmiah remaja (KIR) di MAN 3 Sleman.</p><h3>Tradisi Intelektual Madrasah</h3><p>Di Mayoga, kami dibiasakan membaca literatur kritis, menyusun hipotesis, dan mempresentasikan temuan dengan argumen logis. Madrasah tidak pernah membatasi pemikiran sains; justru memadukannya dengan filosofi adab dan tanggung jawab terhadap kelestarian alam semesta.</p>",
    cover_image: "/images/news-peluncuran.jpg",
    cover_image_url: "/images/news-peluncuran.jpg",
    reading_time: 6,
    is_featured: false,
    published_at: "2026-09-14T08:00:00Z",
  },
];

const DEFAULT_CATEGORIES = [
  "Teknologi & Rekayasa",
  "Kesehatan & Medis",
  "Bisnis & Wirausaha",
  "Akademisi & Riset",
];

async function getStoriesData(): Promise<{ stories: StoryItem[]; categories: string[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/stories`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
        const mappedStories: StoryItem[] = json.data.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          cover_image: item.cover_image,
          cover_image_url: getAssetUrl(item.cover_image_url || item.cover_image || "/images/news-internasional.jpg"),
          author_name: item.author_name,
          author_avatar: item.author_avatar,
          display_author: item.display_author || item.author_name || item.author?.name || "Alumni Mayoga",
          display_avatar: getAssetUrl(item.display_avatar || item.author_avatar || "/images/avatar-ahmad.jpg"),
          graduation_year: item.graduation_year,
          profession: item.profession,
          company: item.company,
          display_role: item.display_role || `${item.profession || "Alumni"} di ${item.company || "MAN 3 Sleman"}`,
          category: item.category || "Inspirasi Alumni",
          reading_time: item.reading_time || 4,
          is_featured: Boolean(item.is_featured),
          published_at: item.published_at,
        }));

        const categories = Array.isArray(json.categories) && json.categories.length > 0
          ? json.categories
          : DEFAULT_CATEGORIES;

        return {
          stories: mappedStories,
          categories,
        };
      }
    }
  } catch (err) {
    // Fallback if API is offline
  }

  return {
    stories: FALLBACK_STORIES,
    categories: DEFAULT_CATEGORIES,
  };
}

export default async function StoriesPage() {
  const { stories, categories } = await getStoriesData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <Container size="wide">
        <StoriesView initialStories={stories} categories={categories} />
      </Container>
    </div>
  );
}
