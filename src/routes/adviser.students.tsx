import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { getRoster, studentTotals, useStore } from "@/lib/mock-data";

export const Route = createFileRoute("/adviser/students")({
  head: () => ({ meta: [{ title: "Students — SERVELOG" }] }),
  component: Students,
});

type Filter = "all" | "at-risk" | "on-track" | "done";

function Students() {
  useStore((s) => s.submissions); // re-render
  const roster = getRoster();
  const [filter, setFilter] = useState<Filter>("all");

  const data = roster.map((s) => {
    const { approved } = studentTotals(s.id);
    const pct = Math.min(100, Math.round((approved / s.requiredHours) * 100));
    const tag: Filter = pct >= 100 ? "done" : pct >= 50 ? "on-track" : "at-risk";
    return { ...s, approved, pct, tag };
  });
  const list = data.filter((s) => filter === "all" || s.tag === filter);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "at-risk", label: "At risk" },
    { key: "on-track", label: "On track" },
    { key: "done", label: "Done" },
  ];

  return (
    <>
      <AppHeader title="Students" subtitle={`${roster.length} assigned`} />
      <div className="px-5 pt-4">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-secondary p-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setFilter(t.key)} className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${filter === t.key ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2 px-5 py-4">
        {list.map((s) => (
          <article key={s.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.studentNo} · {s.violation}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-primary">{s.pct}%</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.pct}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{s.approved} of {s.requiredHours} hrs completed</p>
          </article>
        ))}
      </div>
    </>
  );
}
