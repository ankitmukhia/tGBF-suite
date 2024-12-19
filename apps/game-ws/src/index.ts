import WebSocket, { WebSocketServer } from 'ws';
import express from 'express'
import { guid, updateGameState } from './lib/utils'
const app = express()
const PORT = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

const wss = new WebSocketServer({ port: 8080 });
/**
 * { 
 *   'guid1': { connection : ws }, 
 *   'guid2': { connection : ws }, 
 * }
 **/
export const clients: { [key: string]: { connection: WebSocket } } = {};
/**
 * { 
 *   'guid1(gameId)': { id: guid1(gameId), balls: 20 }, 
 *   'guid2(gameId)': { id: guid2(gameId), balls: 20 }, 
 * }
 **/
export const games: { [key: string]: { id: string, balls: number, clients: Array<{ clientId: string, color: string | undefined }>, state?: { [key: string]: string } } } = {};

wss.on('connection', function connection(ws) {
	ws.on('error', console.error);

	const clientId = guid()
	clients[clientId] = {
		connection: ws
	}

	const payload = {
		method: "connect",
		clientId: clientId
	}

	ws.send(JSON.stringify(payload));

	ws.on('message', function message(data) {
		const req = JSON.parse(data.toString())
		const clientId = req.clientId;
		if (req.method === "create") {
			const gameId = guid();
			games[gameId] = {
				id: gameId,
				balls: 20,
				clients: []
			}
			/**
			 * {
			 *	method: 'create',
			 *	game:  {
			 *		id: gameId,
			 *		balls: 20
			 *	}
			 * }
			 **/
			const payload = {
				method: 'create',
				game: games[gameId]
			}
			/**
			 * Only broadcast to client creating game
			 **/
			const con = clients[clientId].connection;
			con.send(JSON.stringify(payload))
		}

		if (req.method === "join") {
			const { clientId, gameId } = req;
			/**
			 * 'gameId(given gameId)': { id: 'gameId', balls: 20 }
			 **/
			const game = games[gameId];
			if (game.clients.length >= 3) {
				return;
			}
			/**
			 * Based on player indexing it will assign colors
			 * { clientId: 1, color: "Red" }
			 **/
			const color = { 0: "Red", 1: "Blue", 2: "Green" }[game.clients.length]
			game.clients.push({
				clientId,
				color
			})
			console.log("Game clients: ", game.clients)
			// games is there, but when passed to updateGameState, it gves error of Undefined

			if (game.clients.length === 3) updateGameState(games, clients);

			const payload = {
				method: "join",
				game
			}

			game.clients.forEach(client => {
				clients[client.clientId].connection.send(JSON.stringify(payload))
			})
		}
		if (req.method === "play") {
			const { clientId, gameId, ballId, color } = req;
			console.log({ clientId, gameId, ballId, color })
			// pointing to the current game state
			let state = games[gameId].state

			if (!state) {
				state = {}
			}
			/**
			* initilize state with ballid as an key and color as a value 
			* @example { "ballId": "color" }
			**/
			state[ballId] = color;
			games[gameId].state = state
		}
	});
});

app.listen(PORT, () => {
	console.log(`PORT is listening at http://localhost:${PORT}`)
})
