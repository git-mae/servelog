import { Link } from "@tanstack/react-router";
import { Home, PlusCircle, ClipboardList, FileText, User, Inbox, Users, ShieldCheck, Megaphone } from "lucide-react";

const studentItems = [
  { to: "/app/home", label: "Home", icon: Home },
  { to: "/app/log", label: "Log", icon: PlusCircle },
  { to: "/app/history", label: "History", icon: ClipboardList },
  { to: "/app/reports", label: "Reports", icon: FileText },
  { to: "/app/profile", label: "Profile", icon: User },
] as const;

const adminItems = [
  { to: "/admin/queue", label: "Queue", icon: Inbox },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/opportunities", label: "Posts", icon: Megaphone },
  { to: "/admin/clearance", label: "Clearance", icon: ShieldCheck },
  { to: "/admin/profile", label: "Profile", icon: User },
] as const;

export function BottomNav({ role }: { role: "student" | "admin" }) {
  const items = role === "student" ? studentItems : adminItems;
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur no-print">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="min-w-0">
            <Link
              to={to}
              className="flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] text-muted-foreground transition-colors"
              activeProps={{ className: "text-primary font-medium" }}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
