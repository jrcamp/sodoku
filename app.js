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
function render() {
  cells.forEach((cell, i) => {
    const value = game.values[i];
    cell.textContent = value || '';
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
    save(); render();
  }
}
$('erase').addEventListener('click', () => select(selected === 0 ? 1 : 0));
$('undo').addEventListener('click', () => { if (undo(game)) { save(); say(''); render(); } });
function showNew(level = game.difficulty) { $('new-difficulty').value = level; $('new-dialog').showModal(); }
$('new-game').addEventListener('click', () => showNew());
$('difficulty').addEventListener('change', event => { const level = event.target.value; event.target.value = game.difficulty; showNew(level); });
$('cancel-new').addEventListener('click', () => $('new-dialog').close());
$('confirm-new').addEventListener('click', async () => {
  const button = $('confirm-new');
  button.disabled = true; button.textContent = 'Creating…';
  await new Promise(resolve => setTimeout(resolve, 30));
  game = createPuzzle($('new-difficulty').value); selected = 1;
  save(); say(''); render();
  button.disabled = false; button.textContent = 'New puzzle'; $('new-dialog').close();
});
document.addEventListener('keydown', event => {
  if (document.querySelector('dialog[open]') || ['SELECT', 'INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;
  if (/^[1-9]$/.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) select(Number(event.key));
  if (event.key.toLowerCase() === 'e' || event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); select(0); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); $('undo').click(); }
});
save(); render();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => { $('save-state').textContent = 'Offline setup unavailable'; });
}
