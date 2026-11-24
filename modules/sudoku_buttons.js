class SudokuButtons {

    constructor(width = 400) {
        // Look and layout come from the .panel / .btn* classes in styles.css
        this.buttons = $("<div></div>");
        $(this.buttons).addClass("panel buttons-panel");
        $(this.buttons).css("width", width);

        // [label, id, row]. "Main Menu" gets the "menu" style.
        const ctrlButtons = [["Clear",         "clear",   1],
                             ["Select",        "select",  1],
                             ["Erase",         "erase",   1],
                             ["X",             "x",       1],
                             ["Color",         "color",   1],
                             ["Value",         "value",   2],
                             ["Notes 1",       "notes1",  2],
                             ["Notes 2",       "notes2",  2],
                             ["Undo",          "undo",    3],
                             ["Redo",          "redo",    3],
                             ["Main Menu",     "menu",    3],
                            ];

        this.buttonsMap = new Map();
        const rows = new Map();

        for (const btn of ctrlButtons) {
            if (!rows.has(btn[2])) {
                const row = $("<div></div>").addClass("btn-row");
                rows.set(btn[2], row);
                $(this.buttons).append(row);
            }
            const button = $("<button></button>");
            $(button).addClass("btn");
            if (btn[1] === "menu")
                $(button).addClass("btn-menu");
            $(button).text(btn[0]);
            $(button).click(() => this.buttonClickHandler(btn[1]));
            $(rows.get(btn[2])).append(button);
            this.buttonsMap.set(btn[1], button);
        }

        const numButtons = $("<div></div>").addClass("btn-row num-row");

        for (let i = 1; i <= 9; i++) {
            const button = $("<button></button>");
            $(button).addClass("btn btn-num");
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

    // Highlights a toggle button (Select, Value, Notes) as switched on
    setButtonActive(button, active) {
        if (!this.buttonsMap.has(button)) {
            console.log("Invalid button: " + button);
            return;
        }
        $(this.buttonsMap.get(button)).toggleClass("active", active);
    }

    setButtonEnabled(button, enabled) {
        if (!this.buttonsMap.has(button)) {
            console.log("Invalid button: " + button);
            return;
        }
        $(this.buttonsMap.get(button)).prop("disabled", !enabled);
    }

    keyPressHandler(evt) {
        // Ignore keys while the buttons are hidden (e.g. the main menu is showing)
        if (!$(this.buttons).is(":visible"))
            return;

        // Ctrl+Z -> undo, Ctrl+Y or Ctrl+Shift+Z -> redo (Cmd on macOS)
        if (evt.ctrlKey || evt.metaKey) {
            if (evt.which === 90 && !evt.shiftKey) {
                evt.preventDefault();
                this.buttonClickHandler("undo");
            }
            else if (evt.which === 89 || (evt.which === 90 && evt.shiftKey)) {
                evt.preventDefault();
                this.buttonClickHandler("redo");
            }
            // Leave other Ctrl shortcuts (copy, reload, ...) to the browser
            return;
        }

        // Number keys (1-9) and Keypad numbers (1-9)
        if ( (evt.which >= 49 && evt.which <= 57) || (evt.which >= 97 && evt.which <= 105) ) {
            this.buttonClickHandler(evt.key);
        }
        // Arrow keys
        if (evt.which >= 37 && evt.which <= 40) {
            // console.log("Arrow Key pressed " + evt.key + " (" + evt.shiftKey + ")");
            // console.log("Arrow Key pressed foo1" + evt.key + " foo2 (" + evt.shiftKey + ")");
            console.log("foo bar");
            $("#logParagraph2").text("Arrow Key pressed " + evt.key + " (" + evt.shiftKey + ")");
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
