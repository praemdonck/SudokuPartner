import { SudokuMap } from './sudoku_map.js';
import { Cell, CellMode } from './Cell.js';

class SudokuController {
    static SELECTED_CELL_COLOR = " #21bca7";
    static SELECTED_UNIT_COLOR = " #bae9e5";
    static SAME_VALUE_NOTE_COLOR = " #9cdfee";
    static SAME_VALUE_COLOR = " #84c0bb";
    static CELL_ERROR_COLOR = " #fd6e77";

    constructor(sudokuBoard, sudokuButtons) {
        this.sudokuBoard = sudokuBoard;
        this.sudokuButtons = sudokuButtons;
        this.selectedCellsSet = new Set();
        this.multiSelect = false;
        this.deSelect = false;
        this.solutionAvailable = false;
        this.sudokuSolution = undefined;
        this.sudokuBoard.selectionFirstCell = (cellId) => this.selectionFirstCellHander(cellId);
        this.sudokuBoard.selectionNextCell = (cellId) => this.selectionNextCellHander(cellId);
        this.sudokuButtons.buttonClickCallback = (buttonId) => this.buttonsCallback(buttonId);

        this.entryMode = "NORMAL"; // NORMAL, NOTES1, NOTES2 
        this.sudokuButtons.setButtonBackgroundColor("value", "#ccc");

        this.sudokuCells = Array.from({ length: 9 * 9 }, (v, i) => new Cell(
            Math.floor(i / 9),
            i % 9,
            0,
            CellMode.EMPTY)); 
    }

    // selectionFirstCellHander(cellId)
    // {
    //     if (this.selectedCellsSet.size === 1 && this.selectedCellsSet.has(cellId)) {
    //         this.selectedCellsSet.clear();
    //         this.selectedRow = undefined;
    //         this.selectedCol = undefined;
    //         this.selectedBox = undefined;
    //     }
    //     else
    //     {
    //         if (!this.multiSelect)
    //             this.selectedCellsSet.clear();
    //         this.selectedCellsSet.add(cellId);
    //         this.selectedRow = SudokuMap.cellRow(cellId);
    //         this.selectedCol = SudokuMap.cellCol(cellId);
    //         this.selectedBox = SudokuMap.cellBox(cellId);
    //     }

    //     this.updateBoard();
    // };

    // selectionNextCellHander(cellId)
    // {
    //     this.selectedCellsSet.add(cellId);

    //     if (SudokuMap.cellRow(cellId) !== this.selectedRow) this.selectedRow = undefined;
    //     if (SudokuMap.cellCol(cellId) !== this.selectedCol) this.selectedCol = undefined;
    //     if (SudokuMap.cellBox(cellId) !== this.selectedBox) this.selectedBox = undefined;

    //     this.updateBoard();
    // }


    selectionFirstCellHander(cellId)
    {
        console.log("selectionFirstCellHander " + cellId);
        this.deSelect = false;
        if (this.selectedCellsSet.size === 1 && this.selectedCellsSet.has(cellId)) {
            this.selectedCellsSet.clear();
        }
        else
        {
            if (!this.multiSelect) {
                this.selectedCellsSet.clear();
                this.selectedCellsSet.add(cellId);
            } 
            else {
                if (this.selectedCellsSet.has(cellId)) {
                    this.selectedCellsSet.delete(cellId);
                    this.deSelect = true;
                }
                else {
                    this.selectedCellsSet.add(cellId);
                }
            }   

        }

        this.updateBoard();
    };

    selectionNextCellHander(cellId)
    {
        if (this.deSelect) {
            this.selectedCellsSet.delete(cellId);
        }
        else {
            this.selectedCellsSet.add(cellId);
        }

        this.updateBoard();
    }



