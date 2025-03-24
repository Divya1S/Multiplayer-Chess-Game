"use strict";
// import { WebSocket } from "ws";
// import { Chess } from 'chess.js'
// import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        // Validate if it's the correct player's turn
        if (this.board.turn() === "w" && socket !== this.player1) {
            console.log("Not white's turn.");
            return;
        }
        if (this.board.turn() === "b" && socket !== this.player2) {
            console.log("Not black's turn.");
            return;
        }
        console.log("Valid turn, proceeding with move.");
        // Validate the move before making it
        const validMoves = this.board.moves({ verbose: true }).map(m => m.from + m.to);
        if (!validMoves.includes(move.from + move.to)) {
            console.log("Invalid move:", move);
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log("Move failed:", e);
            return;
        }
        console.log("Move succeeded:", move);
        // Check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white"; // The opponent is the winner
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: { winner },
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: { winner },
            }));
            return;
        }
        // Send move to the opponent
        const opponent = socket === this.player1 ? this.player2 : this.player1;
        opponent.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        }));
        this.moveCount++;
    }
}
exports.Game = Game;
