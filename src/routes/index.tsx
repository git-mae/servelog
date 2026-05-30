import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Sprout, Building2 } from "lucide-react";
import { actions, type Role } from "@/lib/mock-data";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SERVELOG — NEU Community Service Tracker" },
      { name: "description", content: "Log, verify, and track community service hours at New Era University." },
      { property: "og:title", content: "SERVELOG — NEU Community Service Tracker" },
      { property: "og:description", content: "Mobile-first system for logging and verifying student community service hours." },
    ],
  }),
  component: Landing,
});

const DEST: Record<Role, string> = {
  student: "/app/home",
  admin: "/admin/queue",
};

function Landing() {
  const navigate = useNavigate();
  const pick = (role: Role) => {
    actions.setRole(role);
    navigate({ to: DEST[role] });
  };
  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
        <div className="flex items-center gap-2 text-primary">
          <Sprout className="h-6 w-6" />
          <span className="text-sm font-medium tracking-widest uppercase">ServeLog</span>
        </div>

        <div className="mt-12">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Track every <span className="text-primary">service hour.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            A quiet, paperless way for New Era University students to complete community service requirements — verified by the Office of Student Discipline.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Continue as</p>

          <button
            onClick={() => pick("student")}
            className="group flex w-full items-center justify-between rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Student</p>
                <p className="text-xs text-muted-foreground">Log activities & track progress</p>
              </div>
            </div>
            <span className="text-primary opacity-0 transition group-hover:opacity-100">→</span>
          </button>

          <button
            onClick={() => pick("admin")}
            className="group flex w-full items-center justify-between rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Office of Student Discipline</p>
                <p className="text-xs text-muted-foreground">Verify hours, post activities, issue clearance</p>
              </div>
            </div>
            <span className="text-primary opacity-0 transition group-hover:opacity-100">→</span>
          </button>
        </div>

        <div className="mt-auto pt-10 text-center text-[11px] text-muted-foreground">
          Demo build · No real authentication ·{" "}
          <Link to="/login" className="underline underline-offset-2">Sign in</Link>
        </div>
      </div>
    </PhoneFrame>
  );
}
