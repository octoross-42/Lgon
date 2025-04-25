import { Game } from "./Game.js";
import { LgonRole } from "./LgonRole.js";

export class InGame
{
	game: Game;
	role: LgonRole | null;

	constructor(game: Game, role: LgonRole | null = null)
	{
		this.game = game;
		this.role = role;
	}
}