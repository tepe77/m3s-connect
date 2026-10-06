import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ALUMNI_ITEMS } from "@/data/alumniData";
import { AlumniDetailClient } from "./AlumniDetailClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const alumni = ALUMNI_ITEMS.find((a) => a.id === id);

  if (!alumni) {
    return {
      title: "Profil Alumni Tidak Ditemukan | M3S Connect",
    };
  }

  return {
    title: `${alumni.name} | Direktori Alumni MAN 3 Sleman`,
    description: `${alumni.name} (Alumni ${alumni.graduationYear}) - ${alumni.occupation} di ${alumni.company}. ${alumni.bio}`,
    openGraph: {
      title: `${alumni.name} | M3S Connect`,
      description: alumni.bio,
      images: [alumni.avatar],
    },
  };
}

export default async function AlumniDetailPage({ params }: PageProps) {
  const { id } = await params;
  const alumni = ALUMNI_ITEMS.find((a) => a.id === id);

  if (!alumni) {
    notFound();
  }

  return <AlumniDetailClient alumni={alumni} />;
}
