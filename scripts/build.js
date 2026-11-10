import { mkdir, copyFile, cp, rm, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const files = ['index.html', 'styles.css', 'app.js', 'sudoku.js', 'cat.js', 'manifest.webmanifest'];
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
const hash = createHash('sha256');
for (const file of files) {
  await copyFile(file, `dist/${file}`);
  hash.update(await readFile(file));
}
// Stamp the service worker's cache name with a content hash so any change to
// the app files makes browsers install the new version.
const version = hash.digest('hex').slice(0, 10);
const sw = (await readFile('sw.js', 'utf8')).replace("'sudoku-static-dev'", `'sudoku-static-${version}'`);
await writeFile('dist/sw.js', sw);
await cp('icons', 'dist/icons', { recursive: true });
await copyFile('.nojekyll', 'dist/.nojekyll');
console.log(`Built dist/ (cache sudoku-static-${version})`);
