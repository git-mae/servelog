import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-secondary/40">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background shadow-sm md:my-6 md:min-h-[calc(100vh-3rem)] md:rounded-3xl md:border md:border-border md:overflow-hidden">
        {children}
      </div>
    </div>
  );
}
