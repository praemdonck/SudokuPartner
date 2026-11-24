// Stores the list of sudoku puzzles in the browser's localStorage.
// Each entry is {text: "Name shown in the menu", value: "81 digits, 0 = empty"}.

const STORAGE_KEY = "sudoku.savedGames";

// Used the first time the app runs, or if the stored list is missing or corrupted
const DEFAULT_SUDOKUS = [
    {text: "Sudoku 1",  value: "002370000000000800390820070500000000000408000600203708800900020030000050007064309"},
    {text: "Sudoku 2",  value: "000080020005207180208040506060000010804000702050000630321754869009806200080020000"},
    {text: "Sudoku 3",  value: "870306490490002630006940008004500009659020080700009000568294173927135846143600925"},
    {text: "Sudoku 4",  value: "090480003000000090106002500010005004700060001400100060007500309050000000300097080"},
    {text: "Sudoku 5",  value: "507000124320104057041000060602345709004020500753891642038000476405008001070400005"},
    {text: "Sudoku 6",  value: "470020000050000000109057000005090043003105800980040100000980205000000090000070081"},
    {text: "Sudoku 7",  value: "900000000006080037058906000040703200000040000003809060000605170570090300000000005"},
    {text: "Sudoku 8",  value: "000004000500200079010057004002070956097560400065000807600730090950006702000800640"},
    {text: "Sudoku 9",  value: "853140006910000050027053080080400037000060040240030060060390508098000024500084600"},
    {text: "Sudoku 10", value: "395106000701008009802079050620000704003007200174002095236890000407260900000704062"},
    {text: "Sudoku 11", value: "600000100170050042402137000260704010001265400047300006724800503910070084006000701"},
    {text: "Sudoku 12", value: "863100207020070800507802090008200079706000528290780300080627401672010980000008762"},
    {text: "Sudoku 13", value: "000841067678000401100007000205000000016524308400000152000400009801000700360078000"}
];

class SudokuStore {
    // Returns the saved list, or a copy of the defaults if nothing valid is stored
    static load() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (Array.isArray(saved) && saved.length > 0)
                return saved;
        } catch (e) {
            console.log("Could not read saved sudokus: " + e);
        }
        return [...DEFAULT_SUDOKUS];
    }

    static save(sudokus) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sudokus));
        } catch (e) {
            // Storage can be full or blocked (e.g. some private browsing modes)
            throw new Error("Could not save the sudoku list: " + e.message);
        }
    }

    // Adds a puzzle, saves the list and returns it
    static add(name, puzzle) {
        if (!/^[0-9]{81}$/.test(puzzle))
            throw new Error("A sudoku must be exactly 81 digits, with 0 for empty cells");

        const sudokus = this.load();
        sudokus.push({text: name, value: puzzle});
        this.save(sudokus);
        return sudokus;
    }
}

export { SudokuStore };
