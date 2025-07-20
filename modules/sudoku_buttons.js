class SudokuButtons {

    constructor(width = 400) {
        this.buttons = $("<div></div>");
        $(this.buttons).css("height", "100px");
        $(this.buttons).css("width", width);

        $(this.buttons).css("margin", "20px");
        $(this.buttons).css("border", "1px solid black");
        $(this.buttons).css("background-color", "yellow");
        $(this.buttons).css("display", "grid");

        const ctrlButtonsDiv = $("<div></div>");
        $(ctrlButtonsDiv).css("display", "grid");
        $(ctrlButtonsDiv).css("margin", "3px");
        $(ctrlButtonsDiv).css("gap", "3px");

        const ctrlButtons = [["Clear",         "clear",   1],
                             ["Select",        "select",  1],
                             ["Erase",         "erase",   1],
                             ["X",             "x",       1],
                             ["Color",         "color",   1],
                             ["Value",         "value",   2],
                             ["Notes Type 1",  "notes1",  2],
                             ["Notes Type 2",  "notes2",  2],
                             ["Undo",          "undo",    2],
                             ["Redo",          "redo",    2],
                             ["Main Menu",     "menu",    2],
                            ];
        
        this.buttonsMap = new Map();

        for (const btn of ctrlButtons) {
            const button = $("<button></button>");
            $(button).css("grid-row", btn[2]);
            $(button).text(btn[0]);
            $(button).click(() => this.buttonClickHandler(btn[1]));
            $(ctrlButtonsDiv).append(button); 
            this.buttonsMap.set(btn[1], button);
        }

        $(this.buttons).append(ctrlButtonsDiv);

        const numButtons = $("<div></div>");
        $(numButtons).css("display", "grid");
        $(numButtons).css("margin", "3px");
        $(numButtons).css("gap", "3px");

        for (let i = 1; i <= 9; i++) {
            const button = $("<button></button>");
            $(button).css("grid-row", "1");
            $(button).text(i);
            $(button).click(() => this.buttonClickHandler(i.toString()));
            $(numButtons).append(button);
            this.buttonsMap.set(i.toString(), button);
        }

        $(this.buttons).append(numButtons);

        $("body").on({
            keydown:  (evt) => {this.keyPressHandler(evt);},
        });

    }

    setButtonBackgroundColor(button, color) {
        if (!this.buttonsMap.has(button)) {
            console.log("Invalid button: " + button);
            return;
        }
        $(this.buttonsMap.get(button)).css("background-color", color);
    }

    keyPressHandler(evt) {
        if (evt.which >= 49 && evt.which <= 57) {
            this.buttonClickHandler(evt.key);
        }
        if (evt.which >= 37 && evt.which <= 40) {
            this.buttonClickHandler(evt.key);
        }
        else if (evt.which === 69) {  // e -> erase (8 is backspace)
            this.buttonClickHandler("erase");
        }
        else if (evt.which === 83) { // s -> select
            this.buttonClickHandler("select");
        }
        // else if (evt.which === 69) {
        //     this.buttonClickHandler("erase");
        // }
        // else if (evt.which === 88) {
        //     this.buttonClickHandler("x");
        // }
        else if (evt.which === 86) {
            this.buttonClickHandler("value");
        }
        else if (evt.which === 78) {
            this.buttonClickHandler("notes1");
        }
        else if (evt.which === 77) {
            this.buttonClickHandler("notes2");
        }
        // else if (evt.which === 85) {
        //     this.buttonClickHandler("undo");
        // }
        // else if (evt.which === 82) {
        //     this.buttonClickHandler("redo");
        // }
    }


    buttonClickHandler(buttonId) {
        if (typeof this.buttonClickCallback === 'function')
            this.buttonClickCallback(buttonId);
    }

    // buttonClickCallback sample function. 
    // This function can be replaced by the user with a callback
    buttonClickCallback = (buttonId) => {
        console.log("Button clicked " + buttonId);
        $("#logParagraph2").text("Button clicked " + buttonId);
    }
}

export { SudokuButtons };
