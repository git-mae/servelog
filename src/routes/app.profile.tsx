import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { actions, getStudent, studentTotals, useStore } from "@/lib/mock-data";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — SERVELOG" }] }),
  component: Profile,
});

function Profile() {
  const nav = useNavigate();
  const subs = useStore((s) => s.submissions);
  const student = getStudent();
  const { approved } = studentTotals(student.id);
  const remaining = Math.max(0, student.requiredHours - approved);

  return (
    <>
      <AppHeader title="Profile" />
      <section className="px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-xl font-semibold text-primary">
            {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="font-semibold">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.studentNo}</p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Card label="Course" value={student.course} />
          <Card label="Violation on file" value={student.violation} />
          <Card label="Required hours" value={`${student.requiredHours} hrs`} />
          <Card label="Approved" value={`${approved} hrs`} />
          <Card label="Remaining" value={`${remaining} hrs`} />
          <Card label="Total submissions" value={String(subs.filter((s) => s.studentId === student.id).length)} />
        </div>

        <button
          onClick={() => { actions.setRole(null); nav({ to: "/" }); }}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-destructive transition hover:border-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    </>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
