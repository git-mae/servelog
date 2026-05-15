import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { actions, findSimilar, getRoster, useStore } from "@/lib/mock-data";
import { AlertTriangle, ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/adviser/review/$id")({
  head: () => ({ meta: [{ title: "Review Submission — SERVELOG" }] }),
  component: Review,
});

function Review() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const sub = useStore((s) => s.submissions.find((x) => x.id === id));
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState<"idle" | "reject">("idle");

  if (!sub) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Submission not found. <Link to="/adviser/queue" className="text-primary">Back to queue</Link>
      </div>
    );
  }

  const stu = getRoster().find((r) => r.id === sub.studentId);
  const similar = sub.flagged ? findSimilar(sub) : undefined;
  const similarStu = similar ? getRoster().find((r) => r.id === similar.studentId) : undefined;

  const approve = () => {
    actions.decide(sub.id, "approved");
    toast.success("Submission approved.");
    nav({ to: "/adviser/queue" });
  };
  const reject = () => {
    if (!comment.trim()) { toast.error("Please add a comment for the student."); return; }
    actions.decide(sub.id, "rejected", comment.trim());
    toast.success("Submission rejected with comment.");
    nav({ to: "/adviser/queue" });
  };

  return (
    <>
      <AppHeader
        title="Review"
        subtitle={stu?.name}
        right={
          <Link to="/adviser/queue" className="rounded-xl border border-border bg-card p-1.5 hover:border-primary">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        }
      />
      <section className="space-y-4 px-5 py-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-base font-medium">{sub.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{sub.organizer}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <Meta icon={Calendar} label={new Date(sub.date).toLocaleDateString()} />
            <Meta icon={Clock} label={`${sub.hours} hrs`} />
            <Meta icon={MapPin} label={sub.location} />
          </div>
          {sub.description && <p className="mt-3 text-xs text-muted-foreground">{sub.description}</p>}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Proof of participation</p>
          {sub.proofDataUrl ? (
            <img src={sub.proofDataUrl} alt="Proof" className="w-full rounded-2xl border border-border object-cover" />
          ) : (
            <div className="grid h-40 place-items-center rounded-2xl border border-dashed border-border bg-secondary/40 text-xs text-muted-foreground">
              No proof image attached (legacy entry)
            </div>
          )}
        </div>

        {sub.flagged && similar && (
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm font-medium">AI duplicate detection</p>
            </div>
            <p className="mt-1 text-xs text-warning/90">Matches {similarStu?.name}'s submission on {new Date(similar.date).toLocaleDateString()} at {similar.location}.</p>
            <div className="mt-3 rounded-xl bg-card p-3 text-[11px]">
              <p className="font-medium">{similar.title}</p>
              <p className="text-muted-foreground">{similar.organizer} · {similar.hours} hrs</p>
            </div>
          </div>
        )}

        {mode === "idle" ? (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setMode("reject")} className="rounded-xl border border-border bg-card py-3 text-sm font-medium text-destructive hover:border-destructive">Reject</button>
            <button onClick={approve} className="rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Approve</button>
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">Reason for rejection (visible to student)</p>
            <textarea autoFocus rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="e.g. Proof is unclear; please re-upload." className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setMode("idle"); setComment(""); }} className="rounded-xl border border-border py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={reject} className="rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90">Confirm reject</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Meta({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-2 py-1.5 text-secondary-foreground">
      <Icon className="h-3 w-3" />
      <span className="truncate">{label}</span>
    </div>
  );
}
