import { Game } from "./Game.js";
import { Role } from "./Role.js";

export class InGame
{
	game: Game;
	role: Role | null;

	constructor(game: Game, role: Role | null = null)
	{
		this.game = game;
		this.role = role;
	}
}