import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // FIX: 移除硬编码的 URL / anon key 兜底值。
  // 原先 `|| "https://...supabase.co"` 和 `|| "sb_publishable_..."` 会让 key 明文进 git 历史，
  // 且无法通过环境变量轮换。现在强制要求部署平台（Vercel）配置好这两个变量。
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "请在 Vercel 项目环境变量里配置这两项后再部署。"
    );
  }

  return createBrowserClient(url, key);
}
