import { Container } from "@/components/ui/Container";
import Link from "next/link";

const categories = [
  { name: "Diskusi Umum", desc: "Obrolan santai dan kabar lintas alumni", count: 24 },
  { name: "Karir & Profesi", desc: "Peluang kerja, magang, dan konsultasi karir", count: 18 },
  { name: "Kegiatan & Reuni", desc: "Rencana silaturahmi akbar dan agenda bakti", count: 9 },
];

export default function ForumPage() {
  return (
    <div className="py-8 md:py-12">
      <Container size="wide">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#2BA8A2]">
              Ruang Komunikasi
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
              Forum Diskusi Alumni
            </h1>
            <p className="text-base text-[#64748B] mt-1">
              Wadah interaksi, berbagi pengalaman, dan mendiskusikan berbagai topik seputar alumni.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-md transition-colors shrink-0"
          >
            Buat Topik Baru
          </Link>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white p-5 rounded-lg border border-[#E2E8F0] space-y-2"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0F172A]">{cat.name}</h2>
                <span className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-sm text-[#64748B]">
                  {cat.count} Topik
                </span>
              </div>
              <p className="text-xs text-[#64748B]">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Active Threads List */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] divide-y divide-[#E2E8F0]">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-sm bg-[#2BA8A2]/10 text-[#2BA8A2]">
                Kegiatan & Reuni
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">
                Rencana Reuni Akbar Lintas Angkatan MAN 3 Sleman 2026
              </h3>
              <p className="text-xs text-[#64748B]">
                Diposting oleh Budi Santoso (2018) • 12 balasan • Terakhir diperbarui 1 jam lalu
              </p>
            </div>
            <Link
              href="/login"
              className="text-xs font-semibold text-[#2BA8A2] hover:underline shrink-0"
            >
              Buka Topik
            </Link>
          </div>

          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-sm bg-[#2BA8A2]/10 text-[#2BA8A2]">
                Karir & Profesi
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">
                Lowongan Magang Software Engineer dan Product Specialist untuk Mahasiswa
              </h3>
              <p className="text-xs text-[#64748B]">
                Diposting oleh Siti Rahmawati (2019) • 8 balasan • Terakhir diperbarui 3 jam lalu
              </p>
            </div>
            <Link
              href="/login"
              className="text-xs font-semibold text-[#2BA8A2] hover:underline shrink-0"
            >
              Buka Topik
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
