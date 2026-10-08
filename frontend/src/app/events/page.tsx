import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  isOnline: boolean;
  timeText: string;
  organizer: string;
  quotaText: string;
  coverImage?: string;
  actionText: string;
  actionHref: string;
  actionType: "primary" | "secondary";
}

const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "event-1",
    slug: "webinar-karir-alumni-membangun-portofolio-global",
    title: "Webinar Karir Alumni: Membangun Portofolio Global di Era Digital",
    description: "Sesi sharing bersama para alumni praktisi industri teknologi dan bisnis internasional tentang strategi karir dan etika profesional.",
    location: "Online (Zoom Meeting)",
    isOnline: true,
    timeText: "Minggu, 20 Oktober 2026 (19.00 - 21.00 WIB)",
    organizer: "Pengurus Komunitas Alumni",
    quotaText: "Tersedia 200 Peserta",
    coverImage: "/images/news-internasional.jpg",
    actionText: "Masuk untuk RSVP",
    actionHref: "/login",
    actionType: "primary",
  },
  {
    id: "event-2",
    slug: "temu-kangen-silaturahmi-akbar-lintas-angkatan",
    title: "Temu Kangen & Silaturahmi Akbar Lintas Angkatan",
    description: "Pertemuan akbar untuk mempererat tali persaudaraan antar generasi Mayoga dari angkatan pertama hingga yang termuda.",
    location: "Kampus MAN 3 Sleman, Jl. Magelang Km. 4",
    isOnline: false,
    timeText: "Desember 2026 (Tahap Pembentukan Panitia)",
    organizer: "Panitia Reuni Akbar",
    quotaText: "Kapasitas 1.000 Alumni",
    coverImage: "/images/news-reuni.jpg",
    actionText: "Ikuti Diskusi di Forum",
    actionHref: "/forum",
    actionType: "secondary",
  },
];

async function getEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((ev: any, idx: number) => {
          const fallback = FALLBACK_EVENTS.find((f) => f.slug === ev.slug) || FALLBACK_EVENTS[idx];
          const isOnline = ev.location ? ev.location.toLowerCase().includes("online") || ev.location.toLowerCase().includes("zoom") : fallback?.isOnline ?? false;
          return {
            id: ev.id,
            slug: ev.slug,
            title: ev.title,
            description: ev.description || fallback?.description || "",
            location: ev.location || fallback?.location || "",
            isOnline,
            timeText: fallback?.timeText || "Jadwal segera diumumkan",
            organizer: fallback?.organizer || "Ikatan Alumni MAN 3 Sleman",
            quotaText: ev.max_participants ? `Kapasitas ${ev.max_participants} Peserta` : fallback?.quotaText || "Kuota Terbuka",
            coverImage: ev.cover_image_url || fallback?.coverImage || "/images/doc-baksos.jpg",
            actionText: fallback?.actionText || "Lihat Detail",
            actionHref: fallback?.actionHref || "/forum",
            actionType: fallback?.actionType || "primary",
          };
        });
      }
    }
  } catch {}
  return FALLBACK_EVENTS;
}

export default async function EventsPage() {
  const events = await getEvents();

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
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span
                  className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md ${
                    event.isOnline
                      ? "bg-[#2BA8A2]/10 text-[#2BA8A2]"
                      : "bg-[#64748B]/10 text-[#64748B]"
                  }`}
                >
                  {event.isOnline ? "Daring • Zoom Meeting" : "Luring • Kampus MAN 3 Sleman"}
                </span>

                <h2 className="text-xl font-bold text-[#0F172A] leading-snug">
                  {event.title}
                </h2>

                <div className="text-xs text-[#64748B] space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p><span className="font-semibold text-slate-700">Waktu:</span> {event.timeText}</p>
                  <p><span className="font-semibold text-slate-700">Penyelenggara:</span> {event.organizer}</p>
                  <p><span className="font-semibold text-slate-700">Kuota:</span> {event.quotaText}</p>
                </div>

                <p className="text-sm text-[#64748B] leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="pt-2">
                {event.actionType === "primary" ? (
                  <Link
                    href={event.actionHref}
                    className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#2BA8A2] hover:bg-[#238B86] rounded-xl transition-colors shadow-xs"
                  >
                    {event.actionText}
                  </Link>
                ) : (
                  <Link
                    href={event.actionHref}
                    className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm font-semibold text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl transition-colors"
                  >
                    {event.actionText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
