import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/adviser")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("servelog:role");
      if (role !== "adviser") throw redirect({ to: "/" });
    }
  },
  component: AdviserLayout,
});

function AdviserLayout() {
  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pb-2">
          <Outlet />
        </main>
        <BottomNav role="adviser" />
      </div>
    </PhoneFrame>
  );
}
