import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PhoneFrame } from "@/components/PhoneFrame";
import { seedUpcomingReminders, actions } from "@/lib/mock-data";
import { ensurePermission } from "@/lib/browser-notifications";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const nav = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    ensurePermission();
    seedUpcomingReminders();
  }, []);

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      nav({ to: "/login" });
      return;
    }
    if (auth.role === "admin") {
      nav({ to: "/admin/queue" });
      return;
    }
    actions.setRole("student");
  }, [auth.loading, auth.user, auth.role, nav]);

  if (auth.loading || !auth.user || auth.role === "admin") {
    return (
      <PhoneFrame>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pb-2">
          <Outlet />
        </main>
        <BottomNav role="student" />
      </div>
    </PhoneFrame>
  );
}
