# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Browser Sudoku game in plain JavaScript (ES modules) + jQuery 3.7.1 (loaded from the Google CDN in `index.html`). A personal JavaScript learning project. No build step, no package.json, no linter, no test suite. [README.md](README.md) documents gameplay, keyboard shortcuts and the puzzle format in detail. Keep it in sync when behavior changes.

## Running

ES modules don't load from `file://`, so serve the folder over HTTP and open http://localhost:8000:

```sh
python -m http.server 8000
```

Verify changes by loading the page in a browser. `main.js` puts `sudokuController`, `sudokuBoard`, `sudokuButtons`, `mainMenu`, `displayGame`, `displayMenu` and the `SB` (SudokuBoard) / `SM` (SudokuMap) classes on `window` for console inspection. `#logParagraph` / `#logParagraph2` at the top of the page show the latest input events.

## Architecture

- **`main.js`** builds the components, appends their jQuery roots to `<body>`, wires the main-menu callback, and switches between the menu view and the game view by toggling `display` (`displayMenu` / `displayGame`). The board and buttons sit together in a `.game-area` wrapper that `styles.css` lays out side by side in landscape and stacked in portrait. `fitGameToWindow()` (on `displayGame` and window resize) picks the board size that fits the window and calls `SudokuBoard.resize(size)` then `updateBoard()`, since notes are drawn at the current cell size.
- **View components** (`SudokuBoard`, `SudokuButtons`, `MainMenu`) only render DOM and report input. The menu and buttons panel are styled by CSS classes in `styles.css` (`.panel`, `.btn`, `.btn.active` for switched-on toggles, `.field`), with colors matching the controller's cell highlight colors; the board still sets its geometry inline (in `resize()`), and cell font sizes scale with the `--cell-size` variable it sets. Each exposes its root as a jQuery object (`.board`, `.buttons`, `.menu`) and callback properties (`selectionFirstCell`, `selectionNextCell`, `buttonClickCallback`) that default to logging stubs.
- **`SudokuController`** owns the game state. It takes the board and buttons in its constructor, overwrites their callback properties with its own handlers, holds an array of 81 `Cell` objects, and calls `updateBoard()` to redraw after every change. Input modes, multi-select, highlighting and error marking live here. Undo/redo also lives here: any code path that changes cells on player input must run inside `recordChange(() => ...)`, which diffs cell states before/after and pushes one undo step (and drops the redo stack). It calls back to `main.js` through `menuCallback`.
- **`Cell`** (`modules/Cell.js`) is the cell model. `CellMode` (EMPTY, STARTING_CELL, SET, NOTES_1, NOTES_2) decides both how a cell renders and whether it can be edited. STARTING_CELL cells are never changed by input.
- **`SudokuMap`** holds static index helpers (cells numbered 0–80 row-major, converted to row/column/box) and the backtracking solver `solveSudoku()`. It solves the array in place and returns `-1` on success or `-2` if unsolvable. `loadGame()` runs the solver so wrong entries can be shown in red.
- **`SudokuStore`** (`modules/sudoku_store.js`) keeps the saved-puzzle list in `localStorage` under `sudoku.savedGames` and falls back to built-in puzzles when that key is missing or corrupt. `MainMenu` uses it for the puzzle dropdown and the Save Sudoku form.
- Puzzles are 81-character digit strings, row by row, `0` = empty.

## Notes

- `modules/canvas.js` and `modules/square.js` are leftover module-learning examples, not used by the game. `trash.txt` (untracked) is scratch HTML.
- The X and Color buttons are placeholders with no behavior yet.
