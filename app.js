import { createPuzzle, place, undo, validSavedGame } from './sudoku.js';
const $ = id => document.getElementById(id);
const storageKey = 'sudoku-studio-v1';
const themeColors = { forest: '#f5f3ec', blue: '#edf6ff', lavender: '#f5f0fc', cobalt: '#e4edff', amber: '#fff3d4', plum: '#f4e5f3' };
function applyTheme(theme) {
  if (!Object.hasOwn(themeColors, theme)) theme = 'forest';
  document.documentElement.dataset.theme = theme;
  $('theme').value = theme;
  document.querySelector('meta[name="theme-color"]').content = themeColors[theme];
}
applyTheme(document.documentElement.dataset.theme);
$('theme').addEventListener('change', event => {
  applyTheme(event.target.value);
  try { localStorage.setItem('sudoku-theme', event.target.value); } catch { /* Theme still applies for this visit. */ }
});
const displayKey = 'sudoku-display';
const displaySettings = {
  numberSize: { min: 70, max: 140, default: 100, input: 'number-size', css: '--number-scale', css_value: v => v / 100, label: v => `${v}%` },
  cellLine: { min: 1, max: 4, default: 1, input: 'cell-line', css: '--cell-line-width', css_value: v => `${v}px`, label: v => `${v} px` },
  boxLine: { min: 2, max: 8, default: 3, input: 'box-line', css: '--box-line-width', css_value: v => `${v}px`, label: v => `${v} px` }
};
function cleanDisplay(saved) {
  const out = {};
  for (const [key, spec] of Object.entries(displaySettings)) {
    const value = Number(saved?.[key]);
    out[key] = saved?.[key] != null && Number.isFinite(value) ? Math.min(spec.max, Math.max(spec.min, value)) : spec.default;
  }
  return out;
}
let display;
try { display = cleanDisplay(JSON.parse(localStorage.getItem(displayKey))); } catch { display = cleanDisplay(); }
function applyDisplay() {
  for (const [key, spec] of Object.entries(displaySettings)) {
    document.documentElement.style.setProperty(spec.css, spec.css_value(display[key]));
    $(spec.input).value = display[key];
    $(`${spec.input}-value`).textContent = spec.label(display[key]);
  }
}
function saveDisplay() { try { localStorage.setItem(displayKey, JSON.stringify(display)); } catch { /* Settings still apply for this visit. */ } }
for (const [key, spec] of Object.entries(displaySettings)) {
  $(spec.input).addEventListener('input', event => { display[key] = Number(event.target.value); applyDisplay(); saveDisplay(); });
}
applyDisplay();
$('open-settings').addEventListener('click', () => $('settings-dialog').showModal());
$('close-settings').addEventListener('click', () => $('settings-dialog').close());
$('reset-settings').addEventListener('click', () => { display = cleanDisplay(); applyDisplay(); saveDisplay(); });
$('settings-dialog').addEventListener('click', event => { if (event.target === event.currentTarget) event.currentTarget.close(); });
let selected = 1, game;
try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (validSavedGame(saved)) game = saved; } catch { /* Storage may be unavailable or corrupt. */ }
game ||= createPuzzle('easy');
const cells = Array.from({length:81}, (_, i) => {
  const cell = document.createElement('button');
  cell.className = 'cell';
  cell.style.setProperty('--i', Math.floor(i / 9) + i % 9);
  cell.addEventListener('animationend', event => { if (event.animationName === 'digit-pop') cell.classList.remove('placed'); });
  cell.addEventListener('click', () => play(i));
  $('board').append(cell);
  return cell;
});
const keys = Array.from({length:9}, (_, i) => {
  const button = document.createElement('button');
  button.className = 'number-key';
  button.addEventListener('click', () => select(i + 1));
  $('number-pad').append(button);
  return button;
});
function say(message, style = '') { $('message').textContent = message; $('message').className = `message ${style}`; }
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(game)); $('save-state').textContent = ''; }
  catch { $('save-state').textContent = 'Saving unavailable in this browser'; }
}
function isComplete() { return game.values.every((n, i) => n === game.solution[i]); }
function replay(element, className, duration) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  if (duration) setTimeout(() => element.classList.remove(className), duration);
}
// pop: animate digits that appear because of a move (place or undo).
function render({ pop = false } = {}) {
  cells.forEach((cell, i) => {
    const value = game.values[i];
    if (cell.dataset.value !== String(value || '')) {
      cell.dataset.value = value || '';
      cell.innerHTML = value ? `<span class="digit">${value}</span>` : '';
      if (pop && value) replay(cell, 'placed');
    }
    cell.classList.toggle('entered', !!value && !game.givens[i]);
    cell.classList.toggle('match', selected !== 0 && value === selected);
    cell.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${i % 9 + 1}, ${value || 'empty'}${game.givens[i] ? ', starting clue' : ''}`);
    cell.setAttribute('aria-disabled', String(!!game.givens[i]));
  });
  keys.forEach((button, i) => {
    const remaining = 9 - game.values.filter(n => n === i + 1).length;
    button.innerHTML = `${i + 1}<small aria-hidden="true">${remaining || '✓'}</small>`;
    button.classList.toggle('done', remaining === 0);
    button.setAttribute('aria-pressed', String(selected === i + 1));
    button.setAttribute('aria-label', `${i + 1}, ${remaining} remaining`);
  });
  $('erase').setAttribute('aria-pressed', String(selected === 0));
  $('undo').disabled = !game.history.length;
  const total = game.givens.filter(n => !n).length;
  const filled = game.values.filter((n, i) => n && !game.givens[i]).length;
  $('difficulty').value = game.difficulty;
  if (filled === total) say('Puzzle complete!', 'success');
}
function select(value) {
  selected = value;
  say('');
  render();
}
let flashTimer;
function play(index) {
  const result = place(game, index, selected);
  if (result === 'wrong') {
    clearTimeout(flashTimer);
    cells.forEach(cell => cell.classList.remove('wrong'));
    $('board').classList.remove('mistake');
    void $('board').offsetWidth;
    cells[index].classList.add('wrong');
    $('board').classList.add('mistake');
    say(`${selected} is incorrect.`, 'error');
    flashTimer = setTimeout(() => { cells[index].classList.remove('wrong'); $('board').classList.remove('mistake'); }, 700);
  } else if (result === 'fixed') say('Starting clues cannot be changed.');
  else if (result === 'changed') {
    say('');
    save(); render({ pop: true });
    if (isComplete()) celebrate();
  }
}
$('erase').addEventListener('click', () => select(selected === 0 ? 1 : 0));
$('undo').addEventListener('click', () => { if (undo(game)) { hideCelebration(); save(); say(''); render({ pop: true }); } });
function showNew(level = game.difficulty) { $('new-difficulty').value = level; $('new-dialog').showModal(); }
$('new-game').addEventListener('click', () => showNew());
$('difficulty').addEventListener('change', event => { const level = event.target.value; event.target.value = game.difficulty; showNew(level); });
$('cancel-new').addEventListener('click', () => $('new-dialog').close());
$('confirm-new').addEventListener('click', async () => {
  const button = $('confirm-new');
  button.disabled = true; button.textContent = 'Creating…';
  await new Promise(resolve => setTimeout(resolve, 30));
  game = createPuzzle($('new-difficulty').value); selected = 1; hideCelebration();
  save(); say(''); render(); replay($('board'), 'fresh', 900);
  button.disabled = false; button.textContent = 'New puzzle'; $('new-dialog').close();
});
document.addEventListener('keydown', event => {
  if (document.querySelector('dialog[open]') || ['SELECT', 'INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;
  if (/^[1-9]$/.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) select(Number(event.key));
  if (event.key.toLowerCase() === 'e' || event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); select(0); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); $('undo').click(); }
});
// Celebration: a ripple across the board, theme-colored confetti, then a small card.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let celebrationTimers = [];
function hideCelebration() {
  celebrationTimers.forEach(clearTimeout); celebrationTimers = [];
  $('celebration').hidden = true;
}
function celebrate() {
  hideCelebration();
  const level = game.difficulty[0].toUpperCase() + game.difficulty.slice(1);
  $('celebration-detail').textContent = `${level} puzzle complete.`;
  if (!reduceMotion.matches) {
    celebrationTimers.push(setTimeout(() => replay($('board'), 'complete', 1600), 250));
    celebrationTimers.push(setTimeout(confetti, 350));
  }
  celebrationTimers.push(setTimeout(() => { $('celebration').hidden = false; $('celebration-new').focus({ preventScroll: true }); }, reduceMotion.matches ? 0 : 1100));
}
function confetti() {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const resize = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize(); addEventListener('resize', resize);
  const css = getComputedStyle(document.documentElement);
  const colors = ['--accent', '--entry', '--highlight', '--strong-line'].map(v => css.getPropertyValue(v).trim()).concat('#f2b33d', '#e8665a', '#ffffff');
  const pieces = [];
  for (const side of [0, 1]) for (let n = 0; n < 90; n++) {
    const angle = (side ? 180 + 50 : -50) * Math.PI / 180 + (Math.random() - .5) * .9;
    const speed = 9 + Math.random() * 11;
    pieces.push({
      x: side ? innerWidth + 10 : -10, y: innerHeight * (.55 + Math.random() * .25),
      vx: Math.cos(angle) * speed, vy: -Math.abs(Math.sin(angle) * speed) - 4,
      size: 6 + Math.random() * 7, color: colors[Math.floor(Math.random() * colors.length)],
      spin: Math.random() * Math.PI, spinSpeed: (Math.random() - .5) * .35, round: Math.random() < .3, wobble: Math.random() * 10
    });
  }
  const start = performance.now();
  (function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of pieces) {
      p.vx *= .985; p.vy = p.vy * .985 + .32; p.x += p.vx + Math.sin((t / 180) + p.wobble) * .6; p.y += p.vy; p.spin += p.spinSpeed;
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 2600) / 900);
      ctx.translate(p.x, p.y); ctx.rotate(p.spin); ctx.fillStyle = p.color;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2 * (0.4 + Math.abs(Math.cos(p.spin))));
      ctx.restore();
    }
    if (t < 3500) requestAnimationFrame(frame);
    else { removeEventListener('resize', resize); canvas.remove(); }
  })(start);
}
$('celebration-close').addEventListener('click', hideCelebration);
$('celebration-new').addEventListener('click', () => { hideCelebration(); showNew(); });

// Hidden debug panel: tap the ▦ logo five times quickly, or open the app with #debug.
let logoTaps = [];
document.querySelector('.brand-icon').addEventListener('click', event => {
  event.preventDefault();
  const now = Date.now();
  logoTaps = [...logoTaps.filter(t => now - t < 1500), now];
  if (logoTaps.length >= 5) { logoTaps = []; $('debug-dialog').showModal(); }
});
function debugFill(indices) {
  let changed = false;
  for (const i of indices) if (place(game, i, game.solution[i]) === 'changed') changed = true;
  if (!changed) return;
  save(); say(''); render({ pop: true });
  if (isComplete()) celebrate();
}
$('debug-dialog').addEventListener('click', event => {
  if (event.target === event.currentTarget) return event.currentTarget.close();
  const action = event.target.closest('[data-debug]')?.dataset.debug;
  if (!action) return;
  const empty = game.values.flatMap((n, i) => n ? [] : [i]);
  $('debug-dialog').close();
  if (action === 'all-but-one') debugFill(empty.slice(0, -1));
  if (action === 'solve') debugFill(empty);
  if (action === 'number') debugFill(empty.filter(i => game.solution[i] === (selected || 1)));
  if (action === 'some') debugFill(empty.sort(() => Math.random() - .5).slice(0, 10));
  if (action === 'reset') { hideCelebration(); game.values = [...game.givens]; game.history = []; save(); say(''); render(); replay($('board'), 'fresh', 900); }
});
$('close-debug').addEventListener('click', () => $('debug-dialog').close());
function debugFromHash() { if (location.hash === '#debug' && !$('debug-dialog').open) $('debug-dialog').showModal(); }
addEventListener('hashchange', debugFromHash);
debugFromHash();
save(); render();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => { $('save-state').textContent = 'Offline setup unavailable'; });
}
