class SudokuBoard {
    mainBorderWidth = 3;
    boxBorderWidth = 3;
    cellBorderWidth = 0.5;

    lastSelectedCell = undefined;

    constructor(size) {
        this.board = $("<div></div>");

        $(this.board).attr("id", "sudokuBoard");

        // Generate the board with the specified size
        $(this.board).css("height", size);
        $(this.board).css("width", size);
        $(this.board).css("position", "relative");
        $(this.board).css("margin", 20);
        // $(this.board).css("background-color", "yellow");
        $(this.board).css("border", this.mainBorderWidth+"px solid black");
        $(this.board).css("box-sizing", "border-box");

        // Generate the boxes
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const box = $("<div></div>");
                $(box).css("height", size / 3);
                $(box).css("width", size / 3);
                $(box).css("position", "absolute");
                $(box).css("top", -this.mainBorderWidth + (i * size / 3));
                $(box).css("left", -this.mainBorderWidth + (j * size / 3));
                // $(box).css("background-color", "WhiteSmoke");
                $(box).css("border", (this.boxBorderWidth / 2) + "px solid black");
                $(box).css("box-sizing", "border-box");
                $(box).css("z-index", -1);

                $(this.board).append(box);
            }
        }

        // Array to hold the cells
        this.cellsArray = [];
        // generate the cells
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = $("<div></div>");
                $(cell).css("height", size / 9);
                $(cell).css("width", size / 9);
                $(cell).css("position", "absolute");
                $(cell).css("top", -this.mainBorderWidth + (i * size / 9));
                $(cell).css("left", -this.mainBorderWidth + (j * size / 9));
                // $(cell).css("background-color", "WhiteSmoke");
                $(cell).css("border", (this.cellBorderWidth / 2) + "px solid grey");
                $(cell).css("box-sizing", "border-box");
                $(cell).css("z-index", -2);
                $(cell).addClass("cell");
                $(this.board).append(cell);
                this.cellsArray.push(cell);
            }
        }

        // Register the handlers for mouse and touch events
        $(this.board).on({
            mousemove:  (evt) => {this.mouseHandler(evt);},
            mousedown:  (evt) => {this.mouseHandler(evt);},
            mouseup:    (evt) => {this.mouseHandler(evt);},
            touchstart: (evt) => {this.touchHandler(evt);},
            touchend:   (evt) => {this.touchHandler(evt);},
            touchmove:  (evt) => {this.touchHandler(evt);},
        });


    }

    getCellId(x, y) {
        for (let i=0; i<81; i++)
        {
            const cell = this.cellsArray[i];
            const boundingBox = cell[0].getBoundingClientRect();

            if (x >= boundingBox.left && x <= boundingBox.right && y >= boundingBox.top && y <= boundingBox.bottom)
            {
                return i;
            }
        }
        return undefined;
    }

    touchHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (evt.type === 'touchend')
        {
            this.lastSelectedCell = undefined;
            // $("#logParagraph").text("touchHandler (" + evt.type + ")");
            return;
        }

        // Get the cell under the mouse
        const x = evt.touches[0].clientX;
        const y = evt.touches[0].clientY;
        console.log("touchHandler (" + evt.type + "): x " + x + ", y " + y);
        
        const onCell = this.getCellId(x, y);
        $("#logParagraph").text("touchHandler (" + evt.type + "): x " + x + ", y " + y + ", cell " + onCell);

        if (onCell === undefined)
            return

        if (evt.type === 'touchstart')
        {
            if (typeof this.selectionFirstCell === 'function')
                this.selectionFirstCell(onCell);
            this.lastSelectedCell = onCell;
        }
        if (evt.type === 'touchmove' && onCell !== this.lastSelectedCell && this.lastSelectedCell !== undefined)
        {
            if (typeof this.selectionNextCell === 'function')
                this.selectionNextCell(onCell);
            this.lastSelectedCell = onCell;
        }
    }

