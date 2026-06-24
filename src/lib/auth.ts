import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "admin";

export interface AuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  role: AppRole | null;
}

async function fetchRole(userId: string): Promise<AppRole | null> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (!data || data.length === 0) return null;
  if (data.some((r) => r.role === "admin")) return "admin";
  return "student";
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    session: null,
    user: null,
    role: null,
  });

  useEffect(() => {
    let active = true;

    const apply = async (session: Session | null) => {
      if (!active) return;
      if (!session?.user) {
        setState({ loading: false, session: null, user: null, role: null });
        return;
      }
      // Defer the role fetch so we don't block the auth callback
      setTimeout(async () => {
        const role = await fetchRole(session.user.id);
        if (!active) return;
        setState({ loading: false, session, user: session.user, role });
      }, 0);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session);
    });

    supabase.auth.getSession().then(({ data }) => apply(data.session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function signOut() {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    localStorage.removeItem("servelog:role");
  }
}
