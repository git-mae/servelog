import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { actions, getAdviser, getRoster, useStore } from "@/lib/mock-data";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/adviser/profile")({
  head: () => ({ meta: [{ title: "Profile — SERVELOG" }] }),
  component: AdviserProfile,
});

function AdviserProfile() {
  const nav = useNavigate();
  const adv = getAdviser();
  const subs = useStore((s) => s.submissions);
  const pending = subs.filter((s) => s.status === "pending").length;
  const approved = subs.filter((s) => s.status === "approved").length;
  const rejected = subs.filter((s) => s.status === "rejected").length;

  return (
    <>
      <AppHeader title="Profile" />
      <section className="px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-xl font-semibold text-primary">
            {adv.name.split(" ").slice(-2).map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold">{adv.name}</p>
            <p className="text-xs text-muted-foreground">{adv.email}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{adv.department}</p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Stat label="Pending" value={pending} />
          <Stat label="Approved" value={approved} />
          <Stat label="Rejected" value={rejected} />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Assigned students</p>
          <p className="mt-1 text-2xl font-semibold">{getRoster().length}</p>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
