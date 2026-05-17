import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { actions, getAdviser } from "@/lib/mock-data";
import { ChevronRight, CheckCircle2, LogOut } from "lucide-react";

export const Route = createFileRoute("/adviser/profile")({
  head: () => ({ meta: [{ title: "Profile — SERVELOG" }] }),
  component: AdviserProfile,
});

function AdviserProfile() {
  const nav = useNavigate();
  const adv = getAdviser();

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

        <Link
          to="/adviser/verified"
          className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition hover:border-primary"
        >
          <span className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="font-medium">Verified history</span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

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

