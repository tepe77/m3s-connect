import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Tentang M3S Connect | Platform Komunitas Alumni MAN 3 Sleman",
  description:
    "Mengenal visi, misi, dan nilai perjuangan platform jejaring digital alumni MAN 3 Sleman (Mayoga).",
};

export default function TentangPage() {
  return (
    <div className="py-8 md:py-16 bg-[#F8FAFC]">
      <Container size="default">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
            Profil & Visi Komunitas
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Tentang M3S Connect
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed">
            Menghubungkan ribuan langkah, menyatukan seribu cerita, dan mewujudkan satu tujuan mulia bagi almamater tercinta MAN 3 Sleman.
          </p>
        </div>

        {/* Hero image card */}
        <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] mb-12">
          <Image
            src="/images/hero-building.jpg"
            alt="Kampus MAN 3 Sleman"
            fill
            className="object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-8 text-[#334155]">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">Latar Belakang</h2>
            <p className="text-base leading-relaxed">
              Madrasah Aliyah Negeri 3 Sleman (Mayoga) telah mencetak puluhan ribu lulusan berintegritas yang kini berkiprah di berbagai penjuru nusantara hingga mancanegara. Seiring perkembangan teknologi dan kebutuhan sinergi antar generasi, platform M3S Connect dihadirkan sebagai rumah digital bersama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#0D9488] flex items-center justify-center font-bold text-lg">
                V
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Visi Komunitas</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Menjadi simpul jejaring alumni yang inklusif, terpercaya, dan berdaya guna untuk mendukung kemajuan pendidikan madrasah serta pengembangan karir alumni.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">
                M
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Misi Komunitas</h3>
              <ul className="text-sm text-[#64748B] space-y-2 list-disc list-inside">
                <li>Mempererat tali silaturahmi lintas angkatan.</li>
                <li>Menyediakan program pendampingan dan beasiswa.</li>
                <li>Mengarsipkan dokumentasi sejarah dan prestasi madrasah.</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-[#0F172A]">Ikatan Alumni MAN 3 Sleman</div>
              <div className="text-xs text-[#64748B]">Jl. Magelang Km. 4, Sinduadi, Mlati, Sleman, D.I. Yogyakarta</div>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0f766e] rounded-lg transition-colors"
            >
              Gabung Sekarang &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
