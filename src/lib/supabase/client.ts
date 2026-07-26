import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arxmmamibjisvknacoun.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_siuJ9sVKtPGnSiSh8A8XlQ_jqRKTuBj";
  return createBrowserClient(url, key);
}
