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
    $("body").append(sudokuBoard.board);
    $("body").append(sudokuButtons.buttons);

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
    }

    function displayMenu() {
        mainMenu.menu[0].style.display = "grid";
        sudokuBoard.board[0].style.display = "none";
        sudokuButtons.buttons[0].style.display = "none";
    }

    function displayGame() {
        mainMenu.menu[0].style.display = "none";
        sudokuBoard.board[0].style.display = "";
        sudokuButtons.buttons[0].style.display = "grid";
    }


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