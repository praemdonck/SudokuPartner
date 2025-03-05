import { SudokuBoard } from './modules/sudoku_board.js';
import { SudokuButtons } from './modules/sudoku_buttons.js';
import { SudokuController } from './modules/sudoku_controller.js';

import { SudokuMap } from './modules/sudoku_map.js';

$(document).ready(function(){

    const sudokuBoard = new SudokuBoard(400);
    const sudokuButtons = new SudokuButtons();
    const sudokuController = new SudokuController(sudokuBoard, sudokuButtons);

    


    const sudokuString =  "863100207020070800507802090008200079706000528290780300080627401672010980000008762";
    sudokuController.loadGame(sudokuString);
    $("body").append(sudokuBoard.board);
    $("body").append(sudokuButtons.buttons);



    window.sudokuBoard = sudokuBoard;
    window.SB = SudokuBoard;
    window.SM = SudokuMap;
    window.sudokuButtons = sudokuButtons;
    window.sudokuController = sudokuController;
    
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