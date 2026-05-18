import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { actions, getOpportunities, useStore } from "@/lib/mock-data";
import { toast } from "sonner";
import { Megaphone } from "lucide-react";

export const Route = createFileRoute("/admin/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities — SERVELOG" }] }),
  component: Opportunities,
});

function Opportunities() {
  useStore((s) => s.opportunities);
  const ops = getOpportunities();
  const [form, setForm] = useState({ title: "", organizer: "", date: "", location: "", hours: 4, tag: "Community" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      toast.error("Title, date, and location are required.");
      return;
    }
    actions.addOpportunity(form);
    toast.success("Activity posted to students.");
    setForm({ title: "", organizer: "", date: "", location: "", hours: 4, tag: "Community" });
  };

  return (
    <>
      <AppHeader title="Post activity" subtitle={`${ops.length} listed`} />
      <div className="space-y-6 px-5 py-5">
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Brigada Eskwela cleanup" />
          </Field>
          <Field label="Organizer">
            <input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} className="input" placeholder="NEU Outreach Office" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
            </Field>
            <Field label="Hours">
              <input type="number" min={1} value={form.hours} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} className="input" />
            </Field>
          </div>
          <Field label="Location">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" placeholder="Brgy. Commonwealth" />
          </Field>
          <Field label="Category">
            <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="input" placeholder="Education" />
          </Field>
          <button className="mt-1 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Post activity
          </button>
        </form>

        <section>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Posted activities</p>
          <div className="space-y-2">
            {ops.map((o) => (
              <article key={o.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{o.title}</p>
                    <p className="text-xs text-muted-foreground">{o.organizer} · {new Date(o.date).toLocaleDateString()}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{o.location}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">{o.hours} hrs</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid hsl(var(--input));background:var(--card);padding:0.625rem 0.875rem;font-size:0.875rem;outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
      <div className="sr-only"><Megaphone /></div>
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
