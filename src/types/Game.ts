import { Collection, Guild, Client, EmbedBuilder } from "discord.js";
import { Player } from "./Player.js";
import { LgonRole } from "./LgonRole.js";

export class Game
{
	name: string;
	guildId: string;
	guildName: string;
	time: string;
	date: string;
	id: number;
	isDefaultGame: boolean = false;
	
	static games_nbr: number = 0;
	
	status: "pending" | "night" | "vote" | "ended";
	players: Collection<string, Player>; 				// userId -> InGame
	roles: LgonRole[];
	waitingRoom: Collection<string, Player>; // userId -> InGame

	constructor(guild: Guild, name: string)
	{
		// TODO GERER LES OVERFLOW D'ids
		const date = new Date();
		this.time = new Intl.DateTimeFormat('fr', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).format(date);
		this.date = new Intl.DateTimeFormat('fr', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).format(new Date());
		console.log(this.time, this.date);

		this.guildId = guild.id;
		this.guildName = guild.name;
		Game.games_nbr ++;
		this.id = Game.games_nbr;
		this.name = name;
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
	
	addPlayer(player: Player, embed: EmbedBuilder): void
	{	
		console.log("add player", player.name, this.name);
		this.players.set(player.name, player);
		embed.addFields({ name: '**Join**', value: `${player.name} has joined **${this.name}**`, inline: false });
	}

	addWaitingPlayer(player: Player, embed: EmbedBuilder): void
	{
		this.waitingRoom.set(player.id, player);
		embed.addFields({ name: '**Join**', value: `${player.name} has joined **${this.name}**'s waiting room`, inline: false });
	}

	removePlayer(bot: Client, player: Player, embed: EmbedBuilder): void
	{
		this.players.delete(player.name);
		embed.addFields({ name: '**Leave**', value: `${player.name} has left **${this.name}**`, inline: false });
		if ( this.players.size === 0 )
		{
			let games: Collection<string, Game> = bot.games.get(this.guildId)!;
			games.delete(this.name);
			embed.addFields({ name: '**Delete**', value: `Game **${this.name}** has no player left, it has been destroyed`, inline: false });
			if (games.size === 1)
			{
				const game = games.first()!;
				game.setDefaultGame(true);
				embed.addFields({ name: '**Default**', value: `Game **${game.name}** has been set to default`, inline: false });
			}
		}
	}

	removeWaitingPlayer(player: Player, embed: EmbedBuilder): void
	{
		this.waitingRoom.delete(player.name);
		embed.addFields({ name: '**Leave**', value: `${player.name} has left **${this.name}**'s waiting room`, inline: false });
	}
}

export function getGame(bot: Client, guild: Guild, gameName: string | null, newGameName: string | null = null, createGame: boolean = false): Game | null
{
	let game: Game | undefined;
	if ( gameName )
		game = bot.games.get(guild!.id)!.get(gameName);
	else
		game = bot.games.get(guild!.id)!.find(g => g.isDefaultGame);
	if ( !game && createGame )
	{
		if ( gameName )
			game = new Game(guild, gameName!);
		else if ( newGameName )
			game = new Game(guild, newGameName!);
		else
			return (null);
		bot.games.get(guild!.id)!.set(game!.name, game!);
	}
	return (game || null);
}
