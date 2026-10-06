import { Container } from "@/components/ui/Container";

export default function StoriesPage() {
  return (
    <div className="py-8 md:py-12">
      <Container size="wide">
        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2BA8A2]">
            Jejak & Inspirasi
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
            Kisah Perjalanan Alumni
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Kumpulan catatan pengalaman, dinamika profesi, dan kontribusi alumni MAN 3 Sleman di berbagai bidang kehidupan.
          </p>
        </div>

        <div className="space-y-8">
          <article className="bg-white p-8 rounded-xl border border-[#E2E8F0] space-y-4">
            <div className="text-xs font-semibold text-[#2BA8A2] uppercase tracking-wider">
              Sorotan Profil
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
              Dari Bangku Mayoga Menuju Panggung Rekayasa Perangkat Lunak Skala Internasional
            </h2>
            <div className="text-xs text-[#64748B] font-medium">
              Ditulis oleh Budi Santoso (Angkatan 2018, IPA 2) • 6 Oktober 2026
            </div>
            <p className="text-sm md:text-base text-[#64748B] leading-relaxed">
              Masa studi di MAN 3 Sleman memberikan lebih dari sekadar pemahaman rumus dan teori sains. Ekosistem madrasah yang menekankan integritas, kedisiplinan riset, dan kepekaan sosial menjadi bekal berharga saat melangkah ke bangku perguruan tinggi dan berkarir di industri komputasi terdistribusi internasional.
            </p>
          </article>

          <article className="bg-white p-8 rounded-xl border border-[#E2E8F0] space-y-4">
            <div className="text-xs font-semibold text-[#2BA8A2] uppercase tracking-wider">
              Kewirausahaan
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
              Membangun Agensi Komunikasi Digital yang Berdayakan Pelaku Usaha Lokal
            </h2>
            <div className="text-xs text-[#64748B] font-medium">
              Ditulis oleh Siti Rahmawati (Angkatan 2019, IPS 1) • 1 Oktober 2026
            </div>
            <p className="text-sm md:text-base text-[#64748B] leading-relaxed">
              Perjalanan merintis agensi kreatif digital untuk membantu pemasaran produk usaha mikro dan menengah di Yogyakarta dan sekitarnya. Pengalaman organisasi di Mayoga menjadi pondasi kepemimpinan dan manajemen tim lintas divisi.
            </p>
          </article>
        </div>
      </Container>
    </div>
  );
}
