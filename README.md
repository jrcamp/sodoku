# Sudoku

A dependency-free, installable Sudoku PWA designed for iPad. Large numbers, calm green highlights, and touch-first controls. All fonts, icons, and code are local; no accounts or external services are required.

## Play

Use the header’s **Theme** picker for Forest, Bright blue, or Lavender, plus higher-contrast Bold cobalt, Amber ink, and Deep plum. The higher-contrast options use darker numbers, stronger grid lines, and more saturated highlights. The choice is saved on this device and works offline.

**Settings** (next to Theme) adjusts number size (70–140%), cell line thickness, and 3×3 box line thickness. Changes preview live on the board and are saved on this device.

**Pip the cat** lives on top of the board: it wanders, grooms, naps (more when you're idle), bats a ball of yarn, and stalks butterflies. It reacts to wrong moves, sometimes comes to look at the square you just filled, and celebrates when you finish. Tap it to purr or wake it. Turn it off with **Cat companion** in Settings.

- Choose a number, then tap a square to place it. **Every instance of the selected number lights up**, including starting clues and your entries.
- An incorrect number flashes the square and board border red and announces an error. The incorrect entry is not kept.
- Choose **Erase**, then tap one of your entries. **Undo** restores the previous change, including an erase.
- Easy, Medium, and Hard generate unique-solution puzzles with progressively fewer clues (target: 43, 35, and 28). Difficulty is based on clue density, not a human-solving technique rating; uniqueness can require a few extra clues.
- Progress and undo history save automatically on this browser/device. Clearing site data removes the save. Safari and the installed app may have separate storage.
- Keyboard: 1–9 selects a number; E, Delete, or Backspace selects erase; Ctrl/Command+Z undoes; Tab and Enter/Space activate squares.

## Run locally

Requires Node.js 22+ for tests/build and Python 3 for the preview. There are no npm packages to install.

```sh
npm test
npm run build
npm start
```

Open http://localhost:5173. The source is directly runnable; `npm run build` copies only deployable files into `dist/`. Do not open `index.html` via `file://`: modules and service workers require a server.

## Deploy to GitHub Pages

1. Create an empty GitHub repository (for example, `sodoku`). For a public repository, GitHub Pages is available on GitHub Free. Other repository visibility/plan combinations depend on your GitHub plan.
2. From this directory, initialize and push the project, replacing `YOUR-USERNAME` and the repository name:

   ```sh
   git init -b main
   git add .
   git commit -m "Build iPad Sudoku PWA"
   git remote add origin https://github.com/YOUR-USERNAME/sodoku.git
   git push -u origin main
   ```

   If using an existing repository, use its existing remote and branch instead of initializing again. The workflow currently watches `main`; change it if needed.
3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Open **Actions → Deploy Sudoku to GitHub Pages → Run workflow**, or push a commit to `main`. The included workflow runs tests, builds `dist/`, uploads it, and deploys it to Pages.
5. Open the URL from the deployment, usually `https://YOUR-USERNAME.github.io/sodoku/`. Keep HTTPS enabled. All manifest, asset, and service worker URLs are relative, so a repository subpath and a root/custom-domain deployment both work.

No secrets, API keys, backend, or environment variables are required. This checkout is prepared for deployment; no GitHub repository has been created or published automatically.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Install on iPad

1. Visit the deployed **HTTPS** URL in Safari while online and allow the first load to finish.
2. Tap **Share → Add to Home Screen**. If shown, enable **Open as Web App**, then tap **Add**.
3. Open the Sudoku icon from the Home Screen. The standalone manifest and Apple web-app metadata request an app window without Safari's address bar/tab UI. The system status bar may remain.
4. The game uses a large board with controls below it in portrait and alongside it in landscape. Safe-area insets keep content clear of screen edges. Smaller split-view and phone windows can scroll.

Official iPad guide: https://support.apple.com/en-gb/guide/ipad/ipad8f1f7a29/ipados

## Offline behavior and updates

The service worker precaches the app shell, game code, manifest, and PNG icons. After the initial successful online installation, the game and newly generated puzzles work offline. Local progress survives reloads and app restarts when browser storage is available. Private browsing, storage eviction, or cleared site data can remove offline files and saves.

When changing shipped assets, **increment `CACHE` in `sw.js`** (for example, `sudoku-static-v2`) before deploying. Assets are cache-first to keep each installed version consistent. New workers wait until all old app windows/tabs close, then activate the new cache and delete old Sudoku caches. Reopen the app after closing its windows to receive the update. A failed precache leaves the existing installed version intact.

Use HTTPS in production. `localhost` is allowed for local testing, but an iPad visiting a computer's plain HTTP LAN address cannot install the service worker reliably; test the deployed HTTPS URL instead.

## Verification

`npm test` checks unique solutions across all difficulties, valid completed grids, protected clues, rejection of incorrect entries, erase/undo, save validation, and completion. `npm run build` prepares the deployment artifact.

Before release on a physical iPad:

- Open the deployed site in portrait and landscape, including Split View; verify large controls, visible board, and safe-area spacing.
- Select a number and confirm all matches highlight. Add a correct entry, try an incorrect one, erase, and undo.
- Reload and verify the puzzle and history persist.
- Install via Safari and launch from the Home Screen; verify Safari chrome is absent.
- After one online load, close the app, enable Airplane Mode, and reopen it. Verify existing and new puzzles work.
- Reconnect, deploy an incremented cache version, close all app windows, and reopen to verify the update.

Browser viewport checks do not replace an actual iPadOS installation/offline test.
