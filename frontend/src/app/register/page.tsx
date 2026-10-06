import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="narrow">
        <div className="bg-white p-8 md:p-10 rounded-xl border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-[#0F172A]">Bergabung ke M3S Connect</h1>
            <p className="text-sm text-[#64748B]">
              Lengkapi data berikut untuk mendaftarkan akun komunitas alumni MAN 3 Sleman Anda.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[#0F172A] mb-1">
                Nama Lengkap Sesuai Ijazah
              </label>
              <input
                id="name"
                type="text"
                placeholder="Contoh: Budi Santoso"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#0F172A] mb-1">
                Alamat Email Aktif
              </label>
              <input
                id="email"
                type="email"
                placeholder="budi@example.com"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#0F172A] mb-1">
                Kata Sandi (Minimal 8 karakter)
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
              />
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-xs font-semibold text-[#0F172A] mb-1">
                Konfirmasi Kata Sandi
              </label>
              <input
                id="password_confirmation"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-4 py-2.5 text-sm font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2] focus-visible:ring-offset-2"
            >
              Daftar Komunitas Alumni
            </button>
          </form>

          <div className="text-center text-xs text-[#64748B] pt-4 border-t border-[#E2E8F0]">
            Sudah memiliki akun terdaftar?{" "}
            <Link href="/login" className="font-semibold text-[#2BA8A2] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
