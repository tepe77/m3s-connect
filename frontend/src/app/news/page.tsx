import { Container } from "@/components/ui/Container";

export default function NewsPage() {
  return (
    <div className="py-8 md:py-12">
      <Container size="wide">
        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2BA8A2]">
            Warta & Informasi
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
            Kabar Berita Madrasah & Alumni
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Pemberitahuan resmi, siaran pers, dan informasi perkembangan dari civitas akademika MAN 3 Sleman.
          </p>
        </div>

        <div className="space-y-6">
          <article className="bg-white p-6 rounded-lg border border-[#E2E8F0]">
            <span className="text-xs font-bold text-[#2BA8A2] uppercase tracking-wider block mb-1">
              Kabar Alumni
            </span>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">
              Peluncuran Perdana Portal Digital M3S Connect
            </h2>
            <div className="text-xs text-[#64748B] mb-3">
              6 Oktober 2026 • Oleh Pengurus Pusat Ikatan Alumni
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Platform resmi komunikasi dan kolaborasi alumni MAN 3 Sleman resmi diluncurkan. Platform ini dibangun sebagai wadah terpadu untuk saling terhubung, berbagi informasi peluang kerja, serta mengarsipkan rekam jejak perjalanan para alumni.
            </p>
          </article>

          <article className="bg-white p-6 rounded-lg border border-[#E2E8F0]">
            <span className="text-xs font-bold text-[#2BA8A2] uppercase tracking-wider block mb-1">
              Prestasi Madrasah
            </span>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">
              Siswa MAN 3 Sleman Meraih Medali Olimpiade Sains Nasional
            </h2>
            <div className="text-xs text-[#64748B] mb-3">
              2 Oktober 2026 • Oleh Bagian Humas Madrasah
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Dukungan dan pembinaan berkelanjutan dari dewan guru serta ikatan alumni berbuah prestasi membanggakan di tingkat nasional. Siswa MAN 3 Sleman berhasil mengukir prestasi gemilang dalam ajang kompetisi sains tahun ini.
            </p>
          </article>
        </div>
      </Container>
    </div>
  );
}