    buttonsCallback(buttonId) {
        switch (buttonId) {
            case "ArrowLeft":
            case "ArrowRight":
            case "ArrowUp":
            case "ArrowDown":
                // let currentCell = Array.from(this.selectedCellsSet)[0];
                let currentCell = Array.from(this.selectedCellsSet).pop();
                currentCell = currentCell === undefined ? 0 : currentCell;
                let nextCell = 0;
                
                if (buttonId === "ArrowRight")
                    nextCell = currentCell < 80 ? currentCell + 1 : 0;
                if (buttonId === "ArrowLeft")
                    nextCell = currentCell > 0 ? currentCell - 1 : 80;
                if (buttonId === "ArrowUp")
                    nextCell = currentCell > 8 ? currentCell - 9 : currentCell;
                if (buttonId === "ArrowDown")
                    nextCell = currentCell < 72 ? currentCell + 9 : currentCell;
                
                this.selectionFirstCellHander(nextCell);
                break;
                break;
            case "clear":
                break;
            case "select":
                this.multiSelect = !this.multiSelect;
                this.sudokuButtons.setButtonBackgroundColor("select", this.multiSelect ? "#ccc" : "");
                break;
            case "erase":
                this.deleteCells(this.selectedCellsSet);
                this.updateBoard();
                break;
            case "x":
                break;
            case "value":
                this.entryMode = "NORMAL";
                this.sudokuButtons.setButtonBackgroundColor("value", "#ccc");
                this.sudokuButtons.setButtonBackgroundColor("notes1", "");
                this.sudokuButtons.setButtonBackgroundColor("notes2", "");
                break;
            case "notes1":
                this.entryMode = "NOTES1";
                this.sudokuButtons.setButtonBackgroundColor("value", "");
                this.sudokuButtons.setButtonBackgroundColor("notes1", "#ccc");
                this.sudokuButtons.setButtonBackgroundColor("notes2", "");
                for (const cell of this.selectedCellsSet) {
                    if (this.sudokuCells[cell].cellMode === CellMode.NOTES_2) {
                        this.sudokuCells[cell].cellMode = CellMode.NOTES_1;
                    }
                }
                this.updateBoard();
                break;
            case "notes2":
                this.entryMode = "NOTES2";
                this.sudokuButtons.setButtonBackgroundColor("value", "");
                this.sudokuButtons.setButtonBackgroundColor("notes1", "");
                this.sudokuButtons.setButtonBackgroundColor("notes2", "#ccc");
                for (const cell of this.selectedCellsSet) {
                    if (this.sudokuCells[cell].cellMode === CellMode.NOTES_1) {
                        this.sudokuCells[cell].cellMode = CellMode.NOTES_2;
                    }
                }
                this.updateBoard();
                break;
            case "undo":
                break;
            case "redo":
                break;
            default:
                break;
        }
        if (buttonId >= 1 && buttonId <= 9) {
            this.handleNumberInput(buttonId);
        }
        else {
            console.log("sudoku Controller Button clicked " + buttonId);
            $("#logParagraph2").text("sudoku Controller Button clicked " + buttonId);
        }
    }

    handleNumberInput(number) {
        number = parseInt(number);
        console.log("handleInput number " + number);
        const clearNote = this.isNoteInAllSelectedCells(number);

        const emptySelectedCells = new Set();
        
        this.selectedCellsSet.forEach(cell => {if (this.sudokuCells[cell].value === 0) emptySelectedCells.add(cell)});

        switch (this.entryMode) {
            case "NORMAL":
                if (this.selectedCellsSet.size === 1) {
                    const cellIndex = Array.from(this.selectedCellsSet)[0];

                    if (this.sudokuCells[cellIndex].cellMode !== CellMode.STARTING_CELL) {
                        const cells = [cellIndex];
                        this.setValue(cells, number);
                    }
                } else {
                    if (clearNote) {
                        this.removeNote(emptySelectedCells, number);
                    } else {
                        this.addNoteKeepMode(emptySelectedCells, number);
                    }
                }
                break;
            case "NOTES1":
                if (clearNote) {
                    this.removeNote(emptySelectedCells, number);
                } else {
                    this.addNote_1(emptySelectedCells, number);
                }
                break;
            case "NOTES2":
                if (clearNote) {
                    this.removeNote(emptySelectedCells, number);
                } else {
                    this.addNote_2(emptySelectedCells, number);
                }
                break;
        }
        this.updateBoard();
    }


    setValue(cells, value) {
        cells.forEach(cellIndex => {
            this.sudokuCells[cellIndex].value = value;
            this.sudokuCells[cellIndex].notes.clear();
            this.sudokuCells[cellIndex].cellMode = CellMode.SET;
        });
    }

    removeNote(cells, number) {
        cells.forEach(cellIndex => {
            this.sudokuCells[cellIndex].notes.delete(number);
        });
    }

    addNoteKeepMode(cells, number) {
        cells.forEach(cellIndex => {
            this.sudokuCells[cellIndex].notes.add(number);
            if (this.sudokuCells[cellIndex].cellMode !== CellMode.NOTES_2)
                this.sudokuCells[cellIndex].cellMode = CellMode.NOTES_1;
        });
    }

    addNote_1(cells, number) {
        cells.forEach(cellIndex => {
            this.sudokuCells[cellIndex].notes.add(number);
            this.sudokuCells[cellIndex].cellMode = CellMode.NOTES_1;
        });
    }

    addNote_2(cells, number) {
        cells.forEach(cellIndex => {
            this.sudokuCells[cellIndex].notes.add(number);
            this.sudokuCells[cellIndex].cellMode = CellMode.NOTES_2;
        });
    }

    deleteCells(cells) {
        cells.forEach(cellIndex => {
            if (this.sudokuCells[cellIndex].cellMode != CellMode.STARTING_CELL) {
                this.sudokuCells[cellIndex].value = 0;
                this.sudokuCells[cellIndex].notes.clear();
                this.sudokuCells[cellIndex].cellMode = CellMode.EMPTY;
            }
        });
    }

    setNotesMode(cells, notesMode) {
        cells.forEach(cellIndex => {
            this.sudokuCells[cellIndex].cellMode = notesMode;
        });
    }

