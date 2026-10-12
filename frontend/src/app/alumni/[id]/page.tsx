import { Metadata } from "next";
import { AlumniItem, mapAlumniProfile } from "@/data/alumniData";
import { AlumniDetailClient } from "./AlumniDetailClient";
import { API_BASE_URL } from "@/lib/api";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getAlumni(id: string): Promise<AlumniItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/alumni/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const p = json?.data;
      if (p) {
        return mapAlumniProfile(p);
      }
    }
  } catch {}

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const alumni = await getAlumni(id);

  if (!alumni) {
    const formattedTitle = id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      title: `${formattedTitle} | Direktori Alumni MAN 3 Sleman`,
      description: "Profil alumni MAN 3 Sleman di portal direktori resmi IKAMAYOGA.",
    };
  }

  return {
    title: `${alumni.name} | Direktori Alumni MAN 3 Sleman`,
    description: `${alumni.name} (Alumni ${alumni.graduationYear}) - ${alumni.occupation} di ${alumni.company}. ${alumni.bio}`,
    openGraph: {
      title: `${alumni.name} | IKAMAYOGA`,
      description: alumni.bio,
      images: [alumni.avatar],
    },
  };
}

export default async function AlumniDetailPage({ params }: PageProps) {
  const { id } = await params;
  const alumni = await getAlumni(id);

  return <AlumniDetailClient initialAlumni={alumni} identifier={id} />;
}
