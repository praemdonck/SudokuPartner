import { SudokuStore } from './sudoku_store.js';

class MainMenu {

    constructor(width = 400) {
        // Look and layout come from the .panel / .menu-* / .btn* classes in styles.css
        this.menu = $("<div></div>");
        $(this.menu).attr("id", "mainMenu");
        $(this.menu).addClass("panel main-menu");
        $(this.menu).css("width", width);

        $(this.menu).append($("<h1></h1>").addClass("menu-title").text("Sudoku"));

        const button1 = $("<button></button>");
        $(button1).addClass("btn btn-primary btn-large");
        $(button1).text("Start Game");
        $(button1).click(() => this.buttonClickHandler("start"));
        $(this.menu).append(button1);

        // Puzzle picker: dropdown with the saved sudokus (see sudoku_store.js) + Load
        $(this.menu).append($("<h2></h2>").addClass("menu-heading").text("Choose a puzzle"));

        this.select = $("<select></select>");
        $(this.select).addClass("field");
        this.refreshSudokuList();

        const button2 = $("<button></button>");
        $(button2).addClass("btn");
        $(button2).text("Load Game");
        $(button2).click(() => this.buttonClickHandler("load"));

        $(this.menu).append($("<div></div>").addClass("menu-row").append(this.select, button2));

        $(this.select).change(function() {
            const selectedDifficulty = $(this).val();
            $("#logParagraph2").text("Selected difficulty:" + selectedDifficulty);
            console.log("Selected difficulty:" + selectedDifficulty);
        });

        // Controls to save a new sudoku
        const nameInput = $("<input>");
        $(nameInput).addClass("field");
        $(nameInput).attr("placeholder", "Name");

        const puzzleInput = $("<input>");
        $(puzzleInput).addClass("field field-mono");
        $(puzzleInput).attr("placeholder", "81 digits, 0 = empty");
        $(puzzleInput).attr("maxlength", 81);

        const saveButton = $("<button></button>");
        $(saveButton).addClass("btn");
        $(saveButton).text("Save Sudoku");
        $(saveButton).click(() => {
            const name = $(nameInput).val().trim() || "Untitled";
            const puzzle = $(puzzleInput).val().trim();
            try {
                SudokuStore.add(name, puzzle);
            } catch (e) {
                alert(e.message);
                return;
            }
            this.refreshSudokuList();
            $(this.select).val(puzzle); // Select the sudoku just saved
            $(nameInput).val("");
            $(puzzleInput).val("");
        });

        $(this.menu).append(
            $("<h2></h2>").addClass("menu-heading").text("Add a puzzle"),
            $("<div></div>").addClass("menu-row").append(nameInput, saveButton),
            puzzleInput);

        // const ctrlButtons = [["Clear",  "clear",  1],
        //                      ["Select", "select", 1],
        //                      ["Erase",  "erase",  1],
        //                      ["X",      "x",      1],
        //                      ["Color",  "color",  1],
        //                      ["Value",  "value",  2],
        //                      ["Notes Type 1",  "notes1",  2],
        //                      ["Notes Type 2",  "notes2",  2],
        //                      ["Undo",  "undo",  2],
        //                      ["Redo",  "redo",  2],
        //                     ];
        
        // this.buttonsMap = new Map();

        // for (const btn of ctrlButtons) {
        //     const button = $("<button></button>");
        //     $(button).css("grid-row", btn[2]);
        //     $(button).text(btn[0]);
        //     $(button).click(() => this.buttonClickHandler(btn[1]));
        //     $(ctrlButtonsDiv).append(button); 
        //     this.buttonsMap.set(btn[1], button);
        // }

        // $(this.buttons).append(ctrlButtonsDiv);

        // const numButtons = $("<div></div>");
        // $(numButtons).css("display", "grid");
        // $(numButtons).css("margin", "3px");
        // $(numButtons).css("gap", "3px");

        // for (let i = 1; i <= 9; i++) {
        //     const button = $("<button></button>");
        //     $(button).css("grid-row", "1");
        //     $(button).text(i);
        //     $(button).click(() => this.buttonClickHandler(i.toString()));
        //     $(numButtons).append(button);
        //     this.buttonsMap.set(i.toString(), button);
        // }

        // $(this.buttons).append(numButtons);

        // $("body").on({
        //     keydown:  (evt) => {this.keyPressHandler(evt);},
        // });

    }

    buttonClickHandler(buttonId) {
        if (typeof this.buttonClickCallback === 'function')
            this.buttonClickCallback(buttonId);
    }

    // Fill the dropdown with the sudokus currently in storage
    refreshSudokuList() {
        $(this.select).empty();
        for (const opt of SudokuStore.load()) {
            const option = $("<option></option>").val(opt.value).text(opt.text);
            $(this.select).append(option);
        }
    }

    getSelectedSudoku() {
        const selectedSudoku = $(this.select).val();
        console.log("Selected Sudoku: " + selectedSudoku);
        return selectedSudoku;
    }

    // buttonClickCallback sample function. 
    // This function can be replaced by the user with a callback
    buttonClickCallback = (buttonId) => {
        console.log("Button clicked " + buttonId);
        $("#logParagraph2").text("Button clicked " + buttonId);
    }
}

export { MainMenu };