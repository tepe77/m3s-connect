import { Container } from "@/components/ui/Container";

export default function ArchivePage() {
  return (
    <div className="py-8 md:py-12">
      <Container size="wide">
        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2BA8A2]">
            Dokumentasi Sejarah
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
            Arsip & Memori Mayoga
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Koleksi foto kegiatan, kenangan masa sekolah, dan buku tahunan digital dari berbagai generasi kelulusan MAN 3 Sleman.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden p-6 space-y-3">
            <span className="text-xs font-semibold text-[#2BA8A2] uppercase">Album Dokumentasi</span>
            <h2 className="text-lg font-bold text-[#0F172A]">Reuni Lintas Dekade 2024</h2>
            <p className="text-xs text-[#64748B]">Dokumentasi temu kangen alumni angkatan 1990 hingga 2020 di Gedung Olahraga Mayoga.</p>
            <div className="text-xs text-[#64748B] font-medium pt-2">42 Foto Terarsip</div>
          </div>

          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden p-6 space-y-3">
            <span className="text-xs font-semibold text-[#2BA8A2] uppercase">Album Dokumentasi</span>
            <h2 className="text-lg font-bold text-[#0F172A]">Bakti Sosial Ramadan 1445 H</h2>
            <p className="text-xs text-[#64748B]">Penyaluran beasiswa santunan dan paket sembako untuk masyarakat di sekitar madrasah.</p>
            <div className="text-xs text-[#64748B] font-medium pt-2">28 Foto Terarsip</div>
          </div>

          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden p-6 space-y-3">
            <span className="text-xs font-semibold text-[#2BA8A2] uppercase">Buku Kenangan</span>
            <h2 className="text-lg font-bold text-[#0F172A]">Kilas Balik Angkatan 2018</h2>
            <p className="text-xs text-[#64748B]">Arsip profil wisudawan dan guru pengampu kelas IPA dan IPS angkatan 2018.</p>
            <div className="text-xs text-[#64748B] font-medium pt-2">Buku Tahunan Digital</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
