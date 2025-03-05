const CellMode = {
    EMPTY: 'EMPTY',
    STARTING_CELL: 'STARTING_CELL',
    SET: 'SET',
    NOTES_1: 'NOTES_1',
    NOTES_2: 'NOTES_2'
};

class Cell {
    constructor(row, col, value, cellMode) {
        this.row = row;
        this.col = col;
        this.value = value;
        this.cellMode = cellMode;
        this.notes = new Set();
    }
}

export { Cell, CellMode };