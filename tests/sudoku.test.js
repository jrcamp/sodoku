import test from 'node:test';
import assert from 'node:assert/strict';
import { createPuzzle, countSolutions, place, undo, validSavedGame, LEVELS } from '../sudoku.js';
for (const level of Object.keys(LEVELS)) {
  test(`${level}: valid, unique puzzles`, () => {
    for (let sample = 0; sample < 8; sample++) {
      const game = createPuzzle(level);
      assert.ok(validSavedGame(game));
      assert.equal(countSolutions(game.givens), 1);
      assert.ok(game.givens.filter(Boolean).length >= LEVELS[level]);
      assert.ok(game.givens.filter(Boolean).length < LEVELS[level] + 8);
    }
  });
}
test('wrong entries and clues are protected; erase and undo restore entries', () => {
  const game = createPuzzle();
  const blank = game.givens.indexOf(0), clue = game.givens.findIndex(Boolean);
  assert.equal(place(game, clue, 0), 'fixed');
  assert.equal(place(game, blank, game.solution[blank] % 9 + 1), 'wrong');
  assert.equal(game.values[blank], 0);
  assert.equal(game.history.length, 0);
  assert.equal(place(game, blank, game.solution[blank]), 'changed');
  assert.equal(place(game, blank, 0), 'changed');
  assert.ok(undo(game));
  assert.equal(game.values[blank], game.solution[blank]);
  assert.ok(undo(game));
  assert.equal(game.values[blank], 0);
  assert.equal(undo(game), false);
});
test('save validation rejects corrupt data and accepts a played game', () => {
  assert.equal(validSavedGame(null), false);
  assert.equal(validSavedGame({}), false);
  const game = createPuzzle();
  place(game, game.givens.indexOf(0), game.solution[game.givens.indexOf(0)]);
  assert.ok(validSavedGame(JSON.parse(JSON.stringify(game))));
  game.values[0] = 42;
  assert.equal(validSavedGame(game), false);
});
test('puzzle can be completed and undone', () => {
  const game = createPuzzle('hard');
  for (let i = 0; i < 81; i++) if (!game.givens[i]) place(game, i, game.solution[i]);
  assert.deepEqual(game.values, game.solution);
  undo(game);
  assert.equal(game.values.filter(n => !n).length, 1);
});
