import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("servelog:role");
      if (role !== "student") throw redirect({ to: "/" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
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
