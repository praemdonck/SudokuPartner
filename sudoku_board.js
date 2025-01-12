const sudokuBoard = document.getElementById("sudokuBoard");
sudokuBoard.addEventListener("contextmenu", e => e.preventDefault());

function generateSudokuCells(box, boxHeight) {
    const cellHeight = boxHeight / 3;

    let cellsHTML = `
    <div id="CELL_${SudokuMap.boxIndices[box][0]}"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][1]}"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][2]}"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][3]}"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][4]}"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][5]}"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][6]}"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][7]}"></div>
    <div id="CELL_${SudokuMap.boxIndices[box][8]}"></div>`

    return cellsHTML;
}

function fillCellCandidatesType1(cell, candidates) {
    
    const candidateHeight = cellsArray[cell].getBoundingClientRect().height / 3-1;

    let candidateHTML = `
<table style="width:100%;" class="box_table">
<tr style="line-height: ${candidateHeight}px; height: ${candidateHeight}px;">
<td class="cell_candidate">${candidates[0]}</td>
<td class="cell_candidate">${candidates[1]}</td>
<td class="cell_candidate">${candidates[2]}</td>
</tr>
<tr style="line-height: ${candidateHeight}px; height: ${candidateHeight}px;">
<td class="cell_candidate">${candidates[3]}</td>
<td class="cell_candidate">${candidates[4]}</td>
<td class="cell_candidate">${candidates[5]}</td>
</tr>
<tr style="line-height: ${candidateHeight}px; height: ${candidateHeight}px;">
<td class="cell_candidate">${candidates[6]}</td>
<td class="cell_candidate">${candidates[7]}</td>
<td class="cell_candidate">${candidates[8]}</td>
</tr>
</table>`

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

function addMouseEventListener(elementId, event)
{
        const element=document.getElementById(elementId)
        element.addEventListener(event, evt => {
        evt.preventDefault();
        evt.stopPropagation();
        // console.log("Element " + elementId + " mousemouve " + evt.clientX);
        // console.log("squareTable  mousemove clientX: " + evt.clientX + ", clientY: " + evt.clientY);
        // console.log(evt.type);
        // const onCell = getCellId_v2(evt.clientX,evt.clientY);
        const onCell = getCellId(evt.clientX,evt.clientY);
        if (onCell !== undefined)
        {
            if (evt.buttons === 1)
                cellsArray[onCell].style.backgroundColor = "blue"
            if (evt.buttons === 2)
                cellsArray[onCell].style.backgroundColor = ""
        }
        console.log("Mouse on cell " + onCell);
        t=document.getElementById("logParagraph");
        // t.textContent="squareTable  mousemove" + " clientX: " + evt.clientX + ", clientY: " + evt.clientY
        t.textContent="Element " + elementId + " received event " + event + " clientX: " + evt.clientX + ", clientY: " + evt.clientY + ", button: " + evt.button + ", buttons: " + evt.buttons
        // t.textContent="Mouse on cell " + onCell
    });
}

function addTouchEventListener(elementId, event)
{
        const element=document.getElementById(elementId)
        element.addEventListener(event, evt => {
        evt.preventDefault();
        evt.stopPropagation();
        // console.log("Element " + elementId + " mousemouve " + evt.clientX);
        // console.log("squareTable  mousemove clientX: " + evt.clientX + ", clientY: " + evt.clientY);
        // console.log(evt.type);

        const x = evt.touches[0].clientX;
        const y = evt.touches[0].clientY;

        const onCell = getCellId_v2(x, y);

        if (onCell !== undefined)
        {
            cellsArray[onCell].style.backgroundColor = "blue"
            // if (evt.buttons === 1)
            // if (evt.buttons === 2)
            //     cellsArray[onCell].style.backgroundColor = ""
        }
        console.log("Mouse on cell " + onCell);
        t=document.getElementById("logParagraph");
        // t.textContent="squareTable  mousemove" + " clientX: " + evt.clientX + ", clientY: " + evt.clientY
        t.textContent="Element " + elementId + " received event " + event + " clientX: " + x + ", clientY: " + y
        // t.textContent="Mouse on cell " + onCell
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
}

function getTextWidth(textToMeasure, fontSize) {

    text = document.createElement("span");
    document.body.appendChild(text);

    text.style.fontFamily = "verdana";
    text.style.fontSize = fontSize;
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    // text.style.whiteSpace = 'no-wrap';
    text.innerHTML = textToMeasure;

    width = Math.ceil(text.clientWidth);
    formattedWidth = width + "px";

    document.body.removeChild(text);

    return formattedWidth
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


addMouseEventListener("sudokuBoard", "mousemove")
addMouseEventListener("sudokuBoard", "mousedown")
addTouchEventListener("sudokuBoard",  "touchmove")
addTouchEventListener("sudokuBoard",  "touchstart")


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
// fillCellCandidatesType1(72, ['','','','','','',7,8,9])
fillCellCandidatesType2(73, "123")