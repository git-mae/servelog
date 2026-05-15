## SERVELOG — Mobile-first UI (v1, mock data)

A clean, minimalist mobile-first web app for tracking community service hours at New Era University. Both Student and Adviser roles, full feature surface, mock data only (Cloud can be enabled later).

### Design system

- Style: clean, minimalist, lots of whitespace, soft cards, rounded-2xl, subtle borders.
- Palette (calm sage, oklch tokens in `src/styles.css`):
  - background `#f5f0e8` (warm cream)
  - surface/card `#ffffff`
  - muted `#dce5d4`
  - accent/primary `#2d5a3d` (deep sage)
  - secondary accent `#a8c0a0` (soft sage)
- Typography: Inter for UI, with a slightly stronger display weight for headings. No serif.
- Components: shadcn/ui (Button, Card, Progress, Tabs, Dialog, Sheet, Input, Textarea, Badge, Avatar).
- Mobile-first; max width container (~480px) centered on desktop with a soft phone-frame backdrop so it feels like a mobile app preview.

### Routes (TanStack Start, separate route files)

```
src/routes/
  __root.tsx                — shell + role switcher (mock), bottom-nav layout for app
  index.tsx                  — landing/role pick: "I'm a Student" / "I'm an Adviser"
  login.tsx                  — mock login (pre-filled NEU student/adviser)
  _app.tsx                   — authenticated layout w/ bottom nav (Home, Log, Reports, Profile)
  _app/home.tsx              — Student dashboard: cumulative hours, progress bar, recent logs, suggestions
  _app/log.tsx               — Log new activity (form + proof upload preview)
  _app/history.tsx           — All submissions w/ status filters
  _app/reports.tsx           — Generate/preview Hours Summary Report (printable view)
  _app/profile.tsx           — Student profile, violation, required hours
  _adviser.tsx               — Adviser layout w/ bottom nav (Queue, Verified, Students, Profile)
  _adviser/queue.tsx         — Pending submissions list with AI duplicate flags
  _adviser/review.$id.tsx   — Review detail: proof viewer, approve/reject w/ comment
  _adviser/students.tsx      — Roster + per-student progress
  _adviser/profile.tsx       — Adviser profile
```

### Features (all mocked, in-memory)

Student
- Dashboard: name, course, violation type, required vs completed hours, circular + linear progress, semester breakdown, next milestone.
- Log Activity: date, event title, organizer, location, hours, description, proof upload (image preview only). Shows "AI duplicate check" inline indicator after submit.
- History: list grouped by status (Pending, Approved, Rejected) with adviser comments on rejected.
- Reports: formatted Hours Summary preview with print-friendly layout and "Download PDF" (window.print).
- Suggestions: 3 recommended upcoming opportunities matching course/interests (mock cards).
- Profile: editable name/course/email; read-only violation + required hours.

Adviser
- Queue: pending list, each with AI flag badge ("Possible duplicate" when date+location match), search/filter.
- Review detail: full submission, proof image, side-by-side similar past entry when flagged, Approve / Reject (with required comment on reject).
- Students: roster with per-student progress bars and quick filter (at risk / on track / done).
- Verified: history of actioned items.

Cross-cutting
- Mock data store: `src/lib/mock-data.ts` with students, advisers, submissions, opportunities. Lightweight zustand or React context for mutations across screens.
- Empty states, skeletons, toasts (sonner) for actions.
- Single H1 per page, semantic HTML, meta tags per route.

### Technical notes

- TanStack Router file-based routing; flat dot-separated names; `_app` and `_adviser` are pathless layout routes that render bottom nav + `<Outlet />`.
- All colors via semantic tokens in `src/styles.css` (oklch). No hardcoded hex in components.
- Mobile-first Tailwind; container caps width on larger screens.
- No backend yet: mock auth via localStorage role flag. Clear "Demo data" banner on first run.
- Set preview viewport to mobile.

### Out of scope for this build

- Real authentication, database, file storage (Cloud not enabled per user choice).
- Real AI duplicate detection (simulated via simple date+location match in mock data).
- Push notifications, real PDF export (uses browser print).

### Next iteration (after approval of v1)

- Enable Lovable Cloud: auth, profiles + user_roles tables, submissions table, storage bucket for proof, RLS policies.
- Wire Adviser approval workflow to DB and real duplicate detection via server function.
