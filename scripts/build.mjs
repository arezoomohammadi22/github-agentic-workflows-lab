import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
await mkdir('dist', { recursive: true });
for (const name of ['quote.js', 'server.js']) {
  await copyFile(join('src', name), join('dist', name));
}
await writeFile(join('dist', 'build-info.json'), JSON.stringify({
  name: 'agentic-pr-lab', version: '1.0.0'
}, null, 2) + '\n');
console.log('Build completed: dist/');
