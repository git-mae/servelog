import { Link } from "@tanstack/react-router";
import { Home, PlusCircle, ClipboardList, FileText, User, Inbox, Users, CheckCircle2 } from "lucide-react";

const studentItems = [
  { to: "/app/home", label: "Home", icon: Home },
  { to: "/app/log", label: "Log", icon: PlusCircle },
  { to: "/app/history", label: "History", icon: ClipboardList },
  { to: "/app/reports", label: "Reports", icon: FileText },
  { to: "/app/profile", label: "Profile", icon: User },
] as const;

const adviserItems = [
  { to: "/adviser/queue", label: "Queue", icon: Inbox },
  { to: "/adviser/verified", label: "Verified", icon: CheckCircle2 },
  { to: "/adviser/students", label: "Students", icon: Users },
  { to: "/adviser/profile", label: "Profile", icon: User },
] as const;

export function BottomNav({ role }: { role: "student" | "adviser" }) {
  const items = role === "student" ? studentItems : adviserItems;
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur no-print">
      <ul className={`grid ${role === "student" ? "grid-cols-5" : "grid-cols-4"}`}>
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground transition-colors data-[status=active]:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
