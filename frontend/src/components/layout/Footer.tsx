import Link from "next/link";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] mt-auto">
      <Container size="wide" className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2BA8A2] text-white font-bold text-lg">
                M3S
              </div>
              <div>
                <span className="text-base font-bold text-[#0F172A] block leading-tight">
                  M3S Connect
                </span>
                <span className="text-xs text-[#64748B] font-medium block">
                  Komunitas Alumni MAN 3 Sleman (Mayoga)
                </span>
              </div>
            </div>

            <p className="text-sm text-[#64748B] max-w-md leading-relaxed">
              Platform jejaring dan kolaborasi resmi alumni Madrasah Aliyah Negeri 3 Sleman.
              Menghubungkan lintas angkatan, mendukung perkembangan karir, dan merawat rekam jejak sejarah madrasah.
            </p>

            <div className="text-xs text-[#64748B] space-y-1">
              <p>Kampus: Jl. Magelang Km. 4, Sinduadi, Mlati, Sleman, D.I. Yogyakarta</p>
              <p className="italic font-medium text-[#2BA8A2]">
                Connect. Share. Grow. Remember.
              </p>
            </div>
          </div>

          {/* Navigasi Layanan Komunitas */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-[#0F172A]">
              Eksplorasi
            </h2>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <Link href="/alumni" className="hover:text-[#2BA8A2] transition-colors focus-visible:ring-1 focus-visible:ring-[#2BA8A2] rounded-sm">
                  Direktori Alumni
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-[#2BA8A2] transition-colors focus-visible:ring-1 focus-visible:ring-[#2BA8A2] rounded-sm">
                  Forum Diskusi
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-[#2BA8A2] transition-colors focus-visible:ring-1 focus-visible:ring-[#2BA8A2] rounded-sm">
                  Kisah dan Jejak Alumni
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#2BA8A2] transition-colors focus-visible:ring-1 focus-visible:ring-[#2BA8A2] rounded-sm">
                  Agenda dan Reuni
                </Link>
              </li>
              <li>
                <Link href="/archive" className="hover:text-[#2BA8A2] transition-colors focus-visible:ring-1 focus-visible:ring-[#2BA8A2] rounded-sm">
                  Arsip Dokumentasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Partisipasi & Bantuan */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-[#0F172A]">
              Komunitas
            </h2>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <Link href="/register" className="hover:text-[#2BA8A2] transition-colors focus-visible:ring-1 focus-visible:ring-[#2BA8A2] rounded-sm">
                  Pendaftaran Alumni
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#2BA8A2] transition-colors focus-visible:ring-1 focus-visible:ring-[#2BA8A2] rounded-sm">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#2BA8A2] transition-colors focus-visible:ring-1 focus-visible:ring-[#2BA8A2] rounded-sm">
                  Kabar Berita
                </Link>
              </li>
              <li>
                <span className="text-xs text-[#64748B] block mt-4">
                  Hubungi Pengurus:
                  <br />
                  <a href="mailto:alumni@m3s-connect.id" className="text-[#2BA8A2] hover:underline">
                    alumni@m3s-connect.id
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} M3S Connect. Komunitas Alumni MAN 3 Sleman.</p>
          <p className="text-right">
            Dibangun dengan dedikasi untuk silaturahmi madrasah.
          </p>
        </div>
      </Container>
    </footer>
  );
}
