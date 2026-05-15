import { ReactNode } from "react";

export function AppHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-5 py-4 backdrop-blur no-print">
      <div>
        <h1 className="text-lg font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
