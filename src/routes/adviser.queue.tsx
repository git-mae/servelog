import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { useStore, getRoster } from "@/lib/mock-data";
import { AlertTriangle, ChevronRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/adviser/queue")({
  head: () => ({ meta: [{ title: "Review Queue — SERVELOG" }] }),
  component: Queue,
});

function Queue() {
  const subs = useStore((s) => s.submissions);
  const roster = getRoster();
  const pending = subs.filter((s) => s.status === "pending");
  const flagged = pending.filter((s) => s.flagged).length;

  return (
    <>
      <AppHeader title="Review queue" subtitle={`${pending.length} pending · ${flagged} flagged`} />
      <div className="space-y-2 px-5 py-5">
        <Link
          to="/adviser/verified"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 transition hover:border-primary"
        >
          <span className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="font-medium">Verified history</span>
            <span className="text-xs text-muted-foreground">approved & rejected</span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        {pending.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">All caught up.</p>
        )}
        {pending.map((s) => {
          const stu = roster.find((r) => r.id === s.studentId);
          return (
            <Link key={s.id} to="/adviser/review/$id" params={{ id: s.id }} className="block rounded-2xl border border-border bg-card p-4 transition hover:border-primary">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stu?.name ?? "Student"} · {new Date(s.date).toLocaleDateString()}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{s.location}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">{s.hours} hrs</span>
              </div>
              {s.flagged && (
                <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-warning/10 px-2.5 py-1.5 text-[11px] text-warning">
                  <AlertTriangle className="h-3.5 w-3.5" /> AI flagged: possible duplicate entry
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
