import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { actions, getStudent, studentTotals, useStore } from "@/lib/mock-data";
import { useTheme } from "@/lib/theme";
import {
  LogOut,
  Mail,
  GraduationCap,
  IdCard,
  AlertOctagon,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  Pencil,
  Sun,
  Moon,
} from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — SERVELOG" }] }),
  component: Profile,
});

function Profile() {
  const nav = useNavigate();
  const subs = useStore((s) => s.submissions);
  const student = getStudent();
  const { approved, pending } = studentTotals(student.id);
  const remaining = Math.max(0, student.requiredHours - approved);
  const pct = Math.min(100, Math.round((approved / student.requiredHours) * 100));
  const total = subs.filter((s) => s.studentId === student.id).length;
  const initials = student.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const cleared = !!student.clearedAt;

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
              <p className="truncate text-lg font-semibold leading-tight">{student.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{student.course}</p>
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                  cleared
                    ? "bg-success/15 text-success"
                    : pct >= 100
                    ? "bg-primary/15 text-primary"
                    : "bg-warning/15 text-warning"
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                {cleared ? "Cleared" : pct >= 100 ? "Awaiting clearance" : "In progress"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress card */}
      <section className="px-5 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Service progress</p>
              <p className="mt-1 text-2xl font-semibold leading-none">
                {approved}
                <span className="text-sm font-medium text-muted-foreground"> / {student.requiredHours} hrs</span>
              </p>
            </div>
            <span className="text-sm font-semibold text-primary">{pct}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Mini label="Approved" value={`${approved}h`} tone="success" />
            <Mini label="Pending" value={`${pending}h`} tone="warning" />
            <Mini label="Remaining" value={`${remaining}h`} tone="muted" />
          </div>
        </div>
      </section>

      {/* Personal info */}
      <section className="px-5 pt-6">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Personal info</p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <InfoRow icon={IdCard} label="Student No." value={student.studentNo} />
          <InfoRow icon={GraduationCap} label="Course" value={student.course} />
          <InfoRow icon={Mail} label="Email" value={student.email} />
        </div>
      </section>

      {/* Discipline record */}
      <section className="px-5 pt-6">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Discipline record</p>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <AlertOctagon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{student.violation}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{student.requiredHours} hours of community service required</p>
            </div>
          </div>
          {cleared && student.clearanceNote && (
            <p className="mt-3 rounded-xl bg-success/10 px-3 py-2 text-[11px] text-success">
              OSD note: {student.clearanceNote}
            </p>
          )}
        </div>
      </section>

      {/* Activity stat */}
      <section className="grid grid-cols-2 gap-3 px-5 pt-4">
        <StatTile label="Total logs" value={String(total)} />
        <StatTile label="Approved logs" value={String(subs.filter((s) => s.studentId === student.id && s.status === "approved").length)} />
      </section>

      {/* Settings list */}
      <section className="px-5 pt-6">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Account</p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <ActionRow icon={Bell} label="Notifications" />
          <ActionRow icon={Settings} label="Preferences" />
          <ActionRow icon={HelpCircle} label="Help & support" />
        </div>
      </section>

      <section className="px-5 pb-8 pt-4">
        <Link
          to="/app/reports"
          className="flex items-center justify-center rounded-xl border border-border bg-card py-3 text-sm font-medium text-primary transition hover:border-primary"
        >
          View hours summary report
        </Link>
        <button
          onClick={() => {
            actions.setRole(null);
            nav({ to: "/" });
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-destructive transition hover:border-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    </>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "muted" }) {
  const toneCls =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-xl bg-secondary/60 px-2 py-2">
      <p className={`text-sm font-semibold ${toneCls}`}>{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
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

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-2xl font-semibold leading-none">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
