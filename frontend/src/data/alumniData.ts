export interface AlumniSocialLink {
  platform: "linkedin" | "github" | "instagram" | "twitter" | "website";
  url: string;
}

export interface AlumniEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  description?: string;
}

export interface AlumniExperience {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description?: string;
}

export interface AlumniItem {
  id: string;
  slug: string;
  name: string;
  email?: string;
  avatar: string;
  graduationYear: number;
  graduationClass: string;
  alumniIdentifier: string;
  isVerified: boolean;
  occupation: string;
  company: string;
  city: string;
  country: string;
  bio: string;
  skills: string[];
  socialLinks: AlumniSocialLink[];
  educations?: AlumniEducation[];
  experiences?: AlumniExperience[];
}

export const ALUMNI_ITEMS: AlumniItem[] = [];

/**
 * Smart lookup helper for alumni profile by slug, alumniIdentifier, or id.
 */
export function getAlumniBySlugOrId(slugOrId: string): AlumniItem | undefined {
  if (!slugOrId) return undefined;
  const normalized = slugOrId.trim().toLowerCase();
  return ALUMNI_ITEMS.find(
    (a) =>
      a.slug.toLowerCase() === normalized ||
      a.id.toLowerCase() === normalized ||
      a.alumniIdentifier.toLowerCase() === normalized
  );
}

/**
 * Returns canonical, human-friendly URL for alumni profile.
 */
export function getAlumniProfileUrl(alumni: { slug?: string; alumniIdentifier?: string; id: string }): string {
  if (alumni.slug) return `/alumni/${alumni.slug}`;
  if (alumni.alumniIdentifier) return `/alumni/${alumni.alumniIdentifier.toLowerCase()}`;
  return `/alumni/${alumni.id}`;
}

/**
 * Maps raw backend API profile payload to standard AlumniItem
 */
export function mapAlumniProfile(p: any): AlumniItem {
  const rawName = p.user?.name || p.name || "Alumni";
  const generatedSlug = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: p.id,
    slug: p.slug || generatedSlug || p.id,
    name: rawName,
    email: p.user?.email || "",
    avatar: p.user?.avatar || p.avatar_url || "/images/avatar-ahmad.jpg",
    graduationYear: p.graduation_year || 0,
    graduationClass: p.graduation_class || "",
    alumniIdentifier: p.alumni_identifier || "",
    isVerified: Boolean(p.verified_at),
    occupation: p.occupation || "",
    company: p.company || "",
    city: p.current_city || "",
    country: p.current_country || "Indonesia",
    bio: p.bio || "",
    skills: Array.isArray(p.skills)
      ? p.skills.map((s: any) => (typeof s === "string" ? s : s.name))
      : [],
    socialLinks: Array.isArray(p.social_links)
      ? p.social_links.map((s: any) => ({ platform: s.platform, url: s.url }))
      : [],
    educations: Array.isArray(p.educations) && p.educations.length > 0
      ? p.educations.map((e: any) => ({
          institution: e.institution,
          degree: e.degree || "",
          fieldOfStudy: e.field_of_study || "",
          startYear: e.start_year,
          endYear: e.end_year,
          description: e.description,
        }))
      : [],
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
      : [],
  };
}
