import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board= new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));        
    }

    makeMove(socket: WebSocket, move:  {
        from: string;
        to: string;
    }) {
        console.log(move);
        //validate the type of move using zod
        if (this.moveCount % 2 == 0 && socket !== this.player1) {
            return
        }
        if (this.moveCount % 2 == 0 && socket !== this.player2) {
            return;
        }
        console.log("did not early return");

        try {
            this.board.move(move);
        }catch(e) {
            console.log(e);
            return;
        }
        console.log("move succeeded");
        //validate here
        //is it this users move
        //is the move valid

        //Update the board
        //Push the move

        //Check if the game is over
        if (this.board.isGameOver()) {
            //Send the game over message to both players
            this.player1.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white"
                    }
                }))
            this.player2.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white"
                    }
                }))
                return;
            }

            if (this.moveCount % 2 === 0) {
                this.player2.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }))
            } else {
                this.player1.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }))
            }  
            this.moveCount++;
    }

        //Send the updated board to both players
}

// import { WebSocket } from "ws";
// import { Chess } from "chess.js";
// import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

// export class Game {
//     public player1: WebSocket;
//     public player2: WebSocket;
//     public board: Chess;
//     private startTime: Date;
//     private moveCount = 0;

//     constructor(player1: WebSocket, player2: WebSocket) {
//         this.player1 = player1;
//         this.player2 = player2;
//         this.board = new Chess();
//         this.startTime = new Date();

//         this.player1.send(
//             JSON.stringify({
//                 type: INIT_GAME,
//                 payload: {
//                     color: "white",
//                 },
//             })
//         );
//         this.player2.send(
//             JSON.stringify({
//                 type: INIT_GAME,
//                 payload: {
//                     color: "black",
//                 },
//             })
//         );
//     }

//     makeMove(socket: WebSocket, move: { from: string; to: string }) {
//         // Validate if it's the correct player's turn
//         if (this.board.turn() === "w" && socket !== this.player1) {
//             console.log("Not white's turn.");
//             return;
//         }
//         if (this.board.turn() === "b" && socket !== this.player2) {
//             console.log("Not black's turn.");
//             return;
//         }

//         console.log("Valid turn, proceeding with move.");

//         // Validate the move before making it
//         const validMoves = this.board.moves({ verbose: true }).map(m => m.from + m.to);
//         if (!validMoves.includes(move.from + move.to)) {
//             console.log("Invalid move:", move);
//             return;
//         }

//         try {
//             this.board.move(move);
//         } catch (e) {
//             console.log("Move failed:", e);
//             return;
//         }

//         console.log("Move succeeded:", move);

//         // Check if the game is over
//         if (this.board.isGameOver()) {
//             const winner = this.board.turn() === "w" ? "black" : "white"; // The opponent is the winner
//             this.player1.send(
//                 JSON.stringify({
//                     type: GAME_OVER,
//                     payload: { winner },
//                 })
//             );
//             this.player2.send(
//                 JSON.stringify({
//                     type: GAME_OVER,
//                     payload: { winner },
//                 })
//             );
//             return;
//         }

//         // Send move to the opponent
//         const opponent = socket === this.player1 ? this.player2 : this.player1;
//         opponent.send(
//             JSON.stringify({
//                 type: MOVE,
//                 payload: move,
//             })
//         );

//         this.moveCount++;
//     }
// }
