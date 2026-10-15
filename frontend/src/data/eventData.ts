import { API_BASE_URL, getAssetUrl } from "@/lib/api";

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  events_count?: number;
}

export interface EventAttendee {
  id: string;
  user_id: string;
  name: string;
  graduation_year?: string | number | null;
  graduation_class?: string | null;
  avatar_url?: string | null;
  registered_at?: string;
}

export interface EventModel {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image?: string | null;
  cover_image_url?: string | null;
  location: string;
  start_at: string;
  end_at?: string | null;
  registration_start_at?: string | null;
  registration_end_at?: string | null;
  max_participants?: number | null;
  status: "draft" | "published" | "cancelled" | "completed" | "archived" | string;
  category?: EventCategory | null;
  creator?: {
    id: string;
    name: string;
  } | null;
  rsvps_count: number;
  is_past: boolean;
  is_registration_open: boolean;
  is_quota_full?: boolean;
  user_rsvp_status?: "registered" | "cancelled" | "attended" | "no_show" | null;
  is_registered?: boolean;
  registered_attendees?: EventAttendee[];
}

export const FALLBACK_EVENTS: EventModel[] = [
  {
    id: "event-1",
    slug: "webinar-karir-alumni-membangun-portofolio-global",
    title: "Webinar Karir Alumni: Membangun Portofolio Global di Era Digital",
    description:
      "Sesi sharing bersama para alumni praktisi industri teknologi dan bisnis internasional tentang strategi membangun portofolio yang relevan dengan standar global, kiat menghadapi interview internasional, dan peluang kerja jarak jauh (remote work).",
    location: "Online (Zoom Meeting)",
    start_at: "2026-10-20T19:00:00+07:00",
    end_at: "2026-10-20T21:00:00+07:00",
    registration_start_at: "2026-10-01T00:00:00+07:00",
    registration_end_at: "2026-10-19T23:59:00+07:00",
    max_participants: 200,
    status: "published",
    category: {
      id: "cat-1",
      name: "Webinar & Workshop",
      slug: "webinar-workshop",
    },
    creator: {
      id: "admin-1",
      name: "Pengurus Komunitas Alumni",
    },
    cover_image_url: "/images/news-internasional.jpg",
    rsvps_count: 64,
    is_past: false,
    is_registration_open: true,
    is_quota_full: false,
    is_registered: false,
    registered_attendees: [
      {
        id: "att-1",
        user_id: "user-1",
        name: "Ahmad Fauzi",
        graduation_year: 2018,
        graduation_class: "IPA 1",
        avatar_url: "/images/avatar-ahmad.jpg",
      },
      {
        id: "att-2",
        user_id: "user-2",
        name: "Rina Wardani",
        graduation_year: 2019,
        graduation_class: "IPS 2",
        avatar_url: "/images/avatar-rina.jpg",
      },
      {
        id: "att-3",
        user_id: "user-3",
        name: "Siti Nurhaliza",
        graduation_year: 2020,
        graduation_class: "Keagamaan",
        avatar_url: "/images/avatar-siti.jpg",
      },
      {
        id: "att-4",
        user_id: "user-4",
        name: "Fajar Pratama",
        graduation_year: 2017,
        graduation_class: "IPA 3",
      },
    ],
  },
  {
    id: "event-2",
    slug: "temu-kangen-silaturahmi-akbar-lintas-angkatan",
    title: "Temu Kangen & Silaturahmi Akbar Lintas Angkatan 2026",
    description:
      "Pertemuan akbar keluarga besar Mayoga lintas angkatan untuk mempererat tali persaudaraan dari angkatan pertama hingga yang termuda. Diisi dengan seremoni pembukaan, ramah tamah, pameran karya alumni, dan sesi santap malam bersama.",
    location: "Kampus MAN 3 Sleman, Jl. Magelang Km. 4",
    start_at: "2026-12-15T08:00:00+07:00",
    end_at: "2026-12-15T15:00:00+07:00",
    registration_start_at: "2026-10-15T00:00:00+07:00",
    registration_end_at: "2026-12-10T23:59:00+07:00",
    max_participants: 1000,
    status: "published",
    category: {
      id: "cat-2",
      name: "Temu Alumni",
      slug: "temu-alumni",
    },
    creator: {
      id: "admin-2",
      name: "Panitia Reuni Akbar",
    },
    cover_image_url: "/images/news-reuni.jpg",
    rsvps_count: 248,
    is_past: false,
    is_registration_open: true,
    is_quota_full: false,
    is_registered: false,
    registered_attendees: [
      {
        id: "att-21",
        user_id: "user-1",
        name: "Ahmad Fauzi",
        graduation_year: 2018,
        graduation_class: "IPA 1",
        avatar_url: "/images/avatar-ahmad.jpg",
      },
      {
        id: "att-22",
        user_id: "user-2",
        name: "Rina Wardani",
        graduation_year: 2019,
        graduation_class: "IPS 2",
        avatar_url: "/images/avatar-rina.jpg",
      },
      {
        id: "att-23",
        user_id: "user-3",
        name: "Siti Nurhaliza",
        graduation_year: 2020,
        graduation_class: "Keagamaan",
        avatar_url: "/images/avatar-siti.jpg",
      },
    ],
  },
];

