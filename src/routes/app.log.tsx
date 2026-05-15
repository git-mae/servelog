import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { actions } from "@/lib/mock-data";
import { Upload, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/log")({
  head: () => ({ meta: [{ title: "Log Activity — SERVELOG" }] }),
  component: LogActivity,
});

function LogActivity() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    organizer: "",
    location: "",
    date: new Date().toISOString().slice(0, 10),
    hours: 1,
    description: "",
    proofDataUrl: undefined as string | undefined,
  });

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, proofDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.organizer) {
      toast.error("Please complete all required fields.");
      return;
    }
    const sub = actions.addSubmission({
      title: form.title,
      organizer: form.organizer,
      location: form.location,
      date: form.date,
      hours: Number(form.hours),
      description: form.description,
      proofDataUrl: form.proofDataUrl,
    });
    if (sub.flagged) {
      toast.warning("AI flagged a possible duplicate. Adviser will review carefully.");
    } else {
      toast.success("Submitted for adviser review.");
    }
    nav({ to: "/app/history" });
  };

  return (
    <>
      <AppHeader title="Log activity" subtitle="Submit proof for adviser review" />
      <form onSubmit={submit} className="space-y-4 px-5 py-5">
        <Field label="Activity title *">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Feeding Program" className="input" />
        </Field>
        <Field label="Organizer *">
          <input required value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} placeholder="e.g. NEU CSO" className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date *">
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
          </Field>
          <Field label="Hours *">
            <input required type="number" min={1} max={24} value={form.hours} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} className="input" />
          </Field>
        </div>
        <Field label="Location *">
          <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Brgy. / venue" className="input" />
        </Field>
        <Field label="Description">
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe what you did" className="input resize-none" />
        </Field>

        <div>
          <p className="text-xs font-medium text-muted-foreground">Proof of participation</p>
          {form.proofDataUrl ? (
            <div className="relative mt-1.5 overflow-hidden rounded-2xl border border-border">
              <img src={form.proofDataUrl} alt="Proof preview" className="h-48 w-full object-cover" />
              <button type="button" onClick={() => setForm({ ...form, proofDataUrl: undefined })} className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow-sm">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="mt-1.5 flex h-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary">
              <Upload className="h-5 w-5" />
              <span className="text-xs">Tap to upload photo or certificate</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>AI will check this entry for possible duplicates against your previous submissions before it reaches your adviser.</p>
        </div>

        <button className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
          Submit for review
        </button>
      </form>

      <style>{`.input{margin-top:6px;width:100%;border-radius:0.75rem;border:1px solid var(--input);background:var(--card);padding:0.7rem 0.9rem;font-size:0.875rem;outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
