class MainMenu {

    constructor(width = 400) {
        this.menu = $("<div></div>");
        $(this.menu).attr("id", "mainMenu");
        $(this.menu).css("height", "100px");
        $(this.menu).css("width", width);

        $(this.menu).css("margin", "20px");
        $(this.menu).css("border", "1px solid black");
        $(this.menu).css("background-color", "yellow");
        $(this.menu).css("display", "grid");
        // $(this.menu).css("margin", "3px");
        $(this.menu).css("gap", "3px");

        // const menuDiv = $("<div></div>");
        // $(menuDiv).css("display", "grid");
        // $(menuDiv).css("margin", "3px");
        // $(menuDiv).css("gap", "3px");

        const button1 = $("<button></button>");
        $(button1).css("grid-row", 1);
        $(button1).text("Start Game");
        $(button1).css("margin", "3px");
        $(button1).click(() => this.buttonClickHandler("start"));
        $(this.menu).append(button1); 

        const button2 = $("<button></button>");
        $(button2).css("grid-row", 2);
        $(button2).css("margin", "3px");
        $(button2).text("Load Game");
        $(button2).click(() => this.buttonClickHandler("load"));
        $(this.menu).append(button2); 

        const select = $("<select></select>");
        $(select).css("margin", "3px");

        // Example options
        // const options = [
        //     { value: "easy", text: "Easy" },
        //     { value: "medium", text: "Medium" },
        //     { value: "hard", text: "Hard" }
        // ];

        // Example options
        const options = [
            {text: "Sudoku 1",  value: "002370000000000800390820070500000000000408000600203708800900020030000050007064309"},
            {text: "Sudoku 2",  value: "000080020005207180208040506060000010804000702050000630321754869009806200080020000"},
            {text: "Sudoku 3",  value: "870306490490002630006940008004500009659020080700009000568294173927135846143600925"},
            {text: "Sudoku 4",  value: "090480003000000090106002500010005004700060001400100060007500309050000000300097080"},
            {text: "Sudoku 5",  value: "507000124320104057041000060602345709004020500753891642038000476405008001070400005"},
            {text: "Sudoku 6",  value: "470020000050000000109057000005090043003105800980040100000980205000000090000070081"},
            {text: "Sudoku 7",  value: "900000000006080037058906000040703200000040000003809060000605170570090300000000005"},
            {text: "Sudoku 8",  value: "000004000500200079010057004002070956097560400065000807600730090950006702000800640"},
            {text: "Sudoku 9",  value: "853140006910000050027053080080400037000060040240030060060390508098000024500084600"},
            {text: "Sudoku 10", value: "395106000701008009802079050620000704003007200174002095236890000407260900000704062"},
            {text: "Sudoku 11", value: "600000100170050042402137000260704010001265400047300006724800503910070084006000701"},
            {text: "Sudoku 12", value: "863100207020070800507802090008200079706000528290780300080627401672010980000008762"},
            {text: "Sudoku 13", value: "000841067678000401100007000205000000016524308400000152000400009801000700360078000"}
        ];


        options.forEach(opt => {
            const option = $("<option></option>").val(opt.value).text(opt.text);
            $(select).append(option);
        });

        $(this.menu).append(select);

        $(select).change(function() {
            const selectedDifficulty = $(this).val();
            $("#logParagraph2").text("Selected difficulty:" + selectedDifficulty);
            console.log("Selected difficulty:" + selectedDifficulty);
        }); 

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

    getSelectedSudoku() {
        const selectedSudoku = $("#mainMenu select").val();
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