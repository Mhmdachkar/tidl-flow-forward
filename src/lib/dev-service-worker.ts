/**
 * Stale service workers (e.g. from prior PWA experiments) intercept Vite dev
 * module requests and cause ERR_FAILED / Failed to fetch. Unregister in dev only.
 */
export async function unregisterDevServiceWorkers() {
  if (import.meta.env.PROD) return;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  } catch {
    // Non-fatal in dev
  }
}
