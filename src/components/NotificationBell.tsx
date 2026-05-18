import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCircle2, XCircle, Inbox, CalendarClock, ShieldCheck, AlertOctagon, Award } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { actions, getUnreadCount, getNotifications, useStore, type NotifKind, type Role } from "@/lib/mock-data";

const ICONS: Record<NotifKind, React.ComponentType<{ className?: string }>> = {
  submitted: Inbox,
  approved: CheckCircle2,
  rejected: XCircle,
  upcoming: CalendarClock,
  "ready-clearance": ShieldCheck,
  cleared: Award,
  violation: AlertOctagon,
};

const TONE: Record<NotifKind, string> = {
  submitted: "text-primary bg-primary/10",
  approved: "text-success bg-success/10",
  rejected: "text-destructive bg-destructive/10",
  upcoming: "text-warning bg-warning/10",
  "ready-clearance": "text-primary bg-primary/10",
  cleared: "text-success bg-success/10",
  violation: "text-destructive bg-destructive/10",
};

export function NotificationBell({ role, recipientId }: { role: Role; recipientId: string }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  // Subscribe to notifications so the badge updates live.
  useStore((s) => s.notifications);
  const items = getNotifications(role, recipientId);
  const unread = getUnreadCount(role, recipientId);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v && unread > 0) setTimeout(() => actions.markAllRead(role), 400);
      }}
    >
      <SheetTrigger asChild>
        <button
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
          className="relative rounded-xl border border-border bg-card p-2 text-foreground transition hover:border-primary"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {items.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              You're all caught up.
            </p>
          )}
          {items.map((n) => {
            const Icon = ICONS[n.kind];
            const go = () => {
              if (!n.href) return;
              setOpen(false);
              nav({ to: n.href as string, params: (n.hrefParams ?? {}) as never });
            };
            return (
              <button
                key={n.id}
                type="button"
                onClick={go}
                className={`block w-full rounded-2xl border p-3 text-left transition ${n.read ? "border-border bg-card" : "border-primary/40 bg-primary/5"}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${TONE[n.kind]}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
