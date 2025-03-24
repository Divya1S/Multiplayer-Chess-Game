// import { WebSocket } from "ws";
// import { INIT_GAME, MOVE } from "./messages";
// import { Game } from "./Game";

// //User, Game

// export class GameManager {
//     private games: Game[];
//     private pendingUser: WebSocket | null;
//     private users: WebSocket[];

//     constructor() {
//         this.games = [];
//         this.pendingUser = null;
//         this.users = [];
//     }

//     addUser(socket: WebSocket) {
//         this.users.push(socket);
//         this.addHandler(socket)

//     }

//     removeUser(socket: WebSocket) {
//         this.users = this.users.filter(user => user !== socket);
//         //Stop the game here because the user left

//     }

//     private addHandler(socket: WebSocket) {
//         socket.on("message", (data) => {
//             const message = JSON.parse(data.toString());

//             if(message.type === INIT_GAME) {
//                 if (this.pendingUser) {
//                     //start a game
//                     const game = new Game(this.pendingUser, socket);
//                     this.games.push(game);
//                     this.pendingUser = null;
//                 }else {
//                     this.pendingUser = socket;
//                 }    
//             }

//             if (message.type === MOVE) {
//                 console.log("inside move")
//                 const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
//                 if(game) {
//                     console.log("inside make move")
//                     game.makeMove(socket, message.move);
//                 }
//             }

//         })
//     }
// }

import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

// User, Game

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);

        // Remove user from pending if they were waiting for a game
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }

        // Find and remove any game they are part of
        const gameIndex = this.games.findIndex(game => game.player1 === socket || game.player2 === socket);
        if (gameIndex !== -1) {
            const game = this.games[gameIndex];
            const opponent = game.player1 === socket ? game.player2 : game.player1;

            // Inform the opponent that the game has ended
            if (opponent && opponent.readyState === WebSocket.OPEN) {
                opponent.send(JSON.stringify({ type: "GAME_OVER", reason: "Opponent disconnected" }));
            }

            this.games.splice(gameIndex, 1); // Remove the game from active games
        }
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());

                if (message.type === INIT_GAME) {
                    if (this.pendingUser) {
                        // Start a new game
                        const game = new Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.pendingUser = null;
                    } else {
                        this.pendingUser = socket;
                    }
                }

                if (message.type === MOVE) {
                    console.log("inside move");
                    const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        console.log("inside make move");
                        game.makeMove(socket, message.payload.move);
                    } else {
                        socket.send(JSON.stringify({ type: "ERROR", message: "No active game found" }));
                    }
                }
            } catch (error) {
                console.error("Error processing message:", error);
                socket.send(JSON.stringify({ type: "ERROR", message: "Invalid message format" }));
            }
        });

        socket.on("close", () => {
            this.removeUser(socket);
        });

        socket.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
    }
}
