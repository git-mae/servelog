import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sprout, Loader2 } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { actions } from "@/lib/mock-data";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — SERVELOG" }] }),
  component: LoginPage,
});

type Mode = "signin" | "signup";

function LoginPage() {
  const nav = useNavigate();
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  // When session + role land, route the user to the right area
  useEffect(() => {
    if (auth.loading || !auth.user) return;
    const role = auth.role ?? "student";
    actions.setRole(role); // keep legacy mock store in sync for now
    nav({ to: role === "admin" ? "/admin/queue" : "/app/home" });
  }, [auth.loading, auth.user, auth.role, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const redirectTo =
          typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created", {
          description: "Check your email to confirm, then sign in.",
        });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // navigation handled by the effect above once role is loaded
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(mode === "signup" ? "Sign up failed" : "Sign in failed", {
        description: msg,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
        <div className="flex items-center gap-2 text-primary">
          <Sprout className="h-6 w-6" />
          <span className="text-sm font-medium tracking-widest uppercase">ServeLog</span>
        </div>

        <div className="mt-10">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in with your NEU account."
              : "Use your NEU email to register."}
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-lg px-2 py-2 text-xs font-medium transition ${
                  mode === m ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Full name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
          )}

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">NEU Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <button
            disabled={busy}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            <Link to="/" className="underline">Back to home</Link>
          </p>
        </form>
      </div>
    </PhoneFrame>
  );
}
