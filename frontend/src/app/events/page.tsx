import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EventListClient } from "@/components/events/EventListClient";
import { fetchEvents, fetchEventCategories } from "@/data/eventData";

export const metadata: Metadata = {
  title: "Agenda & Reuni Alumni | IKAMAYOGA MAN 3 Sleman",
  description:
    "Jadwal lengkap kegiatan silaturahmi temu kangen akbar, webinar pengembangan karir, bakti sosial, dan agenda resmi Ikatan Alumni MAN 3 Sleman (Mayoga).",
};

export const revalidate = 60; // ISR cache 60 seconds

export default async function EventsPage() {
  const [initialEvents, categories] = await Promise.all([
    fetchEvents({ tab: "upcoming" }),
    fetchEventCategories(),
  ]);

  return (
    <div className="py-8 md:py-14 bg-slate-50/70 min-h-screen">
      <Container size="wide">
        {/* Header Title Section - Clean Editorial & Grounded */}
        <header className="mb-10 max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Agenda Kegiatan & Silaturahmi
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Agenda & Reuni Alumni
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Pusat jadwal temu kangen lintas angkatan, webinar pengembangan kompetensi, bakti sosial madrasah, dan konfirmasi kehadiran resmi alumni Mayoga.
          </p>
        </header>

        {/* Client-hydrated Interactive Event List */}
        <EventListClient initialEvents={initialEvents} categories={categories} />
      </Container>
    </div>
  );
}
