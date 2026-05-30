import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useStore, getRoster } from "@/lib/mock-data";
import { AlertTriangle, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/queue")({
  head: () => ({ meta: [{ title: "Review Queue — SERVELOG" }] }),
  component: Queue,
});

function Queue() {
  const all = useStore((s) => s.submissions);
  const roster = getRoster();
  const pending = useMemo(() => all.filter((s) => s.status === "pending"), [all]);
  const approved = useMemo(() => all.filter((s) => s.status === "approved").length, [all]);
  const rejected = useMemo(() => all.filter((s) => s.status === "rejected").length, [all]);
  const flagged = pending.filter((s) => s.flagged).length;

  return (
    <>
      <AppHeader title="Review queue" subtitle={`${pending.length} pending · ${flagged} flagged`} />
      <div className="space-y-4 px-5 py-5">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Pending" value={pending.length} />
          <Stat label="Approved" value={approved} />
          <Stat label="Rejected" value={rejected} />
        </div>

        <Link to="/admin/verified" className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm transition hover:border-primary">
          <span>Verified history</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <div className="space-y-2">
          {pending.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">All caught up.</p>
          )}
          {pending.map((s) => {
            const stu = roster.find((r) => r.id === s.studentId);
            return (
              <Link key={s.id} to="/admin/review/$id" params={{ id: s.id }} className="block rounded-2xl border border-border bg-card p-4 transition hover:border-primary">
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
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
