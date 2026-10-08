"use client";

import { FORUM_CATEGORIES, ForumCategoryData } from "./forumData";
import { API_BASE_URL } from "@/lib/api";

export interface ModerationReport {
  id: string;
  reportableType: "topic" | "reply" | "profile";
  reportableId: string;
  contentTitle: string;
  contentSnippet: string;
  authorName: string;
  authorAvatar?: string;
  reporterName: string;
  reporterRole: string;
  reason: "spam" | "hate_speech" | "inappropriate" | "impersonation" | "false_information";
  description?: string;
  status: "pending" | "reviewing" | "resolved" | "rejected";
  createdAt: string;
  resolvedAt?: string;
  resolverName?: string;
  actionTaken?: string;
}

export interface AlumniVerificationItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  graduationYear: number;
  graduationClass: string;
  diplomaNumber: string;
  registeredAt: string;
  occupation: string;
  company: string;
  currentCity: string;
  status: "pending" | "active" | "suspended";
  alumniIdentifier?: string;
  notes?: string;
}

export interface AdminStats {
  pendingVerifications: number;
  pendingReports: number;
  totalCategories: number;
  activeThreads: number;
}

const STORAGE_KEY_CATEGORIES = "m3s_admin_categories";
const STORAGE_KEY_REPORTS = "m3s_admin_reports";
const STORAGE_KEY_VERIFICATIONS = "m3s_admin_verifications";

const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: "rep-101",
    reportableType: "reply",
    reportableId: "reply-spam-1",
    contentTitle: "Re: Rencana Reuni Akbar Lintas Angkatan 2026",
    contentSnippet: "Halo semua, dapatkan pinjaman dana kilat bunga 0% hubungi wa.me/6281299998888 proses 5 menit cair!",
    authorName: "Akun Promo Tidak Dikenal",
    authorAvatar: "/images/avatar-ahmad.jpg",
    reporterName: "Siti Rahmawati",
    reporterRole: "alumni",
    reason: "spam",
    description: "Komentar berisi promosi pinjaman online ilegal yang tidak ada kaitannya dengan agenda reuni madrasah.",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "rep-102",
    reportableType: "topic",
    reportableId: "topic-spam-2",
    contentTitle: "Jual Akun Game & Chip Murah Terpercaya Garansi Resmi",
    contentSnippet: "Bagi rekan-rekan yang butuh chip game terpercaya bisa langsung transfer ke rekening admin berikut...",
    authorName: "User Tanpa Angkatan",
    authorAvatar: "/images/avatar-ahmad.jpg",
    reporterName: "Budi Santoso",
    reporterRole: "alumni",
    reason: "spam",
    description: "Akun baru membuat thread jualan tidak berizin di kategori Diskusi Umum.",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "rep-103",
    reportableType: "profile",
    reportableId: "alumni-fake-3",
    contentTitle: "Profil: Hendra Saputra",
    contentSnippet: "Mengaku angkatan 2015 jurusan IPA 1 namun nama dan foto tidak dikenali oleh pengurus angkatan.",
    authorName: "Hendra Saputra",
    authorAvatar: "/images/avatar-ahmad.jpg",
    reporterName: "Koordinator Angkatan 2015",
    reporterRole: "moderator",
    reason: "impersonation",
    description: "Mohon diverifikasi ulang keabsahan ijazah karena ada indikasi klaim identitas alumni palsu.",
    status: "reviewing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const INITIAL_VERIFICATIONS: AlumniVerificationItem[] = [
  {
    id: "verif-1",
    userId: "user-new-1",
    name: "Rizky Ramadhan, S.Kom.",
    email: "rizky.ramadhan@alumni.m3s.id",
    phone: "081234567890",
    avatar: "/images/avatar-ahmad.jpg",
    graduationYear: 2021,
    graduationClass: "IPA 1",
    diplomaNumber: "DN-04/MA/13/0087261",
    registeredAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    occupation: "Frontend Engineer",
    company: "PT Inovasi Digital Nusantara",
    currentCity: "Sleman, D.I. Yogyakarta",
    status: "pending",
  },
  {
    id: "verif-2",
    userId: "user-new-2",
    name: "Fadhilah Anindya, S.E.",
    email: "fadhilah.anindya@alumni.m3s.id",
    phone: "085799988877",
    avatar: "/images/avatar-siti.jpg",
    graduationYear: 2019,
    graduationClass: "IPS 2",
    diplomaNumber: "DN-04/MA/13/0074552",
    registeredAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    occupation: "Financial Analyst",
    company: "Bank Syariah Indonesia",
    currentCity: "Jakarta Selatan",
    status: "pending",
  },
  {
    id: "verif-3",
    userId: "user-new-3",
    name: "Muhammad Ihsan Kamil",
    email: "ihsan.kamil@alumni.m3s.id",
    phone: "087788112233",
    avatar: "/images/avatar-ahmad.jpg",
    graduationYear: 2023,
    graduationClass: "Keagamaan 1",
    diplomaNumber: "DN-04/MA/13/0099411",
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    occupation: "Mahasiswa UIN Sunan Kalijaga",
    company: "Fakultas Ushuluddin",
    currentCity: "Yogyakarta",
    status: "pending",
  },
  {
    id: "verif-4",
    userId: "user-budi",
    name: "Budi Santoso, S.T.",
    email: "budi.santoso@alumni.m3s.id",
    phone: "081122334455",
    avatar: "/images/avatar-ahmad.jpg",
    graduationYear: 2018,
    graduationClass: "IPA 2",
    diplomaNumber: "DN-04/MA/13/0065123",
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    occupation: "Senior Backend Engineer",
    company: "Tokopedia / GoTo",
    currentCity: "Jakarta Selatan",
    status: "active",
    alumniIdentifier: "M3S-2018-0012",
  },
];

