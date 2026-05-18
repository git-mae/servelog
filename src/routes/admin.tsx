import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ensurePermission } from "@/lib/browser-notifications";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("servelog:role");
      if (role !== "admin") throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  useEffect(() => { ensurePermission(); }, []);
  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pb-2">
          <Outlet />
        </main>
        <BottomNav role="admin" />
      </div>
    </PhoneFrame>
  );
}
