import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="py-8 md:py-12">
      <Container size="wide">
        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2BA8A2]">
            Agenda Bersama
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
            Kegiatan & Temu Alumni
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Jadwal kegiatan temu kangen, seminar pengembangan diri, bakti sosial, dan agenda silaturahmi alumni MAN 3 Sleman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] space-y-4">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-sm bg-[#2BA8A2]/10 text-[#2BA8A2]">
              Daring • Zoom Meeting
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Webinar Karir Alumni: Membangun Portofolio Global di Era Digital
            </h2>
            <div className="text-xs text-[#64748B] space-y-1">
              <p>Waktu: Minggu, 20 Oktober 2026 (19.00 - 21.00 WIB)</p>
              <p>Penyelenggara: Pengurus Komunitas Alumni</p>
              <p>Kuota: Tersedia 200 Peserta</p>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Sesi sharing bersama para alumni praktisi industri teknologi dan bisnis internasional tentang strategi karir dan etika profesional.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-md transition-colors"
              >
                Masuk untuk RSVP
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] space-y-4">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-sm bg-[#64748B]/10 text-[#64748B]">
              Luring • Kampus MAN 3 Sleman
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Temu Kangen & Silaturahmi Akbar Lintas Angkatan
            </h2>
            <div className="text-xs text-[#64748B] space-y-1">
              <p>Waktu: Desember 2026 (Tanggal dalam konfirmasi)</p>
              <p>Tempat: Kampus MAN 3 Sleman, Jl. Magelang Km. 4</p>
              <p>Status: Tahap Pembentukan Panitia</p>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Pertemuan akbar untuk mempererat tali persaudaraan antar generasi Mayoga dari angkatan pertama hingga yang termuda.
            </p>
            <div className="pt-2">
              <Link
                href="/forum"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm font-semibold text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-md transition-colors"
              >
                Ikuti Diskusi di Forum
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
