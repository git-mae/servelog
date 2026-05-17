// Thin wrapper around the browser Notification API. Safe no-ops when unsupported.
const KEY = "servelog:notif-asked";

export function canNotify(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function ensurePermission(): Promise<NotificationPermission> {
  if (!canNotify()) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  if (typeof window !== "undefined" && localStorage.getItem(KEY)) return Notification.permission;
  try {
    localStorage.setItem(KEY, "1");
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function notify(title: string, body?: string) {
  if (!canNotify() || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.ico" });
  } catch {
    // ignore (e.g. iframe restrictions)
  }
}
