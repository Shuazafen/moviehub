import fs from 'fs';
const path = './server/routes/watchlist.js';
const content = fs.readFileSync(path, 'utf8');
const fixed = content.replace('  }");\n});\n', '  }\n});\n');
if (fixed === content) {
  console.error('No patch applied');
  process.exit(1);
}
fs.writeFileSync(path, fixed, 'utf8');
console.log('Patched watchlist.js');
