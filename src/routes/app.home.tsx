import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { getStudent, getOpportunities, studentTotals, useStore } from "@/lib/mock-data";
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/home")({
  head: () => ({ meta: [{ title: "Home — SERVELOG" }] }),
  component: Home,
});

function Home() {
  const subs = useStore((s) => s.submissions);
  const student = getStudent();
  const { approved, pending } = studentTotals(student.id);
  const remaining = Math.max(0, student.requiredHours - approved);
  const pct = Math.min(100, Math.round((approved / student.requiredHours) * 100));
  const recent = subs.filter((s) => s.studentId === student.id).slice(0, 3);
  const opps = getOpportunities();
  const C = 2 * Math.PI * 52;

  return (
    <>
      <AppHeader title={`Hi, ${student.name.split(" ")[0]}`} subtitle={student.course} />

      <section className="px-5 pt-5">
        <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm">
          <p className="text-xs uppercase tracking-widest opacity-80">Cumulative service hours</p>
          <div className="mt-3 flex items-center gap-5">
            <div className="relative h-32 w-32 shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="opacity-20" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold">{approved}</span>
                <span className="text-[10px] uppercase tracking-widest opacity-80">of {student.requiredHours} hrs</span>
              </div>
            </div>
            <div className="flex-1 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="opacity-80">Approved</span><span className="font-medium">{approved} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-80">Pending</span><span className="font-medium">{pending} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-80">Remaining</span><span className="font-medium">{remaining} hrs</span>
              </div>
            </div>
          </div>
          <Link to="/app/log" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-card/15 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-card/25">
            Log new activity <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="px-5 pt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent submissions</h2>
          <Link to="/app/history" className="text-xs text-primary">View all</Link>
        </div>
        <div className="space-y-2">
          {recent.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">No submissions yet.</p>
          )}
          {recent.map((s) => (
            <article key={s.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString()} · {s.hours}h</p>
                </div>
                <StatusPill status={s.status} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8 pt-7">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Suggested for you</h2>
        </div>
        <div className="space-y-2">
          {opps.map((o) => (
            <article key={o.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.title}</p>
                  <p className="text-xs text-muted-foreground">{o.organizer}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(o.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{o.location}</span>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{o.hours}h</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function StatusPill({ status }: { status: "pending" | "approved" | "rejected" }) {
  const map = {
    pending: "bg-warning/15 text-warning",
    approved: "bg-success/15 text-success",
    rejected: "bg-destructive/10 text-destructive",
  } as const;
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${map[status]}`}>{status}</span>;
}
