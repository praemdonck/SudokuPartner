const SELECTED_CELL_COLOR = "#21bca7";
const SELECTED_UNIT_COLOR = "#bae9e5";

let selectedCellsSet = new Set();
let selectedRow = undefined;
let selectedCol = undefined;
let selectedBox = undefined;

selectionFirstCell = selectionFirstCellHander;
selectionNextCell = selectionNextCellHander;

// let selectionFirstCell = cellId =>
function selectionFirstCellHander(cellId)
{
    selectedCellsSet.clear();
    selectedCellsSet.add(cellId);
    selectedRow = SudokuMap.cellRow(cellId);
    selectedCol = SudokuMap.cellCol(cellId);
    selectedBox = SudokuMap.cellBox(cellId);

    updateBoard();

    // for (cell of cellsArray)
    //     cell.style.backgroundColor = "";

    // cellsArray[cellId].style.backgroundColor = "lavender"
    // cellsArray[cellId].style.backgroundColor = SELECTED_CELL_COLOR;
};

// let selectionNextCell = cellId =>
function selectionNextCellHander(cellId)
{
    selectedCellsSet.add(cellId);

     if (SudokuMap.cellRow(cellId) !== selectedRow) selectedRow = undefined;
     if (SudokuMap.cellCol(cellId) !== selectedCol) selectedCol = undefined;
     if (SudokuMap.cellBox(cellId) !== selectedBox) selectedBox = undefined;



    // console.log("selectionNextCell " + cellId);
    updateBoard();
    // cellsArray[cellId].style.backgroundColor = SELECTED_CELL_COLOR;
}

function updateBoard()
{
    console.log("selected Cells " + Array.from(selectedCellsSet).toString());
    console.log("selected Row " + selectedRow);
    console.log("selected Column " + selectedCol);
    console.log("selected Box " + selectedBox);

    for (let cell = 0; cell <=80; cell++)
    {
        if (selectedCellsSet.has(cell)) {
            cellSetBackgroundColor(cell, SELECTED_CELL_COLOR);
        }
        else if (SudokuMap.cellRow(cell) === selectedRow ||
                 SudokuMap.cellCol(cell) === selectedCol ||
                 SudokuMap.cellBox(cell) === selectedBox) {
            cellSetBackgroundColor(cell, SELECTED_UNIT_COLOR);
        }
        else
            cellSetBackgroundColor(cell, "");
    }

    //     if (SudokuMap.cellRow(cellId)

    //  SudokuMap.cellCol(cellId)
    // SudokuMap.cellBox(cellId)

}