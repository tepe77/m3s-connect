export function getBackendUrl(): string {
  if (typeof window !== "undefined") {
    if (
      window.location.hostname.includes("mayoga.sch.id") ||
      window.location.hostname.includes("vercel.app")
    ) {
      return "https://api-alumni.mayoga.sch.id";
    }
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "");
  }
  if (process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL)) {
    return "https://api-alumni.mayoga.sch.id";
  }
  return "http://localhost:8000";
}

export const BACKEND_URL = getBackendUrl();

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api/v1`;

export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendUrl()}${cleanPath}`;
}
