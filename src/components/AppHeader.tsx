import { ReactNode } from "react";
import { NotificationBell } from "./NotificationBell";
import { useStore, getStudent, getAdviser, getAdmin } from "@/lib/mock-data";

export function AppHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  const role = useStore((s) => s.role);
  const recipientId =
    role === "adviser" ? getAdviser().id : role === "admin" ? getAdmin().id : getStudent().id;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-5 py-4 backdrop-blur no-print">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {right}
        {role && <NotificationBell role={role} recipientId={recipientId} />}
      </div>
    </header>
  );
}
