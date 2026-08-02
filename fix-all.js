const fs = require("fs");
const path = require("path");

console.log("=== Fixing all files ===");

// 1. Fix coachees/page.tsx
let list = fs.readFileSync(path.resolve("src/app/(coach)/coachees/page.tsx"), "utf8");
const broken = /<button\\s+onClick\\s*=\\s*{\\s*router\\.push\\s*\(\\/messages\\?clientId=\\\\)\\s*className\\s*=\\s*"flex-1 py-2\\.5 bg-green-50"[^>]*>\\s*<MessageSquare className="w-3 h-3" \\/>\\s*Chat\\s*<\/button>/g;
if (broken.test(list)) {
  list = list.replace(broken, "");
  console.log("  Removed broken button from coachees list");
}
fs.writeFileSync(path.resolve("src/app/(coach)/coachees/page.tsx"), list, "utf8");

// 2. Fix coachees/[id]/page.tsx
let detail = fs.readFileSync(path.resolve("src/app/(coach)/coachees/[id]/page.tsx"), "utf8");
detail = detail.replace(/<button\\s+onClick\\s*=\\s*{[^}]*'p-2 hover:bg-blue-50'[^>]*>\\s*<MessageSquare[^>]*><\/button>/g, "");
detail = detail.replace(/t\\('coachees\\.profile'\\)/g, "{t('coachees.profile')}");
fs.writeFileSync(path.resolve("src/app/(coach)/coachees/[id]/page.tsx"), detail, "utf8");

// 3. Fix promo/page.tsx
let promo = fs.readFileSync(path.resolve("src/app/promo/page.tsx"), "utf8");
promo = promo.replace(/^\(\\s*"use client";/, '"use client";');
promo = promo.replace(/\\)\\s*}\\s*$/, "});");
fs.writeFileSync(path.resolve("src/app/promo/page.tsx"), promo, "utf8");

// 4. Fix faq/page.tsx
let faq = fs.readFileSync(path.resolve("src/app/faq/page.tsx"), "utf8");
faq = faq.replace(/export const metadata = \\{ title: ['"][^"]+['"][^}]*}\\s*;\\s*export const metadata: Metadata = {/, 'export const metadata: Metadata = {');
faq = faq.replace(/from "lucide-react";export/, 'from "lucide-react"; export');
fs.writeFileSync(path.resolve("src/app/faq/page.tsx"), faq, "utf8");

console.log("=== All fixes completed successfully! ===");
