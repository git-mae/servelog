import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useStore, getStudent, type SubmissionStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/app/history")({
  head: () => ({ meta: [{ title: "History — SERVELOG" }] }),
  component: History,
});

const tabs: { key: "all" | SubmissionStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

function History() {
  const subs = useStore((s) => s.submissions);
  const student = getStudent();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const list = subs.filter((s) => s.studentId === student.id && (tab === "all" || s.status === tab));

  return (
    <>
      <AppHeader title="My submissions" subtitle={`${subs.filter((s) => s.studentId === student.id).length} entries`} />
      <div className="px-5 pt-4">
        <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-secondary p-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${tab === t.key ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 px-5 py-4">
        {list.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">Nothing here yet.</p>
        )}
        {list.map((s) => (
          <article key={s.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.organizer} · {new Date(s.date).toLocaleDateString()}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                s.status === "approved" ? "bg-success/15 text-success" : s.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"
              }`}>{s.status}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{s.location}</span>
              <span className="font-medium text-foreground">{s.hours} hrs</span>
            </div>
            {s.flagged && s.status === "pending" && (
              <p className="mt-2 rounded-lg bg-warning/10 px-2.5 py-1.5 text-[11px] text-warning">AI flagged: possible duplicate</p>
            )}
            {s.reviewerComment && (
              <p className="mt-2 rounded-lg bg-destructive/5 px-2.5 py-1.5 text-[11px] text-destructive">OSD: {s.reviewerComment}</p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
