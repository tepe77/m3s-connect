export function getBackendUrl(): string {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "");
  }
  // Default to production backend API so both local dev and production access real data
  return "https://api-alumni.mayoga.sch.id";
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
