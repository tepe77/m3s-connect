import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ALUMNI_ITEMS, AlumniItem } from "@/data/alumniData";
import { AlumniDetailClient } from "./AlumniDetailClient";
import { API_BASE_URL } from "@/lib/api";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getAlumni(id: string): Promise<AlumniItem | null> {
  const fallback = ALUMNI_ITEMS.find((a) => a.id === id);

  try {
    const res = await fetch(`${API_BASE_URL}/alumni/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const p = json?.data;
      if (p) {
        return {
          id: id,
          name: p.user?.name || fallback?.name || "",
          email: p.user?.email || fallback?.email,
          avatar: p.user?.avatar || p.avatar_url || fallback?.avatar || "/images/avatar-ahmad.jpg",
          graduationYear: p.graduation_year || fallback?.graduationYear || 2018,
          graduationClass: p.graduation_class || fallback?.graduationClass || "",
          alumniIdentifier: p.alumni_identifier || fallback?.alumniIdentifier || "",
          isVerified: true,
          occupation: p.occupation || fallback?.occupation || "",
          company: p.company || fallback?.company || "",
          city: p.current_city || fallback?.city || "",
          country: p.current_country || fallback?.country || "Indonesia",
          bio: p.bio || fallback?.bio || "",
          skills: Array.isArray(p.skills)
            ? p.skills.map((s: any) => typeof s === "string" ? s : s.name)
            : (fallback?.skills || []),
          socialLinks: Array.isArray(p.social_links) && p.social_links.length > 0
            ? p.social_links.map((s: any) => ({ platform: s.platform, url: s.url }))
            : (fallback?.socialLinks || []),
          educations: Array.isArray(p.educations) && p.educations.length > 0
            ? p.educations.map((e: any) => ({
                institution: e.institution,
                degree: e.degree || "",
                fieldOfStudy: e.field_of_study || "",
                startYear: e.start_year,
                endYear: e.end_year,
                description: e.description,
              }))
            : fallback?.educations,
          experiences: Array.isArray(p.experiences) && p.experiences.length > 0
            ? p.experiences.map((exp: any) => ({
                position: exp.position,
                company: exp.company,
                location: exp.location || "",
                startDate: typeof exp.start_date === "string" ? exp.start_date.substring(0, 4) : "",
                endDate: exp.end_date ? (typeof exp.end_date === "string" ? exp.end_date.substring(0, 4) : exp.end_date) : null,
                isCurrent: Boolean(exp.is_current),
                description: exp.description,
              }))
            : fallback?.experiences,
        };
      }
    }
  } catch {}

  return fallback || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const alumni = await getAlumni(id);

  if (!alumni) {
    return {
      title: "Profil Alumni Tidak Ditemukan | IKAMAYOGA",
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

  if (!alumni) {
    notFound();
  }

  return <AlumniDetailClient alumni={alumni} />;
}
