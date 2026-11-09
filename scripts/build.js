import { mkdir, copyFile, cp, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const file of ['index.html', 'styles.css', 'app.js', 'sudoku.js', 'cat.js', 'sw.js', 'manifest.webmanifest']) {
  await copyFile(file, `dist/${file}`);
}
await cp('icons', 'dist/icons', { recursive: true });
await copyFile('.nojekyll', 'dist/.nojekyll');
