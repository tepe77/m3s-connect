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
