const sudokuBoard = document.getElementById("sudokuBoard");
sudokuBoard.addEventListener("contextmenu", e => e.preventDefault());
const body = document.getElementById("body");
body.addEventListener("contextmenu", e => e.preventDefault());

function generateSudokuCells(box, boxHeight) {
    const cellHeight = boxHeight / 3;

    let cellsHTML = `
    <div id="CELL_${SudokuMap.boxIndices[box][0]}" class="cellDefault"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][1]}" class="cellDefault"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][2]}" class="cellDefault"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][3]}" class="cellDefault"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][4]}" class="cellDefault"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][5]}" class="cellDefault"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][6]}" class="cellDefault"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][7]}" class="cellDefault"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][8]}" class="cellDefault"></div>`

    return cellsHTML;
}

function fillCellCandidatesType1(cell, candidates) {
    
    let candidateHTML = `
    <div class="candidateType1">${candidates[0]}</div>
    <div class="candidateType1">${candidates[1]}</div>
    <div class="candidateType1">${candidates[2]}</div>
    <div class="candidateType1">${candidates[3]}</div>
    <div class="candidateType1">${candidates[4]}</div>
    <div class="candidateType1">${candidates[5]}</div>
    <div class="candidateType1">${candidates[6]}</div>
    <div class="candidateType1">${candidates[7]}</div>
    <div class="candidateType1">${candidates[8]}</div>`

    cellsArray[cell].className = 'cellCandidateType1';
    cellsArray[cell].innerHTML = candidateHTML;
}

function fillCellCandidatesType2(cell, candidates)
{
    const cellWidth = cellsArray[cell].clientWidth;
    let fontSize = 15
    if (fontSize * 0.65 * candidates.length > cellWidth)
    {
        fontSize = cellWidth / candidates.length / 0.65
    }

    cellsArray[cell].style.fontSize=fontSize + "px"
    cellsArray[cell].innerHTML=candidates
}

let mouseDown = false;
let lastSelectedCell = undefined;
// evt.button -> button associated with event: 0->Left; 1->Center; 2->Right
// evt.buttons -> bitmask of the currently pressed buttons: bit[0]->Left; bit[1]->Right; bit[2]->Center
function addMouseEventListener(elementId, event)
{
    const element=document.getElementById(elementId)
    element.addEventListener(event, evt => {
        evt.preventDefault();
        evt.stopPropagation();

        // Ignore mouseup or mousedown events for buttons other than left (button 0)
        if ((event === 'mousedown' || event === 'mouseup') && (evt.button !== 0))
            return;

        // Get the cell under the mouse
        const onCell = getCellId(evt.clientX, evt.clientY);

        if (onCell === undefined)
            return

        if (event === 'mousedown')
        {
            selectionFirstCell(onCell);
            lastSelectedCell = onCell;
        }
        if (event === 'mouseup')
        {
            lastSelectedCell = undefined;
        }
        if (event === 'mousemove' && onCell !== lastSelectedCell && lastSelectedCell !== undefined)
        {
            selectionNextCell(onCell);
            lastSelectedCell = onCell;
        }

        // console.log("Mouse on cell " + onCell);
        // console.log("Element " + elementId + " received event " + event + " button " + evt.button + " buttons " + evt.buttons);
        t=document.getElementById("logParagraph");
        // t.textContent="squareTable  mousemove" + " clientX: " + evt.clientX + ", clientY: " + evt.clientY
        t.textContent="Element " + elementId + " received event " + event + " clientX: " + evt.clientX + ", clientY: " + evt.clientY + ", button: " + evt.button + ", buttons: " + evt.buttons
    });
}

function addTouchEventListener(elementId, event)
{
    const element=document.getElementById(elementId)
    element.addEventListener(event, evt => {
        evt.preventDefault();
        evt.stopPropagation();

        // Ignore mouseup or mousedown events for buttons other than left (button 0)
        // if ((event === 'mousedown' || event === 'mouseup') && (evt.button !== 0))
        //     return;

        if (event === 'touchend')
        {
            lastSelectedCell = undefined;
            return;
        }

        // Get the cell under the mouse
        const x = evt.touches[0].clientX;
        const y = evt.touches[0].clientY;
        const onCell = getCellId(x, y);

        if (onCell === undefined)
            return

        if (event === 'touchstart')
        {
            selectionFirstCell(onCell);
            lastSelectedCell = onCell;
        }
        if (event === 'touchmove' && onCell !== lastSelectedCell && lastSelectedCell !== undefined)
        {
            selectionNextCell(onCell);
            lastSelectedCell = onCell;
        }

        t=document.getElementById("logParagraph");
        // t.textContent="squareTable  mousemove" + " clientX: " + evt.clientX + ", clientY: " + evt.clientY
        t.textContent="Element " + elementId + " received event " + event + " clientX: " + x + ", clientY: " + y
        // t.textContent="Mouse on cell " + onCell
    });
}

