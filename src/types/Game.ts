import { Collection, Guild } from "discord.js";
import { Player } from "./Player.js";
import { Role } from "./Role.js";

export class Game
{
	name: string;
	id: number;
	guildId: string;
	guildName: string;
	static games_nbr: number = 0;
	status: "pending" | "night" | "vote" | "ended";
	players: Collection<string, Player>; 				// userId -> InGame
	roles: Role[];
	isDefaultGame: boolean = false;
	waitingRoom: Collection<string, Player>; // userId -> InGame

	constructor(guild: Guild, name: string | null = null)
	{
		// TODO GERER LES OVERFLOW D'ids
		this.guildId = guild.id;
		this.guildName = guild.name;
		Game.games_nbr ++;
		this.id = Game.games_nbr;
		if (name)
			this.name = name;
		else
			this.name = "Game " + this.id;
		this.status = "pending";
		this.players = new Collection<string, Player>();
		this.waitingRoom = new Collection<string, Player>();
		this.roles = [];
		this.isDefaultGame = false;
	}

	setDefaultGame(isDefault: boolean): void
	{
		this.isDefaultGame = isDefault;
	}
	
	addPlayer(player: Player): void
	{
		this.players.set(player.id, player);
		player.joinGame(this);
	}

	addWaitingPlayer(player: Player): void
	{
		this.waitingRoom.set(player.id, player);
		player.joinWaitingRoom(this);
	}

	removePlayer(player: Player): void
	{
		this.players.delete(player.name);
	}
	removeWaitingPlayer(player: Player): void
	{
		this.waitingRoom.delete(player.name);
	}
}