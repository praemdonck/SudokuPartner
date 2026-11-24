# Sudoku

A browser-based Sudoku game written in plain JavaScript (ES modules) and jQuery, built as a JavaScript learning project. There is no build step and no dependencies to install.

## Running it

The app uses ES modules (`<script type="module">`), so browsers won't load it from a `file://` URL. Serve the folder over HTTP instead, for example:

```sh
# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then open <http://localhost:8000>. The VS Code **Live Server** extension works too.

jQuery 3.7.1 is loaded from the Google CDN, so you need an internet connection.

## How to play

1. The app opens on the **main menu**.
2. Pick a puzzle from the dropdown and click **Load Game**. (Sudoku 12 is loaded by default.)
3. Click **Start Game** to switch to the board.
4. Select cells and enter numbers with the on-screen buttons or the keyboard.
5. Click **Main Menu** to go back.

When a puzzle loads, the built-in solver works out the solution. Any value you enter that doesn't match it is highlighted in red.

### Selecting cells

- **Click or tap** a cell to select it. Click it again to deselect it.
- **Drag** across cells to select several at once.
- Turn on **Select** (multi-select) to add cells to the selection one click at a time. In this mode, clicking a selected cell (or dragging from one) deselects cells.
- **Arrow keys** move the selection around the grid.
- **Clear** deselects all cells. It doesn't change any values or notes.

The board highlights the selected cells, their row, column and box, and any other cells (or notes) with the same value as the selected cell.

### Entering numbers

| Mode | What a number does |
|------|--------------------|
| **Value** (default) | With one cell selected, sets its value. With several selected, toggles that number as a note in the empty ones. |
| **Notes Type 1** | Toggles a note, shown as a 3×3 grid of small digits inside the cell. |
| **Notes Type 2** | Toggles a note, shown as a single line of digits (e.g. `1479`). |

If every selected empty cell already has the note, pressing the number removes it from all of them. Otherwise it adds it to all of them. Starting (given) cells can't be changed.

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `1`–`9` (top row or numpad) | Enter number |
| Arrow keys | Move selection |
| `E` | Erase selected cells |
| `S` | Toggle multi-select |
| `V` | Value mode |
| `N` | Notes Type 1 mode |
| `M` | Notes Type 2 mode |

### Not implemented yet

The **X**, **Color**, **Undo** and **Redo** buttons are placeholders and don't do anything yet.

## Project structure

```
index.html                 Page shell; loads jQuery and main.js
styles.css                 Cell and note styling
main.js                    Entry point: creates the components, wires callbacks, switches views
modules/
  main_menu.js             MainMenu: Start/Load buttons, puzzle dropdown, Save Sudoku form
  sudoku_store.js          SudokuStore: saved puzzle list in localStorage, plus the built-in puzzles
  sudoku_board.js          SudokuBoard: draws the 9×9 grid, handles mouse/touch selection
  sudoku_buttons.js        SudokuButtons: control and number buttons, keyboard input
  sudoku_controller.js     SudokuController: game state, input modes, highlighting
  sudoku_map.js            SudokuMap: grid index helpers and a backtracking solver
  Cell.js                  Cell model and the CellMode enum
  canvas.js, square.js     Leftover module-learning examples, not used by the game
```

### How the pieces fit together

The view components (`SudokuBoard`, `SudokuButtons`, `MainMenu`) only render and report input. They expose callback properties (`selectionFirstCell`, `selectionNextCell`, `buttonClickCallback`) that default to logging stubs. `SudokuController` replaces those stubs with its own handlers, keeps an array of 81 `Cell` objects as the game state, and calls `updateBoard()` to redraw the board after every change.

Cells are numbered `0`–`80`, row by row. `SudokuMap` converts between cell numbers and row/column/box indexes.

### Puzzle format

A puzzle is an 81-character string read row by row, with `0` for an empty cell:

```
863100207020070800507802090008200079706000528290780300080627401672010980000008762
```

To add a puzzle, type a name and its 81-digit string into the main menu and click **Save Sudoku**. Saved puzzles are kept in the browser's `localStorage` under the key `sudoku.savedGames`, so they last across reloads but stay in that one browser and are lost if you clear its site data. The built-in puzzles in [modules/sudoku_store.js](modules/sudoku_store.js) are used the first time the app runs, or if the stored list is missing or corrupted.

### Solver

`SudokuMap.solveSudoku()` is a backtracking search. At each step it guesses on the empty cell with the fewest candidates. It solves the array in place and returns `-1` when it finds a solution, or `-2` if the puzzle can't be solved.

## Debugging

- The two paragraphs at the top of the page (`#logParagraph`, `#logParagraph2`) show the latest mouse/touch and button events.
- `main.js` puts the main objects on `window` (`sudokuController`, `sudokuBoard`, `sudokuButtons`, `mainMenu`, plus the `SB`/`SM` classes) so you can inspect them from the browser console.