function addButtonListener(elementId, buttonNumber)
{
    const element=document.getElementById(elementId)
    element.addEventListener('click', evt => {
        evt.preventDefault();
        evt.stopPropagation();

        for (cell of selectedCellsSet) {
            cellSetValue(cell, buttonNumber)
        }
        // if (lastSelectedCell)
        //     cellSetValue(lastSelectedCell, buttonNumber)

        console.log("Button " + buttonNumber + " Clicked");
        t=document.getElementById("logParagraph");
        t.textContent="Button " + buttonNumber + " Clicked"
    });
}

function getCellId(x, y)
{
    for (let i=0; i<81; i++)
    {
        const cell = cellsArray[i];
        const boundingBox = cell.getBoundingClientRect()

        if (x >= boundingBox.left && x <= boundingBox.right && y >= boundingBox.top && y <= boundingBox.bottom)
        {
            return i;
        }
    }
    return undefined
}

function getCellId_v2(x, y)
{
    const boundingBox = sudokuBoard.getBoundingClientRect();

    if (x < boundingBox.left || x > boundingBox.right || y < boundingBox.top || y > boundingBox.bottom)
    {
        return undefined;
    }

    const colWidth  = boundingBox.width  / 9;
    const rowHeight = boundingBox.height / 9;

    const col = Math.floor((x - boundingBox.left) / colWidth);
    const row = Math.floor((y - boundingBox.top) / rowHeight);

    const cell = col + row * 9;

    // console.log(`Column ${col}, Row ${row}, cell ${cell}`)

    return cell;
}

function cellSetBackgroundColor(cell, color)
{
    cellsArray[cell].style.backgroundColor = color;
}

function cellSetValue(cell, value)
{
    cellsArray[cell].style.fontSize = "";
    cellsArray[cell].innerHTML = value;
    cellsArray[cell].className = 'cellDefault';
}





// Generate Boxes Array
const boxesArray = [];
for (let i=0; i<9; i++)
{
    boxesArray.push(document.getElementById(`BOX_${i}`));
}

// Add cells to boxes
{
    const boxHeight = boxesArray[0].getBoundingClientRect().height
    for (let i = 0; i < 9; i++) {
        boxesArray[i].innerHTML = generateSudokuCells(i, boxHeight);
    }
}

// Generate Cells Array
const cellsArray = [];
for (let i=0; i<81; i++)
{
    cellsArray.push(document.getElementById(`CELL_${i}`));
}

// Number Buttons Array
// const numBtnArray = [];
for (let i=1; i<=9; i++)
{
    // numBtnArray.push(document.getElementById(`BTN_${i}`));
    addButtonListener(`BTN_${i}`, i)
}


addMouseEventListener("sudokuBoard", "mousemove")
addMouseEventListener("sudokuBoard", "mousedown")
addMouseEventListener("sudokuBoard", "mouseup")
addMouseEventListener("body", "mouseup")
addTouchEventListener("sudokuBoard",  "touchmove")
addTouchEventListener("sudokuBoard",  "touchstart")
addTouchEventListener("sudokuBoard",  "touchend")


cellSetBackgroundColor(0, "red")
cellSetBackgroundColor(1, "#95b7ed")
cellSetBackgroundColor(2, "#c4f757")

const sudokuString =  "863100207020070800507802090008200079706000528290780300080627401672010980000008762";
for (let i=0; i<81; i++)
{
    let cellValue = sudokuString[i];
    cellValue = cellValue === "0" ? "" : cellValue;
    cellSetValue(i, cellValue);
}
fillCellCandidatesType1(72, ['','',3,'',5,'',7,8,9])
fillCellCandidatesType2(73, "123")
fillCellCandidatesType2(74, "12345")



// board selection APIs:
// Selection Start -> cell Id : call when the first/only cell is selected
// Cell Selected -> cell Id :  call when more cells are selected after first cell

let selectedCellsSet = new Set();
let selectionFirstCell = cellId =>
{
    selectedCellsSet.clear();
    selectedCellsSet.add(cellId);
    console.log("selectionFirstCell " + cellId);

    for (cell of cellsArray)
        cell.style.backgroundColor = ""

    cellsArray[cellId].style.backgroundColor = "lavender"
};

// function selectionNextCell(cellId)
let selectionNextCell = cellId =>
{
    selectedCellsSet.add(cellId);
    console.log("selectionNextCell " + cellId);
    cellsArray[cellId].style.backgroundColor = "lavender"
}