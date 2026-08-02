const fs = require('fs');
const files = [
  { path: 'src/app/(coach)/coachees/page.tsx', fix: (c) => c.replace(/bg-green-50[\s\S]*?<\/button>/g, '') },
  { path: 'src/app/(coach)/coachees/[id]/page.tsx', fix: (c) => c.replace(/<\/button>\s*<\/button>/g, '</button>') }
];
for (const f of files) {
  let c = fs.readFileSync(f.path, 'utf8');
  let fixed = f.fix(c);
  if (fixed !== c) {
    fs.writeFileSync(f.path, fixed, 'utf8');
    console.log('Fixed:', f.path);
  }
}
console.log('Done');
