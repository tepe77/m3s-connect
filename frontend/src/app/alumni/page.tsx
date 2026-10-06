import { Container } from "@/components/ui/Container";
import Link from "next/link";

const sampleAlumni = [
  {
    name: "Budi Santoso",
    year: 2018,
    class: "IPA 2",
    occupation: "Senior Backend Engineer",
    company: "Tech Nusantara",
    city: "Yogyakarta",
    bio: "Pengembangan sistem web terdistribusi dan cloud architecture.",
  },
  {
    name: "Siti Rahmawati",
    year: 2019,
    class: "IPS 1",
    occupation: "Brand Strategist",
    company: "Kreatif Media Asia",
    city: "Jakarta Selatan",
    bio: "Digital marketing dan strategi komunikasi publik untuk UMKM.",
  },
];

export default function AlumniDirectoryPage() {
  return (
    <div className="py-8 md:py-12">
      <Container size="wide">
        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2BA8A2]">
            Direktori Komunitas
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
            Pencarian Alumni MAN 3 Sleman
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Temukan rekan seangkatan, kawan sekelas, atau bangun jejaring profesional lintas generasi.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-xs font-semibold text-[#0F172A] mb-1">
              Nama atau Kata Kunci
            </label>
            <input
              id="search"
              type="text"
              placeholder="Contoh: Budi, Engineer..."
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-xs font-semibold text-[#0F172A] mb-1">
              Tahun Kelulusan
            </label>
            <select
              id="year"
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2] bg-white"
            >
              <option value="">Semua Angkatan</option>
              <option value="2018">Angkatan 2018</option>
              <option value="2019">Angkatan 2019</option>
              <option value="2020">Angkatan 2020</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-xs font-semibold text-[#0F172A] mb-1">
              Kota Domisili
            </label>
            <input
              id="city"
              type="text"
              placeholder="Contoh: Yogyakarta, Jakarta"
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="w-full min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA8A2]"
            >
              Cari Alumni
            </button>
          </div>
        </div>

        {/* Alumni List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleAlumni.map((alumni) => (
            <div
              key={alumni.name}
              className="bg-white p-6 rounded-lg border border-[#E2E8F0] flex flex-col justify-between hover:border-[#2BA8A2]/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A]">{alumni.name}</h2>
                    <p className="text-xs text-[#2BA8A2] font-semibold">
                      Lulusan {alumni.year} ({alumni.class})
                    </p>
                  </div>
                  <span className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] px-2 py-0.5 rounded-sm">
                    {alumni.city}
                  </span>
                </div>

                <div className="text-xs text-[#0F172A] font-medium">
                  {alumni.occupation} • {alumni.company}
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                  {alumni.bio}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-[#2BA8A2] hover:underline"
                >
                  Masuk untuk Melihat Kontak Lengkap
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
