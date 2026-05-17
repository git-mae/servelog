# Notifications + Verified tab fix

## 1. Fix "can't view Verified" on adviser

The `/adviser/verified` route and bottom-nav link both exist and are registered, so the most likely cause is the 4-tab bottom nav being clipped/hard to tap on the user's current viewport. Two small fixes:

- Make the adviser bottom nav clearly show all 4 tabs (tighten spacing, ensure `Verified` icon/label fit and the active state is obvious).
- Add a **"Verified history"** shortcut card on the adviser **Queue** screen and on the **Profile** screen so it's reachable from multiple places.

No data/logic change needed — the route already lists approved + rejected submissions from the mock store.

## 2. Notifications (UI-only, mock)

Since the app is still UI-only (no Cloud), we'll implement an **in-app notification system** that simulates push:

- A persistent notification store in `src/lib/mock-data.ts` (`notifications: Notification[]`, scoped by `recipientId` + `recipientRole`).
- A **bell icon** in `AppHeader` with an unread-count badge that opens a notification sheet/drawer listing recent items (tap to navigate to the related submission/activity).
- A **toast** (sonner) fires the moment a new notification is created in the active session — this is the "push" feel.
- Optional: request the browser's `Notification.permission` once on first login and, if granted, also fire a real OS notification. Gracefully no-op when denied or unsupported (works in the published web app; preview iframe may block it).

### Triggers

| Event | Recipient | Notification |
|---|---|---|
| Student submits a new activity | All advisers | "New submission from {student} — {title}" → opens `/adviser/review/$id` |
| Adviser approves a submission | The student | "Your activity '{title}' was approved (+{hours} hrs)" → opens `/app/history` |
| Adviser rejects a submission | The student | "Your activity '{title}' was rejected — tap to view note" → opens `/app/history` |
| Upcoming opportunity within 3 days (and student is below required hours) | Student | "Upcoming: {title} on {date} at {location}" → opens `/app/home` |

The upcoming-service reminder is generated on app load by a small `seedUpcomingReminders()` helper that scans `OPPORTUNITIES` against today + 3 days and inserts one notification per match (deduped by opportunity id).

### Files

- **edit** `src/lib/mock-data.ts` — add `Notification` type, `notifications` slice, `addNotification`, `markAllRead`, `getUnreadCount`, and wire `addSubmission`/`decide` to push notifications. Seed upcoming-opportunity reminders on first run.
- **new** `src/components/NotificationBell.tsx` — bell button + Sheet listing notifications, grouped by today/earlier, with empty state.
- **new** `src/lib/browser-notifications.ts` — thin wrapper around `window.Notification` (permission request + safe `notify()` no-op fallback).
- **edit** `src/components/AppHeader.tsx` — render `<NotificationBell />` in the `right` slot by default (still overridable).
- **edit** `src/components/BottomNav.tsx` — adviser grid spacing tweak so Verified is clearly visible.
- **edit** `src/routes/adviser.queue.tsx` and `src/routes/adviser.profile.tsx` — add a "Verified history" link card.
- **edit** `src/routes/app.tsx` and `src/routes/adviser.tsx` — on mount, request browser notification permission once and run the upcoming-reminder seeder.

## Out of scope

- Real server-side push (FCM/APNs) — needs Lovable Cloud + a device token registry. Can be added when backend is enabled.
- Email/SMS reminders.

## Notes for the user

- Toasts and the in-app bell work everywhere, including the editor preview.
- Real OS-level push popups only work in the **published** site after the user clicks "Allow notifications". They won't appear inside the Lovable editor iframe.
