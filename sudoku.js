export const LEVELS = { easy: 43, medium: 35, hard: 28 };
const shuffled = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
export function candidates(board, index) {
  const row = Math.floor(index / 9), col = index % 9;
  const used = new Set();
  for (let n = 0; n < 9; n++) {
    used.add(board[row * 9 + n]);
    used.add(board[n * 9 + col]);
    used.add(board[(Math.floor(row / 3) * 3 + Math.floor(n / 3)) * 9 + Math.floor(col / 3) * 3 + n % 3]);
  }
  return [1,2,3,4,5,6,7,8,9].filter(n => !used.has(n));
}
export function countSolutions(input, limit = 2) {
  const board = [...input];
  let count = 0;
  function search() {
    if (count >= limit) return;
    let best = -1, options = [];
    for (let i = 0; i < 81; i++) {
      if (board[i]) continue;
      const possible = candidates(board, i);
      if (!possible.length) return;
      if (best === -1 || possible.length < options.length) { best = i; options = possible; }
      if (options.length === 1) break;
    }
    if (best === -1) { count++; return; }
    for (const n of options) { board[best] = n; search(); if (count >= limit) break; }
    board[best] = 0;
  }
  search();
  return count;
}
export function createPuzzle(difficulty = 'easy') {
  if (!(difficulty in LEVELS)) throw new Error('Unknown difficulty');
  const groups = () => shuffled([0,1,2]).flatMap(g => shuffled([0,1,2]).map(n => g * 3 + n));
  const rows = groups(), cols = groups(), numbers = shuffled([1,2,3,4,5,6,7,8,9]);
  const solution = rows.flatMap(r => cols.map(c => numbers[(r * 3 + Math.floor(r / 3) + c) % 9]));
  const givens = [...solution];
  let clues = 81;
  for (const index of shuffled(Array.from({length:81}, (_, i) => i))) {
    const value = givens[index];
    givens[index] = 0;
    if (countSolutions(givens) !== 1) givens[index] = value;
    else clues--;
    if (clues <= LEVELS[difficulty]) break;
  }
  return { difficulty, solution, givens, values: [...givens], history: [] };
}
export function place(game, index, value) {
  if (!Number.isInteger(index) || index < 0 || index > 80 || !Number.isInteger(value) || value < 0 || value > 9) return 'invalid';
  if (game.givens[index]) return 'fixed';
  if (value && value !== game.solution[index]) return 'wrong';
  if (game.values[index] === value) return 'unchanged';
  game.history.push({ index, previous: game.values[index] });
  game.values[index] = value;
  return 'changed';
}
export function undo(game) {
  const move = game.history.pop();
  if (!move) return false;
  game.values[move.index] = move.previous;
  return true;
}
export function validSavedGame(game) {
  const grid = a => Array.isArray(a) && a.length === 81 && a.every(n => Number.isInteger(n) && n >= 0 && n <= 9);
  if (!game || !(game.difficulty in LEVELS) || !grid(game.solution) || game.solution.includes(0) || !grid(game.givens) || !grid(game.values) || !Array.isArray(game.history)) return false;
  for (let i = 0; i < 81; i++) {
    const copy = [...game.solution]; copy[i] = 0;
    if (!candidates(copy, i).includes(game.solution[i])) return false;
    if (game.givens[i] && game.givens[i] !== game.solution[i]) return false;
    if (game.values[i] && game.values[i] !== game.solution[i]) return false;
    if (game.givens[i] && game.values[i] !== game.givens[i]) return false;
  }
  return game.history.every(move => move && Number.isInteger(move.index) && move.index >= 0 && move.index < 81 && !game.givens[move.index] && (move.previous === 0 || move.previous === game.solution[move.index]));
}