    isNoteInAllSelectedCells(number)
    {
        for (const cell of this.selectedCellsSet) {
            if (this.sudokuCells[cell].value === 0 &&
                !this.sudokuCells[cell].notes.has(number))
                return false;
        }
        return true;
    }

    updateBoard()
    {
        const selectedCellsArray = Array.from(this.selectedCellsSet);
        let selectedCellValue = -1;

        // Get the value of the selected cell if only one cell is selected
        if (selectedCellsArray.length === 1 && this.sudokuCells[selectedCellsArray[0]].value != 0)
            selectedCellValue = this.sudokuCells[selectedCellsArray[0]].value;

        console.log("selected Cells " + selectedCellsArray.toString() + " selectedCellValue " + selectedCellValue);
        // console.log("selectedCellsArray size " + selectedCellsArray.length);
        // console.log("selected Row " +    this.selectedRow);
        // console.log("selected Column " + this.selectedCol);
        // console.log("selected Box " +    this.selectedBox);


        let selectedRow = undefined;
        let selectedCol = undefined;
        let selectedBox = undefined;

        if (this.selectedCellsSet.size === 0) {
            selectedRow = undefined;
            selectedCol = undefined;
            selectedBox = undefined;
        } else {
            const firstSelectedCell = selectedCellsArray[0];
            selectedRow = SudokuMap.cellRow(firstSelectedCell);
            selectedCol = SudokuMap.cellCol(firstSelectedCell);
            selectedBox = SudokuMap.cellBox(firstSelectedCell);
        }

        // Check if selected cells are in the same row, column or box
        this.selectedCellsSet.forEach (cell => {
            if (selectedRow != SudokuMap.cellRow(cell)) selectedRow = -1
            if (selectedCol != SudokuMap.cellCol(cell)) selectedCol = -1
            if (selectedBox != SudokuMap.cellBox(cell)) selectedBox = -1
        });

        for (let cell = 0; cell <=80; cell++)
        {
            // Set Cell highlight color
            if (this.solutionAvailable && 
                this.sudokuCells[cell].value !=0 && 
                this.sudokuCells[cell].value != this.sudokuSolution[cell]) {
                this.sudokuBoard.setCellBackgroundColor(cell, this.constructor.CELL_ERROR_COLOR)
            }
            else if (this.selectedCellsSet.has(cell)) {
                this.sudokuBoard.setCellBackgroundColor(cell, this.constructor.SELECTED_CELL_COLOR);
            }
            else if (this.sudokuCells[cell].value === selectedCellValue) {
                this.sudokuBoard.setCellBackgroundColor(cell, this.constructor.SAME_VALUE_COLOR);
            }
            else if ((this.sudokuCells[cell].cellMode === CellMode.NOTES_1 ||
                      this.sudokuCells[cell].cellMode === CellMode.NOTES_2) && 
                      this.sudokuCells[cell].notes.has(selectedCellValue)) {
                this.sudokuBoard.setCellBackgroundColor(cell, this.constructor.SAME_VALUE_NOTE_COLOR);
            }
            else if (SudokuMap.cellRow(cell) === selectedRow ||
                     SudokuMap.cellCol(cell) === selectedCol ||
                     SudokuMap.cellBox(cell) === selectedBox) {
                this.sudokuBoard.setCellBackgroundColor(cell, this.constructor.SELECTED_UNIT_COLOR);
            }
            else {
                this.sudokuBoard.setCellBackgroundColor(cell, "");
            }

            // Set Cell Value
            if (this.sudokuCells[cell].cellMode === CellMode.EMPTY ||
                this.sudokuCells[cell].cellMode === CellMode.STARTING_CELL ||
                this.sudokuCells[cell].cellMode === CellMode.SET) {
                const value = this.sudokuCells[cell].value === 0 ? "" : this.sudokuCells[cell].value;
                this.sudokuBoard.setCellValue(cell, value);  
            }
            else if (this.sudokuCells[cell].cellMode === CellMode.NOTES_1) {
                this.sudokuBoard.setCellNotesType1(cell, this.sudokuCells[cell].notes);
            }   
            else if (this.sudokuCells[cell].cellMode === CellMode.NOTES_2) {
                this.sudokuBoard.setCellNotesType2(cell, this.sudokuCells[cell].notes);
            }   
        }
    }
    loadGame(sudokuString)
    {
        this.sudokuSolution = SudokuMap.sudokuStringToArray(sudokuString);
        if (SudokuMap.solveSudoku(this.sudokuSolution) === -1) {
            this.solutionAvailable = true;
        }

        for (let i=0; i<81; i++)
        {
            let cellValue = sudokuString[i];
            cellValue = parseInt(cellValue);
            // let cellValue = this.sudokuSolution[i];

            this.sudokuCells[i].value = cellValue;
            this.sudokuCells[i].cellMode = cellValue === 0 ? CellMode.EMPTY : CellMode.STARTING_CELL;
            // this.sudokuBoard.setCellValue(i, cellValue);
        } 

        this.updateBoard();
    }
}

export { SudokuController };



