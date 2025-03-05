const sudokuBoard = document.getElementById("sudokuBoard");
sudokuBoard.addEventListener("contextmenu", e => e.preventDefault());
const body = document.getElementById("body");
body.addEventListener("contextmenu", e => e.preventDefault());

function generateSudokuCells(box) {
    // const cellHeight = boxHeight / 3;

    let cellsHTML = `
        <div class="board-row">
          <div id="CELL_${SudokuMap.boxIndices[box][0]}" class="cell"></div>
          <div id="CELL_${SudokuMap.boxIndices[box][1]}" class="cell"></div>
          <div id="CELL_${SudokuMap.boxIndices[box][2]}" class="cell"></div>
        </div>
        <div class="board-row">
          <div id="CELL_${SudokuMap.boxIndices[box][3]}" class="cell"></div>
          <div id="CELL_${SudokuMap.boxIndices[box][4]}" class="cell"></div>
          <div id="CELL_${SudokuMap.boxIndices[box][5]}" class="cell"></div>
        </div>
        <div class="board-row">
          <div id="CELL_${SudokuMap.boxIndices[box][6]}" class="cell"></div>
          <div id="CELL_${SudokuMap.boxIndices[box][7]}" class="cell"></div>
          <div id="CELL_${SudokuMap.boxIndices[box][8]}" class="cell"></div>
        </div>`;

    return cellsHTML;
}

function fillCellCandidatesType1(cell, candidatesSet)
{
    let candidates = ["", "", "", "", "", "", "", "", ""];
    for (const candidate of candidatesSet) 
        if (candidate >=1 && candidate <= 9)
            candidates[candidate-1] = candidate;

    let candidateHTML = `
        <div class="board-row">
          <div class="candidateType1">${candidates[0]}</div>
          <div class="candidateType1">${candidates[1]}</div>
          <div class="candidateType1">${candidates[2]}</div>
        </div>
        <div class="board-row">
          <div class="candidateType1">${candidates[3]}</div>
          <div class="candidateType1">${candidates[4]}</div>
          <div class="candidateType1">${candidates[5]}</div>
        </div>
        <div class="board-row">
          <div class="candidateType1">${candidates[6]}</div>
          <div class="candidateType1">${candidates[7]}</div>
          <div class="candidateType1">${candidates[8]}</div>
        </div>`;

    cellsArray[cell].className = 'cellCandidateType1';
    cellsArray[cell].innerText  = '';
    cellsArray[cell].innerHTML = candidateHTML;
}

function fillCellCandidatesType2(cell, candidatesSet)
{
    const candidates = Array.from(candidatesSet).toSorted().join('');

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
            if (typeof selectionFirstCell === 'function')
                selectionFirstCell(onCell);
            lastSelectedCell = onCell;
        }
        if (event === 'mouseup')
        {
            lastSelectedCell = undefined;
        }
        if (event === 'mousemove' && onCell !== lastSelectedCell && lastSelectedCell !== undefined)
        {
            if (typeof selectionNextCell === 'function')
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
            if (typeof selectionFirstCell === 'function')
                selectionFirstCell(onCell);
            lastSelectedCell = onCell;
        }
        if (event === 'touchmove' && onCell !== lastSelectedCell && lastSelectedCell !== undefined)
        {
            if (typeof selectionNextCell === 'function')
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
    cellsArray[cell].className = 'cell';
}

// cellData can have the following properties:
// backgroundColor -> a valid html color
// valueColor -> a valid html color
// value -> value between 0 to 9 or empty string (0 is treated as the empty string)
// candidateType1 -> set of candidated between 1 and 9
// candidateType2 -> set of candidated between 1 and 9
function setCell(cell, cellData)
{
    if (cellData.hasOwnProperty('backgroundColor'))
        cellSetBackgroundColor(cell, cellData.backgroundColor);

    if (cellData.hasOwnProperty('value'))
        cellSetValue(cell, cellData.value);

    if (cellData.hasOwnProperty('candidatesType1'))
        fillCellCandidatesType1(cell, cellData.candidatesType1);

    if (cellData.hasOwnProperty('candidatesType2'))
        fillCellCandidatesType1(cell, cellData.candidatesType2);
}





// Generate Boxes Array
const boxesArray = [];
for (let i=0; i<9; i++)
{
    boxesArray.push(document.getElementById(`BOX_${i}`));
}

// Add cells to boxes
{
    // const boxHeight = boxesArray[0].getBoundingClientRect().height
    for (let i = 0; i < 9; i++) {
        boxesArray[i].innerHTML = generateSudokuCells(i);
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

// // fillCellCandidatesType1(72, ['','',3,'',5,'',7,8,9])
fillCellCandidatesType1(72, new Set([3,5,7,8,9]))
fillCellCandidatesType2(73, new Set([1,2,6]))
fillCellCandidatesType2(74, new Set([1,2,3,4,5,6]))



// board selection APIs:
// Selection Start -> cell Id : call when the first/only cell is selected
// Cell Selected -> cell Id :  call when more cells are selected after first cell

let selectionFirstCell = undefined;
let selectionNextCell = undefined;
