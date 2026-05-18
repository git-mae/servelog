import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { actions, getAdmin } from "@/lib/mock-data";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Profile — SERVELOG" }] }),
  component: Profile,
});

function Profile() {
  const nav = useNavigate();
  const admin = getAdmin();
  return (
    <>
      <AppHeader title="Profile" />
      <section className="px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-xl font-semibold text-primary">
            {admin.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="font-semibold">{admin.name}</p>
            <p className="text-xs text-muted-foreground">{admin.office}</p>
            <p className="text-xs text-muted-foreground">{admin.email}</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Card label="Role" value="Administrator" />
          <Card label="Office" value={admin.office} />
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
