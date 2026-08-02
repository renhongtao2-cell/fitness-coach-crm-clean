const fs = require('fs');
const content = fs.readFileSync('src/app/blog/ai-workout-plan-guide/page.tsx', 'utf8');
const lines = content.split('\n');
for (let i = 5; i <= 12; i++) {
  console.log(i + ': ' + lines[i-1]);
}
