import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { actions, type Role } from "@/lib/mock-data";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Sprout } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — SERVELOG" }] }),
  component: LoginPage,
});

const DEST: Record<Role, string> = {
  student: "/app/home",
  admin: "/admin/queue",
};

const EMAIL: Record<Role, string> = {
  student: "patrizia.rodriguez@neu.edu.ph",
  admin: "r.bautista@neu.edu.ph",
};

function LoginPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState(EMAIL.student);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.setRole(role);
    nav({ to: DEST[role] });
  };

  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
        <div className="flex items-center gap-2 text-primary">
          <Sprout className="h-6 w-6" />
          <span className="text-sm font-medium tracking-widest uppercase">ServeLog</span>
        </div>
        <div className="mt-10">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in with your NEU account.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
            {(["student", "admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setEmail(EMAIL[r]); }}
                className={`rounded-lg px-2 py-2 text-xs font-medium transition ${role === r ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
              >
                {r === "student" ? "Student" : "OSD"}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">NEU Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Password</span>
            <input
              type="password"
              defaultValue="••••••••"
              className="mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <button className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Sign in
          </button>
          <p className="text-center text-[11px] text-muted-foreground">Demo · no real auth</p>
        </form>
      </div>
    </PhoneFrame>
  );
}
