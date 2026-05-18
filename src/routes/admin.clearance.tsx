import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { actions, getRoster, studentTotals, useStore } from "@/lib/mock-data";
import { ShieldCheck, Award } from "lucide-react";

export const Route = createFileRoute("/admin/clearance")({
  head: () => ({ meta: [{ title: "Clearance — SERVELOG" }] }),
  component: Clearance,
});

function Clearance() {
  useStore((s) => s.submissions);
  useStore((s) => s.roster);
  const roster = getRoster();
  const [note, setNote] = useState<Record<string, string>>({});

  const data = useMemo(
    () =>
      roster.map((s) => {
        const { approved } = studentTotals(s.id);
        return { ...s, approved, complete: approved >= s.requiredHours };
      }),
    [roster],
  );

  const ready = data.filter((s) => s.complete && !s.clearedAt);
  const cleared = data.filter((s) => s.clearedAt);
  const inProgress = data.filter((s) => !s.complete);

  return (
    <>
      <AppHeader title="Clearance" subtitle={`${ready.length} ready · ${cleared.length} cleared`} />
      <div className="space-y-6 px-5 py-5">
        <Section title="Ready for clearance" empty="No students are ready yet.">
          {ready.map((s) => (
            <article key={s.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.studentNo} · {s.violation}</p>
                  <p className="mt-1 text-[11px] text-success">{s.approved} / {s.requiredHours} hrs verified</p>
                </div>
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <textarea
                value={note[s.id] ?? ""}
                onChange={(e) => setNote((n) => ({ ...n, [s.id]: e.target.value }))}
                placeholder="Optional clearance note"
                rows={2}
                className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
              />
              <button
                onClick={() => actions.clearStudent(s.id, note[s.id])}
                className="mt-2 w-full rounded-xl bg-primary py-2.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
              >
                Mark cleared
              </button>
            </article>
          ))}
        </Section>

        <Section title="In progress" empty="Everyone is at the finish line.">
          {inProgress.map((s) => {
            const pct = Math.min(100, Math.round((s.approved / s.requiredHours) * 100));
            return (
              <article key={s.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.studentNo} · {s.violation}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-primary">{pct}%</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{s.approved} of {s.requiredHours} hrs verified</p>
              </article>
            );
          })}
        </Section>

        <Section title="Cleared" empty="No clearances issued yet.">
          {cleared.map((s) => (
            <article key={s.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">Cleared {new Date(s.clearedAt!).toLocaleDateString()}</p>
                  {s.clearanceNote && <p className="mt-1 text-[11px] text-muted-foreground">"{s.clearanceNote}"</p>}
                </div>
                <Award className="h-5 w-5 text-success" />
              </div>
            </article>
          ))}
        </Section>
      </div>
    </>
  );
}

function Section({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <section>
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">{empty}</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
