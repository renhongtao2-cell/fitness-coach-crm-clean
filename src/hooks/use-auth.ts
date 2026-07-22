"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore, type User } from "@/stores/auth-store";

export function useAuth() {
  const { user, setUser, setIsLoading, signOut: storeSignOut, isLoading: storeIsLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchUser = useCallback(async () => {
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
  }, [supabase, setUser, setIsLoading]);

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUser, supabase, setUser]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
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
    await supabase.auth.signOut();
    storeSignOut();
  };

  const resetPassword = async (email: string) => {
    try {
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
