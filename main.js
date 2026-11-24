import { SudokuBoard } from './modules/sudoku_board.js';
import { SudokuButtons } from './modules/sudoku_buttons.js';
import { SudokuController } from './modules/sudoku_controller.js';
import { MainMenu } from './modules/main_menu.js';

import { SudokuMap } from './modules/sudoku_map.js';

$(document).ready(function(){

    const sudokuBoard = new SudokuBoard(400);
    const sudokuButtons = new SudokuButtons();
    const sudokuController = new SudokuController(sudokuBoard, sudokuButtons);
    const mainMenu = new MainMenu(400);

    const sudokuString =  "863100207020070800507802090008200079706000528290780300080627401672010980000008762";
    sudokuController.loadGame(sudokuString);


    $("body").append(mainMenu.menu);
    // Board and buttons share a container that styles.css lays out side by
    // side in landscape and stacked in portrait
    const gameArea = $("<div class='game-area'></div>");
    gameArea.append(sudokuBoard.board, sudokuButtons.buttons);
    $("body").append(gameArea);

    displayMenu(); // Show the main menu initially

    sudokuController.menuCallback = displayMenu;

    mainMenu.buttonClickCallback = (buttonId) => {
        console.log("Button clicked (main.js) " + buttonId);
        $("#logParagraph2").text("Button clicked (main.js) " + buttonId);
        if (buttonId === "start")
        {
            $("#logParagraph2").text("Button clicked (main.js) " + buttonId);
            displayGame();
        }
        if (buttonId === "load")
        {
            $("#logParagraph2").text("Button clicked (main.js) " + buttonId);
            sudokuController.loadGame(mainMenu.getSelectedSudoku())
        }
    }

    function displayMenu() {
        mainMenu.menu[0].style.display = "grid";
        gameArea[0].style.display = "none";
    }

    function displayGame() {
        mainMenu.menu[0].style.display = "none";
        gameArea[0].style.display = "";
        fitGameToWindow();
    }

    // Sizes the board (and in portrait the buttons panel) so the whole game
    // fits the window without scrolling. Layout direction comes from the
    // orientation media query in styles.css.
    const MARGIN = 20;           // board and panel margin
    const PANEL_WIDTH = 400;     // buttons panel width in landscape
    const MIN_BOARD = 200;
    const MAX_BOARD = 700;

    function fitGameToWindow() {
        const area = gameArea[0];
        if (area.style.display === "none")
            return;

        // clientWidth/Height exclude scrollbars; the 8px is body's bottom/right margin
        const viewW = document.documentElement.clientWidth - 8;
        const viewH = document.documentElement.clientHeight - 8;
        const top = area.getBoundingClientRect().top + window.scrollY;
        const panel = sudokuButtons.buttons;
        let size;

        if (window.matchMedia("(orientation: landscape)").matches) {
            panel.css("width", PANEL_WIDTH);
            const availW = viewW - area.offsetLeft - 2 * MARGIN - PANEL_WIDTH - MARGIN;
            const availH = viewH - top - 2 * MARGIN;
            size = Math.min(availW, availH);
        }
        else {
            const availW = viewW - area.offsetLeft - 2 * MARGIN;
            // The panel's height depends on its width, so measure it at the
            // widest it can be, then fit the board into what is left
            panel.css("width", Math.min(availW, MAX_BOARD));
            const panelH = panel.outerHeight() + MARGIN;
            const availH = viewH - top - 2 * MARGIN - panelH;
            size = Math.min(availW, availH);
        }

        size = Math.floor(Math.max(MIN_BOARD, Math.min(MAX_BOARD, size)));
        sudokuBoard.resize(size);
        if (!window.matchMedia("(orientation: landscape)").matches)
            panel.css("width", size);
        sudokuController.updateBoard();
    }

    $(window).on("resize", fitGameToWindow);


    window.displayGame = displayGame;
    window.displayMenu = displayMenu;
    window.sudokuBoard = sudokuBoard;
    window.SB = SudokuBoard;
    window.SM = SudokuMap;
    window.sudokuButtons = sudokuButtons;
    window.sudokuController = sudokuController;
    window.mainMenu = mainMenu;
    
    // const sudokuBoard2 = new SudokuBoard(401);
    // const sudokuButtons2 = new SudokuButtons();
    // const sudokuController2 = new SudokuController(sudokuBoard2, sudokuButtons2);
    // $("body").append(sudokuBoard2.board);
    // $("body").append(sudokuButtons2.buttons);

    // $("body").append("<button id='btnTest'>Create Sudoku</button>");
    // $("#btnTest").click(function(){
    //     $("body").append(sudokuBoard.board);
    // });
});