import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { actions, getAdmin } from "@/lib/mock-data";
import { useTheme } from "@/lib/theme";
import {
  LogOut,
  Mail,
  Building2,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  Pencil,
  Sun,
  Moon,
  User,
} from "lucide-react";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Profile — SERVELOG" }] }),
  component: Profile,
});

function Profile() {
  const nav = useNavigate();
  const admin = getAdmin();
  const initials = admin.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <>
      <AppHeader title="Profile" />

      {/* Hero / identity card */}
      <section className="px-5 pt-2">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-secondary to-card p-5">
          <button
            aria-label="Edit profile"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-border bg-card/80 text-muted-foreground transition hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-card text-2xl font-semibold text-primary ring-4 ring-background">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold leading-tight">{admin.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{admin.email}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium bg-primary/15 text-primary">
                <ShieldCheck className="h-3 w-3" />
                Administrator
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Account info */}
      <section className="px-5 pt-6">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Account info</p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <InfoRow icon={User} label="Full name" value={admin.name} />
          <InfoRow icon={Mail} label="Email" value={admin.email} />
          <InfoRow icon={Building2} label="Office" value={admin.office} />
          <InfoRow icon={ShieldCheck} label="Role" value="Administrator" />
        </div>
      </section>

      {/* Preferences */}
      <section className="px-5 pt-6">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Preferences</p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <ThemeRow />
          <ActionRow icon={HelpCircle} label="Help & support" />
        </div>
      </section>

      <section className="px-5 pb-8 pt-4">
        <button
          onClick={async () => {
            const { signOut } = await import("@/lib/auth");
            await signOut();
            actions.setRole(null);
            nav({ to: "/login" });
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-destructive transition hover:border-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-secondary/40">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function ThemeRow() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? Moon : Sun;
  return (
    <div className="flex w-full items-center gap-3 px-4 py-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">Theme</p>
        <p className="text-[11px] text-muted-foreground">{isDark ? "Dark mode" : "Light mode"}</p>
      </div>
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${isDark ? "bg-primary" : "bg-secondary"}`}
      >
        <span
          className={`absolute top-0.5 grid h-5 w-5 place-items-center rounded-full bg-card text-[10px] shadow transition-all ${
            isDark ? "left-[22px]" : "left-0.5"
          }`}
        >
          {isDark ? "🌙" : "☀"}
        </span>
      </button>
    </div>
  );
}
