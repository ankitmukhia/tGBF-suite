import { games, clients } from "../index"

type GameType = typeof games;
type ClientType = typeof clients;

function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// theexportn to call it, plus stitch in '4' in the third group
export const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substring(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

export function updateGameState(games: GameType, clients: ClientType) {
	for (const g of Object.keys(games)) {
		const game = games[g];
		const payload = {
			method: "update",
			game
		}

		game.clients.forEach(c => {
			clients[c.clientId].connection.send(JSON.stringify(payload))
		})
	}

	setTimeout(() => updateGameState(games, clients), 500)
}