// Helper: Get Categories
export function getAdminCategories(): ForumCategoryData[] {
  if (typeof window === "undefined") return FORUM_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(FORUM_CATEGORIES));
      return FORUM_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return FORUM_CATEGORIES;
  }
}

// Helper: Save Category
export function saveAdminCategory(category: ForumCategoryData): ForumCategoryData[] {
  const current = getAdminCategories();
  const index = current.findIndex((c) => c.id === category.id);
  let updated: ForumCategoryData[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = category;
  } else {
    updated = [...current, category];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
    window.dispatchEvent(new Event("m3s_admin_data_change"));
  }

  // Background sync to backend API if authenticated
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      const endpoint = index >= 0
        ? `${API_BASE_URL}/admin/forum/categories/${category.id}`
        : `${API_BASE_URL}/admin/forum/categories`;
      const method = index >= 0 ? "PUT" : "POST";

      fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon,
          image: category.image,
          sort_order: category.sortOrder,
        }),
      }).catch(() => {});
    }
  } catch {}

  return updated;
}

// Helper: Delete Category
export function deleteAdminCategory(id: string): ForumCategoryData[] {
  const current = getAdminCategories();
  const updated = current.filter((c) => c.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
    window.dispatchEvent(new Event("m3s_admin_data_change"));
  }

  // Background sync to backend API
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      fetch(`${API_BASE_URL}/admin/forum/categories/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }
  } catch {}

  return updated;
}

// Helper: Get Moderation Reports
export function getAdminReports(): ModerationReport[] {
  if (typeof window === "undefined") return INITIAL_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTS;
  }
}

// Helper: Handle Report Action
export function resolveAdminReport(
  id: string,
  status: "resolved" | "rejected" | "reviewing",
  actionTaken: string,
  resolverName: string
): ModerationReport[] {
  const current = getAdminReports();
  const updated = current.map((r) => {
    if (r.id === id) {
      return {
        ...r,
        status,
        actionTaken,
        resolverName,
        resolvedAt: new Date().toISOString(),
      };
    }
    return r;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
    window.dispatchEvent(new Event("m3s_admin_data_change"));
  }

  // Background sync to backend API
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    if (token) {
      fetch(`${API_BASE_URL}/admin/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          action: actionTaken.includes("Kunci") ? "lock_thread" : actionTaken.includes("Hapus") ? "delete_content" : "none",
        }),
      }).catch(() => {});
    }
  } catch {}

  return updated;
}

// Helper: Get Alumni Verifications
export function getAdminVerifications(): AlumniVerificationItem[] {
  if (typeof window === "undefined") return INITIAL_VERIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VERIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VERIFICATIONS, JSON.stringify(INITIAL_VERIFICATIONS));
      return INITIAL_VERIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_VERIFICATIONS;
  }
}

// Helper: Verify Alumni (Approve)
export function approveAlumniVerification(id: string): AlumniVerificationItem[] {
  const current = getAdminVerifications();
  const updated = current.map((item) => {
    if (item.id === id) {
      const year = item.graduationYear;
      const identifier = item.alumniIdentifier || `M3S-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        ...item,
        status: "active" as const,
        alumniIdentifier: identifier,
        notes: "Verifikasi ijazah berhasil disetujui.",
      };
    }
    return item;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_VERIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event("m3s_admin_data_change"));
  }

  // Background sync to backend API
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    const target = current.find((i) => i.id === id);
    if (token && target) {
      fetch(`${API_BASE_URL}/admin/alumni/${target.userId}/verify`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }
  } catch {}

  return updated;
}

// Helper: Reject Alumni
export function rejectAlumniVerification(id: string, reason: string): AlumniVerificationItem[] {
  const current = getAdminVerifications();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status: "suspended" as const,
        notes: reason || "Data kelulusan tidak sesuai dengan buku induk madrasah.",
      };
    }
    return item;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_VERIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event("m3s_admin_data_change"));
  }

  // Background sync to backend API
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("m3s_token") : null;
    const target = current.find((i) => i.id === id);
    if (token && target) {
      fetch(`${API_BASE_URL}/admin/alumni/${target.userId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      }).catch(() => {});
    }
  } catch {}

  return updated;
}