// evt.button -> button associated with event: 0->Left; 1->Center; 2->Right
// evt.buttons -> bitmask of the currently pressed buttons: bit[0]->Left; bit[1]->Right; bit[2]->Center
    mouseHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        // Ignore mouseup or mousedown events for buttons other than left (button 0)
        if ((evt.type === 'mousedown' || evt.type === 'mouseup') && (evt.button !== 0))
            return;

        // Get the cell under the mouse
        const x = evt.clientX;
        const y = evt.clientY;
        const onCell = this.getCellId(x, y);

        if (onCell === undefined)
            return

        $("#logParagraph").text("mouseHandler (" + evt.type + "): x " + x + ", y " + y + ", cell " + onCell);

        if (evt.type === 'mousedown')
        {
            if (typeof this.selectionFirstCell === 'function')
                this.selectionFirstCell(onCell);
            this.lastSelectedCell = onCell;
        }
        if (evt.type === 'mouseup' ||
            (evt.type === 'mousemove' && evt.buttons !== 1))
        {
            this.lastSelectedCell = undefined;
        }
        if (evt.type === 'mousemove' && onCell !== this.lastSelectedCell && this.lastSelectedCell !== undefined)
        {
            if (typeof this.selectionNextCell === 'function')
                this.selectionNextCell(onCell);
            this.lastSelectedCell = onCell;
        }

        // console.log("Mouse on cell " + onCell);
        // console.log("received event " + evt.type + " button " + evt.button + " buttons " + evt.buttons);
    }

    // selectionFirstCell sample function. 
    // This function can be replaced by the user with a callback
    selectionFirstCell = (cell) => {
        console.log("First cell selected: " + cell);
        $("#logParagraph2").text("First cell selected: " + cell);
    }

    // selectionNextCell sample function. 
    // This function can be replaced by the user with a callback
    selectionNextCell = (cell) => {
        console.log("Next cell selected: " + cell);
        $("#logParagraph2").text("Next cell selected: " + cell);
    }


    setCellValue(cell, value) {
        if (cell < 0 || cell > 80) {
            console.log("Invalid cell number: " + cell);
            return;
        }
        this.cellsArray[cell].empty();
        $(this.cellsArray[cell]).css("font-size", "");
        $(this.cellsArray[cell]).text(value);
    }

    setCellBackgroundColor(cell, color) {
        if (cell < 0 || cell > 80) {
            console.log("Invalid cell number: " + cell);
            return;
        }
        $(this.cellsArray[cell]).css("background-color", color);
    }
    
    // Set notes in a 9x9 grid format
    setCellNotesType1(cell, notesSet)
    {
        if (cell < 0 || cell > 80) {
            console.log("Invalid cell number: " + cell);
            return;
        }
        
        this.cellsArray[cell].empty();
        
        let notes = ["", "", "", "", "", "", "", "", ""];
        for (const note of notesSet) 
            if (note >=1 && note <= 9)
                notes[note-1] = note;

        const padding = 3;

        const noteWidth  = (this.cellsArray[cell].width() - 2*padding) / 3;
        const noteHeight = (this.cellsArray[cell].width() - 2*padding) / 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const note = $("<div></div>").text(notes[i*3+j]);
                $(note).css("height", noteHeight);
                $(note).css("width", noteWidth);
                $(note).css("position", "absolute");
                $(note).css("top",  (i * noteHeight + padding));
                $(note).css("left", (j * noteWidth + padding));
                $(note).addClass("noteType1");
                $(this.cellsArray[cell]).append(note);
            }
        }
    }

    // Set notes in a single line format
    setCellNotesType2(cell, notesSet)
    {
        if (cell < 0 || cell > 80) {
            console.log("Invalid cell number: " + cell);
            return;
        }
        
        this.cellsArray[cell].empty();

        const notes = Array.from(notesSet).toSorted().join('');

        const cellWidth = this.cellsArray[cell].width();
        let fontSize = 15
        if (fontSize * 0.65 * notes.length > cellWidth)
        {
            fontSize = cellWidth / notes.length / 0.65
        }

        $(this.cellsArray[cell]).text(notes);
        $(this.cellsArray[cell]).css("font-size", fontSize + "px");
        // cellsArray[cell].style.fontSize=fontSize + "px"
        // cellsArray[cell].innerHTML=candidates
    }
};
    

export { SudokuBoard};
