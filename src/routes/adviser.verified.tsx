import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useStore, getRoster } from "@/lib/mock-data";

export const Route = createFileRoute("/adviser/verified")({
  head: () => ({ meta: [{ title: "Verified — SERVELOG" }] }),
  component: Verified,
});

function Verified() {
  const all = useStore((s) => s.submissions);
  const subs = useMemo(() => all.filter((x) => x.status !== "pending"), [all]);
  const roster = getRoster();

  return (
    <>
      <AppHeader title="Verified history" subtitle={`${subs.length} actioned`} />
      <div className="space-y-2 px-5 py-5">
        {subs.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">No reviewed submissions yet.</p>
        )}
        {subs.map((s) => {
          const stu = roster.find((r) => r.id === s.studentId);
          return (
            <article key={s.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stu?.name} · {new Date(s.date).toLocaleDateString()} · {s.hours}h</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${s.status === "approved" ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>{s.status}</span>
              </div>
              {s.adviserComment && <p className="mt-2 text-[11px] text-muted-foreground">Note: {s.adviserComment}</p>}
            </article>
          );
        })}
      </div>
    </>
  );
}