export function resolveEventCover(url: string | null | undefined, fallbackUrl: string = "/images/doc-baksos.jpg"): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return getAssetUrl(url);
}

export function formatEventDate(dateString: string): string {
  if (!dateString) return "Jadwal belum ditentukan";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatEventTimeRange(startString: string, endString?: string | null): string {
  if (!startString) return "";
  try {
    const start = new Date(startString);
    const startHour = start.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (endString) {
      const end = new Date(endString);
      const endHour = end.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${startHour} - ${endHour} WIB`;
    }

    return `${startHour} WIB - Selesai`;
  } catch {
    return "";
  }
}

export function isOnlineEvent(location: string = ""): boolean {
  const l = location.toLowerCase();
  return l.includes("zoom") || l.includes("online") || l.includes("gmeet") || l.includes("webinar") || l.includes("daring");
}

export async function fetchEvents(
  params: { tab?: string; category?: string; search?: string; limit?: number } = {},
  token?: string | null
): Promise<EventModel[]> {
  const query = new URLSearchParams();
  if (params.tab) query.set("tab", params.tab);
  if (params.category && params.category !== "all") query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.limit) query.set("limit", params.limit.toString());

  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/events?${query.toString()}`, {
      headers,
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.data || json?.data;
      if (Array.isArray(list)) {
        if (list.length > 0) {
          return list.map((ev: any) => ({
            ...ev,
            cover_image_url: resolveEventCover(ev.cover_image_url || ev.cover_image),
            rsvps_count: ev.rsvps_count ?? 0,
          }));
        }
        // If API returned 200 with an empty array for an active search or category filter
        if (params.search || (params.category && params.category !== "all") || params.tab === "past") {
          return [];
        }
      }
    }
  } catch (err) {
    console.warn("fetchEvents failed, using fallback:", err);
  }

  // Fallback filtering if backend is unreachable
  let fallbackList = [...FALLBACK_EVENTS];
  if (params.tab === "past") {
    fallbackList = fallbackList.filter((e) => e.is_past);
  } else if (params.tab === "upcoming") {
    fallbackList = fallbackList.filter((e) => !e.is_past);
  }
  if (params.category && params.category !== "all") {
    fallbackList = fallbackList.filter((e) => e.category?.slug === params.category);
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    fallbackList = fallbackList.filter(
      (e) => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s)
    );
  }

  return fallbackList;
}

export async function fetchEventCategories(): Promise<EventCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/categories`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("fetchEventCategories failed:", err);
  }

  return [
    { id: "cat-1", name: "Semua Kategori", slug: "all" },
    { id: "cat-2", name: "Temu Alumni", slug: "temu-alumni" },
    { id: "cat-3", name: "Webinar & Workshop", slug: "webinar-workshop" },
  ];
}

export async function fetchEventDetail(slug: string, token?: string | null): Promise<EventModel | null> {
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/events/${slug}`, {
      headers,
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        const ev = json.data;
        return {
          ...ev,
          cover_image_url: resolveEventCover(ev.cover_image_url || ev.cover_image),
          rsvps_count: ev.rsvps_count ?? 0,
        };
      }
    }
  } catch (err) {
    console.warn(`fetchEventDetail(${slug}) failed, checking fallback:`, err);
  }

  const fallback = FALLBACK_EVENTS.find((e) => e.slug === slug || e.id === slug);
  return fallback || null;
}

export async function submitEventRsvp(
  slug: string,
  token: string
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${slug}/rsvp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (res.ok) {
      return {
        success: true,
        message: json.message || "Konfirmasi kehadiran berhasil dicatat.",
        data: json.data,
      };
    }

    return {
      success: false,
      message: json.message || "Gagal melakukan konfirmasi kehadiran.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Terjadi gangguan jaringan saat menghubungi server.",
    };
  }
}

export async function cancelEventRsvp(
  slug: string,
  token: string
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${slug}/rsvp`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (res.ok) {
      return {
        success: true,
        message: json.message || "Pendaftaran kehadiran berhasil dibatalkan.",
        data: json.data,
      };
    }

    return {
      success: false,
      message: json.message || "Gagal membatalkan kehadiran.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Terjadi gangguan jaringan saat menghubungi server.",
    };
  }
}
