import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { actions, getRoster, useStore } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/violations")({
  head: () => ({ meta: [{ title: "Violations — SERVELOG" }] }),
  component: Violations,
});

function Violations() {
  useStore((s) => s.roster);
  const roster = getRoster();
  const [form, setForm] = useState({
    name: "",
    studentNo: "",
    course: "BS Information Technology",
    email: "",
    violation: "",
    requiredHours: 15,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.studentNo || !form.violation) {
      toast.error("Name, student no., and violation are required.");
      return;
    }
    actions.addViolation(form);
    toast.success("Violation recorded.");
    setForm({ name: "", studentNo: "", course: "BS Information Technology", email: "", violation: "", requiredHours: 15 });
  };

  return (
    <>
      <AppHeader title="Violations" subtitle={`${roster.length} on file`} />
      <div className="space-y-6 px-5 py-5">
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Record a new offense, or update an existing student by student no.</p>
          <Field label="Full name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Student no.">
              <input value={form.studentNo} onChange={(e) => setForm({ ...form, studentNo: e.target.value })} className="input" placeholder="2023-00001" />
            </Field>
            <Field label="Required hrs">
              <input type="number" min={1} value={form.requiredHours} onChange={(e) => setForm({ ...form, requiredHours: Number(e.target.value) })} className="input" />
            </Field>
          </div>
          <Field label="Course">
            <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="input" />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </Field>
          <Field label="Violation">
            <input value={form.violation} onChange={(e) => setForm({ ...form, violation: e.target.value })} className="input" placeholder="Improper uniform (2nd offense)" />
          </Field>
          <button className="mt-1 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Save violation
          </button>
        </form>

        <section>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Students on file</p>
          <div className="space-y-2">
            {roster.map((s) => (
              <article key={s.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.studentNo} · {s.course}</p>
                    <p className="mt-1 text-[11px] text-destructive">{s.violation}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">{s.requiredHours} hrs</span>
                </div>
                {s.clearedAt && <p className="mt-2 text-[11px] text-success">Cleared {new Date(s.clearedAt).toLocaleDateString()}</p>}
              </article>
            ))}
          </div>
        </section>
      </div>
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid hsl(var(--input));background:var(--card);padding:0.625rem 0.875rem;font-size:0.875rem;outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
