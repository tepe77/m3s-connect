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

export const FALLBACK_EVENTS: EventModel[] = [];

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

const DEFAULT_FETCH_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 IKAMAYOGA/1.0",
};

export async function fetchEvents(
  params: { tab?: string; category?: string; search?: string; limit?: number } = {},
  token?: string | null
): Promise<EventModel[]> {
  const query = new URLSearchParams();
  if (params.tab) query.set("tab", params.tab);
  if (params.category && params.category !== "all") query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.limit) query.set("limit", params.limit.toString());

  const headers: Record<string, string> = {
    ...DEFAULT_FETCH_HEADERS,
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
        return list.map((ev: any) => ({
          ...ev,
          cover_image_url: resolveEventCover(ev.cover_image_url || ev.cover_image),
          rsvps_count: ev.rsvps_count ?? 0,
        }));
      }
    }
  } catch (err) {
    console.warn("fetchEvents failed:", err);
  }

  return [];
}

export async function fetchEventCategories(): Promise<EventCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/categories`, {
      headers: DEFAULT_FETCH_HEADERS,
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

  return [];
}

export async function fetchEventDetail(slug: string, token?: string | null): Promise<EventModel | null> {
  const headers: Record<string, string> = {
    ...DEFAULT_FETCH_HEADERS,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    let res = await fetch(`${API_BASE_URL}/events/${slug}`, {
      headers,
      cache: "no-store",
    });

    // If server returned 500 error (e.g. unhandled UUID cast on un-deployed remote backend),
    // attempt resolution by looking up event by slug from event list, then requesting by UUID
    if (res.status >= 500) {
      try {
        const eventsList = await fetchEvents({ tab: "all" }, token);
        const matched = eventsList.find((e) => e.slug === slug || e.id === slug);
        if (matched && matched.id && matched.id !== slug) {
          const retryRes = await fetch(`${API_BASE_URL}/events/${matched.id}`, {
            headers,
            cache: "no-store",
          });
          if (retryRes.ok) {
            res = retryRes;
          }
        }
      } catch {
        // Fall through to standard response handling
      }
    }

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
    console.warn(`fetchEventDetail(${slug}) failed:`, err);
  }

  return null;
}

export async function submitEventRsvp(
  slugOrId: string,
  token: string
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    let target = slugOrId;
    let res = await fetch(`${API_BASE_URL}/events/${target}/rsvp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // If server returned 500 due to slug routing, retry by UUID
    if (!res.ok && res.status >= 500) {
      try {
        const eventsList = await fetchEvents({ tab: "all" }, token);
        const matched = eventsList.find((e) => e.slug === slugOrId || e.id === slugOrId);
        if (matched && matched.id && matched.id !== slugOrId) {
          const retry = await fetch(`${API_BASE_URL}/events/${matched.id}/rsvp`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (retry.ok || retry.status < 500) {
            res = retry;
          }
        }
      } catch {}
    }

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
  slugOrId: string,
  token: string
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    let target = slugOrId;
    let res = await fetch(`${API_BASE_URL}/events/${target}/rsvp`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // If server returned 500 due to slug routing, retry by UUID
    if (!res.ok && res.status >= 500) {
      try {
        const eventsList = await fetchEvents({ tab: "all" }, token);
        const matched = eventsList.find((e) => e.slug === slugOrId || e.id === slugOrId);
        if (matched && matched.id && matched.id !== slugOrId) {
          const retry = await fetch(`${API_BASE_URL}/events/${matched.id}/rsvp`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (retry.ok || retry.status < 500) {
            res = retry;
          }
        }
      } catch {}
    }

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
