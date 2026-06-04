import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { actions, getRoster, useStore } from "@/lib/mock-data";
import { VIOLATION_CATEGORIES } from "@/lib/violation-categories";
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
    requiredHours: 15,
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");

  const selectedLabels = useMemo(() => {
    const flat = VIOLATION_CATEGORIES.flatMap((c) => c.items);
    return selected.map((code) => flat.find((i) => i.code === code)?.label).filter(Boolean) as string[];
  }, [selected]);

  const toggle = (code: string, defaultHours: number) => {
    setSelected((prev) => {
      if (prev.includes(code)) {
        const next = prev.filter((c) => c !== code);
        // recompute suggested hours = max defaultHours of remaining
        const flat = VIOLATION_CATEGORIES.flatMap((c) => c.items);
        const max = next.reduce((m, c) => Math.max(m, flat.find((i) => i.code === c)?.defaultHours ?? 0), 0);
        if (max > 0) setForm((f) => ({ ...f, requiredHours: max }));
        return next;
      }
      setForm((f) => ({ ...f, requiredHours: Math.max(f.requiredHours, defaultHours) }));
      return [...prev, code];
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = [...selectedLabels];
    if (otherText.trim()) parts.push(otherText.trim());
    const violation = parts.join(", ");
    if (!form.name || !form.studentNo || !violation) {
      toast.error("Name, student no., and at least one violation are required.");
      return;
    }
    actions.addViolation({ ...form, violation });
    toast.success("Violation recorded.");
    setForm({ name: "", studentNo: "", course: "BS Information Technology", email: "", requiredHours: 15 });
    setSelected([]);
    setOtherText("");
  };

  return (
    <>
      <AppHeader title="Violations" subtitle={`${roster.length} on file`} />
      <div className="space-y-6 px-5 py-5">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Record a new offense. Pick from the categories below or use “Other” for anything not listed.
          </p>

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

          <div className="space-y-3 rounded-xl border border-border bg-background/50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Check the appropriate boxes</p>
            {VIOLATION_CATEGORIES.map((cat) => (
              <div key={cat.key}>
                <p className="text-xs font-semibold text-primary">{cat.key}. {cat.label}</p>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                  {cat.items.map((it) => {
                    const active = selected.includes(it.code);
                    return (
                      <button
                        type="button"
                        key={it.code}
                        onClick={() => toggle(it.code, it.defaultHours)}
                        className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[11px] transition ${
                          active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className={`mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                          {active && <span className="text-[8px] leading-none">✓</span>}
                        </span>
                        <span className="leading-tight">{it.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold text-primary">Other</p>
              <input
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                className="input mt-1.5"
                placeholder="Specify if not in the categories above"
              />
            </div>
          </div>

          {(selectedLabels.length > 0 || otherText) && (
            <div className="rounded-xl bg-secondary/60 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Summary</p>
              <p className="mt-1 text-xs text-foreground">{[...selectedLabels, otherText.trim()].filter(Boolean).join(", ")}</p>
            </div>
          )}

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
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid var(--input);background:var(--card);padding:0.625rem 0.875rem;font-size:0.875rem;outline:none;color:var(--foreground)}.input:focus{border-color:var(--primary)}`}</style>
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
