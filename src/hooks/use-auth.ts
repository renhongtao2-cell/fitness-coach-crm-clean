"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore, type User } from "@/stores/auth-store";

export function useAuth() {
  const { user, setUser, setIsLoading, signOut: storeSignOut, isLoading: storeIsLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 浏览器端惰性创建 Supabase 客户端：避免 SSG 预渲染（构建期）因缺少
  // NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 而直接抛错退构建。
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  useEffect(() => {
    supabaseRef.current = createClient();
  }, []);

  const fetchUser = useCallback(async () => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    setIsLoading(true);
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            role: (profile.role as "coach" | "client") || "client",
            avatarUrl: profile.avatar_url,
          });
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth fetch error:", err);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [setUser, setIsLoading]);

  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUser, setUser]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const supabase = supabaseRef.current;
      if (!supabase) throw new Error("Supabase client not ready");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      await fetchUser();
      return { data, error: null };
    } catch (err: any) {
      const msg = err.message || "Sign in failed";
      setError(msg);
      return { data: null, error: msg };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "coach" | "client",
    referralCode?: string,
  ) => {
    setError(null);
    try {
      const supabase = supabaseRef.current;
      if (!supabase) throw new Error("Supabase client not ready");
      const body: any = { email, password, fullName, role };
      if (referralCode) {
        body.referralCode = referralCode;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Registration failed");
      }

      if (result.session?.access_token) {
        await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        });
      }

      setUser({
        id: result.user?.id || "",
        email: result.user?.email || email,
        fullName: fullName,
        role: result.role || role,
      });

      await fetchUser();

      return { data: result.user, error: null };
    } catch (err: any) {
      const msg = err.message || "Registration failed";
      setError(msg);
      return { data: null, error: msg };
    }
  };

  const signOut = async () => {
    const supabase = supabaseRef.current;
    if (supabase) await supabase.auth.signOut();
    storeSignOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const supabase = supabaseRef.current;
      if (!supabase) return { error: "Supabase client not ready" };
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== "undefined" ? window.location.origin + "/forgot-password" : "",
      });
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    user,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isLoading: loading,
    fetchUser,
  };
}
