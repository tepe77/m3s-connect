import { Metadata } from "next";
import { EventDetailClient } from "./EventDetailClient";
import { fetchEventDetail, stripHtml } from "@/data/eventData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventDetail(slug);

  if (!event) {
    const formattedTitle = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      title: `${formattedTitle} | Agenda & Reuni IKAMAYOGA`,
      description: "Jadwal dan rincian agenda temu alumni dan silaturahmi IKAMAYOGA MAN 3 Sleman.",
    };
  }

  const cleanDescription = stripHtml(event.description).slice(0, 160);

  return {
    title: `${event.title} | Agenda & Reuni Alumni MAN 3 Sleman`,
    description: cleanDescription,
    openGraph: {
      title: event.title,
      description: cleanDescription,
      images: [event.cover_image_url || "/images/doc-baksos.jpg"],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await fetchEventDetail(slug);

  return <EventDetailClient initialEvent={event} slug={slug} />;
}
