(async () => {
const fs = require("fs");
const path = require("path");

const files = [
  "src/app/(auth)/login/page.tsx",
  "src/app/(auth)/register/page.tsx",
  "src/app/(coach)/messages/page.tsx",
  "src/app/about/page.tsx",
  "src/app/blog/ai-workout-plan-guide/page.tsx"
];

for (const file of files) {
  const filePath = path.resolve(file);
  let content = fs.readFileSync(filePath, "utf8");
  
  // Fix: replace the U+FFFD replacement character (?) which indicates invalid UTF-8
  content = content.replace(/\uFFFD/g, "");
  
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Fixed:", file);
}
console.log("All files fixed");
})();
