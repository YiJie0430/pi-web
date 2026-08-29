/**
 * Branding — the web UI name shown in the browser title, header, PWA manifest.
 *
 * Override via env `NEXT_PUBLIC_APP_NAME` (set in .env / docker run).
 * Default: "HT Agent".
 *
 * NEXT_PUBLIC_ prefix is required so the value is inlined into client bundles
 * at build time (used by client components like AppShell/Sidebar/ChatWindow).
 */
export const APP_NAME: string = process.env.NEXT_PUBLIC_APP_NAME || "HT Agent";

export function appTitle(cwdName?: string | null): string {
  return cwdName ? `${cwdName} - ${APP_NAME}` : APP_NAME;
}
