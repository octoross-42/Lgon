import { InGame } from "./InGame.js";
import { Game } from "./Game.js";

export class Player
{
	id: string;
	name: string;
	inGame: InGame | null;
	historic: Game[]

	constructor(name: string, id: string)
	{
		this.historic = [];
		this.id = id;
		this.name = name;
		this.inGame = null;
	}

	joinGame(game: Game): void
	{
		// this.player = new InGame(game, );
		// game.addPlayer(this);
		// this.historic.push(game);
	}
}