import Image from "next/image";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Dokumentasi & Galeri Kegiatan | M3S Connect",
  description: "Koleksi foto kegiatan, kenangan masa sekolah, dan buku tahunan digital dari berbagai generasi kelulusan MAN 3 Sleman.",
};

const ALBUMS = [
  {
    id: "album-1",
    title: "Reuni Akbar 2025",
    date: "12 Mei 2025",
    count: "128 Foto",
    category: "Reuni & Temu Kangen",
    image: "/images/news-reuni.jpg",
    description: "Dokumentasi kemeriahan temu kangen alumni lintas angkatan yang berlangsung di halaman kampus MAN 3 Sleman.",
  },
  {
    id: "album-2",
    title: "Kegiatan Bakti Sosial & Penyaluran Donasi",
    date: "20 April 2025",
    count: "45 Foto",
    category: "Sosial & Pengabdian",
    image: "/images/doc-baksos.jpg",
    description: "Aksi nyata kepedulian alumni dalam bakti sosial dan bantuan pendidikan untuk warga sekitar Sleman.",
  },
  {
    id: "album-3",
    title: "Wisuda & Pelepasan Siswa Kelas XII",
    date: "15 Juni 2024",
    count: "84 Foto",
    category: "Seremoni Madrasah",
    image: "/images/doc-wisuda.jpg",
    description: "Momen bersejarah pelepasan wisudawan dan peresmian bergabungnya angkatan baru ke dalam keluarga besar alumni.",
  },
];

export default function ArchivePage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALBUMS.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col"
            >
              <div className="relative aspect-16/10 w-full bg-slate-100">
                <Image
                  src={album.image}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{album.count}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="font-semibold text-[#0D9488]">{album.category}</span>
                    <span>{album.date}</span>
                  </div>
                  <h2 className="text-base font-bold text-[#0F172A] leading-snug">
                    {album.title}
                  </h2>
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                    {album.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
