import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EventRsvpWidget } from "@/components/events/EventRsvpWidget";
import {
  fetchEventDetail,
  formatEventDate,
  formatEventTimeRange,
  isOnlineEvent,
} from "@/data/eventData";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Building2,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventDetail(slug);

  if (!event) {
    return {
      title: "Agenda Tidak Ditemukan | IKAMAYOGA",
    };
  }

  return {
    title: `${event.title} | Agenda & Reuni Alumni MAN 3 Sleman`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: [event.cover_image_url || "/images/doc-baksos.jpg"],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await fetchEventDetail(slug);

  if (!event) {
    notFound();
  }

  const isOnline = isOnlineEvent(event.location);
  const dateStr = formatEventDate(event.start_at);
  const timeRange = formatEventTimeRange(event.start_at, event.end_at);
  const regDeadlineStr = event.registration_end_at ? formatEventDate(event.registration_end_at) : null;

  return (
    <div className="py-8 md:py-12 bg-slate-50/70 min-h-screen">
      <Container size="wide">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-emerald-800 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="size-3 text-slate-400 shrink-0" />
          <Link href="/events" className="hover:text-emerald-800 transition-colors">
            Agenda & Reuni
          </Link>
          <ChevronRight className="size-3 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-semibold truncate max-w-xs md:max-w-md">
            {event.title}
          </span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Semua Agenda</span>
          </Link>
        </div>

        {/* Main Grid: 8 cols Editorial Left, 4 cols Sticky Ticket Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Event Hero & Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Banner Cover Image */}
            <div className="relative h-72 md:h-[420px] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-xs">
              <Image
                src={event.cover_image_url || "/images/doc-baksos.jpg"}
                alt={event.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

              {/* Badges on Banner */}
              <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl shadow-md text-white ${
                    isOnline
                      ? "bg-blue-600/95 backdrop-blur-md"
                      : "bg-emerald-700/95 backdrop-blur-md"
                  }`}
                >
                  {isOnline ? (
                    <>
                      <Video className="size-3.5" /> Daring • Zoom Meeting
                    </>
                  ) : (
                    <>
                      <Building2 className="size-3.5" /> Luring • Kampus Mayoga
                    </>
                  )}
                </span>

                {event.category?.name && (
                  <span className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/95 text-slate-800 backdrop-blur-md shadow-md">
                    {event.category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Event Header & Facts Strip */}
            <article className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {event.category?.name || "Agenda Komunitas"}
                </p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* Cohesive Specifications Strip (Clean Editorial, No Slop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                    <Calendar className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Waktu & Tanggal</p>
                    <p className="font-bold text-slate-900 text-sm">{dateStr}</p>
                    {timeRange && <p className="text-slate-500 mt-0.5">{timeRange}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Tempat / Platform</p>
                    <p className="font-bold text-slate-900 text-sm leading-snug">{event.location}</p>
                    <p className="text-slate-500 mt-0.5">
                      {isOnline ? "Tautan Zoom tersedia bagi peserta terdaftar" : "Silakan hadir 15 menit sebelum acara"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                    <Users className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Partisipasi Alumni</p>
                    <p className="font-bold text-slate-900 text-sm">{event.rsvps_count} Alumni Telah RSVP</p>
                    <p className="text-slate-500 mt-0.5">
                      {event.max_participants ? `Kapasitas maksimal ${event.max_participants} orang` : "Kuota terbuka tanpa batas"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Batas Pendaftaran</p>
                    <p className="font-bold text-slate-900 text-sm">{regDeadlineStr || "Hingga Hari Acara"}</p>
                    <p className="text-slate-500 mt-0.5">
                      {event.is_registration_open ? "Pendaftaran dibuka" : "Pendaftaran telah ditutup"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Description Section */}
              <div className="space-y-4 pt-2">
                <h2 className="text-lg font-bold text-slate-900">Tentang Agenda Ini</h2>
                <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed space-y-4">
                  {event.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </article>

            {/* Community Wall: Registered Attendees */}
            <section aria-labelledby="attendees-heading" className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <h2 id="attendees-heading" className="text-base md:text-lg font-bold text-slate-900">
                    Daftar Alumni yang Mengonfirmasi Hadir
                  </h2>
                  <p className="text-xs text-slate-500">
                    {event.rsvps_count > 0
                      ? `Terima kasih kepada ${event.rsvps_count} alumni yang telah konfirmasi hadir untuk mempererat silaturahmi.`
                      : "Belum ada alumni yang RSVP. Jadilah yang pertama mengonfirmasi kehadiran Anda!"}
                  </p>
                </div>
                {event.rsvps_count > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {event.rsvps_count} Peserta
                  </span>
                )}
              </div>

              {event.registered_attendees && event.registered_attendees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {event.registered_attendees.map((attendee, idx) => (
                    <div
                      key={attendee.id || idx}
                      className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center gap-3"
                    >
                      <div className="relative size-10 rounded-full overflow-hidden bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 border border-slate-200 text-sm">
                        {attendee.avatar_url ? (
                          <Image
                            src={attendee.avatar_url}
                            alt={attendee.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span>{attendee.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {attendee.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {attendee.graduation_year
                            ? `Angkatan ${attendee.graduation_year}`
                            : "Alumni Mayoga"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    Ayo ramaikan kegiatan ini! Klik tombol RSVP di panel kanan untuk mencatatkan kehadiran Anda.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Admission Ticket Widget */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8">
            <EventRsvpWidget event={event} />
          </aside>
        </div>
      </Container>
    </div>
  );
}
