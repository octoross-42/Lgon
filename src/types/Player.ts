import { InGame } from "./InGame.js";
import { Game } from "./Game.js";

export class Player
{
	id: string;
	name: string;
	inGame: InGame | null;
	waitingRoom: Game | null;
	historic: Game[]

	constructor(name: string, id: string)
	{
		this.historic = [];
		this.id = id;
		this.name = name;
		this.inGame = null;
		this.waitingRoom = null;
	}

	joinGame(game: Game): void
	{
		this.inGame = new InGame(game);
	}
	joinWaitingRoom(game: Game): void
	{
		this.waitingRoom = game;
	}
}