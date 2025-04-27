import { Client, User, Guild, EmbedBuilder, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder, APIEmbedField } from "discord.js";
import { InGame } from "./InGame.js";
import { Game, getGame } from "./Game.js";

export function getPlayer(bot: Client, user: User, createPLayer: boolean = true): Player | null
{
	let player = bot.players.get(user.username);
	if ( !player )
	{
		if (createPLayer)
		{
			player = new Player(user.username, user.id);
			bot.players.set(player.name, player);
		}
		else
			return (null);
	}
	return ( player );
}

function askToChangeGame(bot: Client, guild: Guild, gameToJoinName: string | null, embed: EmbedBuilder, components: ActionRowBuilder<ButtonBuilder>[]): void //bot: Client, message: Message, gameToJoin: Game | null, argv: string[], embed: EmbedBuilder, messageContent: string): Promise<void>
{
	console.log("askToChangeGame");
	
	embed.addFields({ name: '**?**', value: "Do you want to change game ?", inline: false });
	if (gameToJoinName === null)
		gameToJoinName = bot.games.get(guild!.id)!.find(game => game.isDefaultGame)?.name!;
	const button = new ButtonBuilder()
		.setCustomId('change_game ' + gameToJoinName)
		.setLabel(`Join ${gameToJoinName}`)
		.setStyle(ButtonStyle.Secondary);

	const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(button);

	components.push(row);
}


export class Player
{
	id: string;
	name: string;
	inGame: InGame | null;
	waitingRoom: Game | null;
	historic: Game[]
	askConfirmation: boolean;
	tellError: boolean;

	constructor(name: string, id: string)
	{
		this.historic = [];
		this.id = id;
		this.name = name;
		this.inGame = null;
		this.waitingRoom = null;
		this.askConfirmation = true;
		this.tellError = true;
	}

	getGame(): Game | null
	{
		if (this.inGame !== null)
			return (this.inGame.game);
		if (this.waitingRoom !== null)
			return (this.waitingRoom);
		return (null);
	}


	joinGame(bot: Client, guild: Guild, gameToJoinName: string | null, askToChange: boolean, embed: EmbedBuilder, components: ActionRowBuilder<ButtonBuilder>[]): void
	{
		let gameToJoin: Game | null = getGame(bot, guild, gameToJoinName);
		let playerGame: Game | null = this.getGame();

		if ( playerGame !== null )
		{
			if ( playerGame === gameToJoin )
			{
				if (this.tellError)
				{
					if (this.inGame !== null)
						embed.addFields({ name: '**Error**', value: `You are already in this game`, inline: false });
					else if (this.waitingRoom !== null)
						embed.addFields({ name: '**Error**', value: `You are already in the waiting room of this game`, inline: false });
				}
				return ;
			}

			if (this.askConfirmation && askToChange)
				return askToChangeGame(bot, guild, gameToJoinName, embed, components);

			if ( !this.leaveGame(bot, embed) )
				return ;
		}
		
		if ( !gameToJoin )
		{
			let games: Collection<string, Game> = bot.games.get(guild.id)!;
			if ( !gameToJoinName )
				gameToJoinName = this.name;
			gameToJoin = new Game(guild, gameToJoinName!);
			embed.addFields({ name: '**Game**', value: `The game **${gameToJoin.name}** has been created`, inline: false });
			
			if ( games.size === 0 )
			{
				gameToJoin.setDefaultGame(true);		
				embed.addFields({ name: '**Default**', value: `The game **${gameToJoin.name}** has been set as default`, inline: false });
			}
			gameToJoin.addPlayer(this, embed);
			games.set(gameToJoin!.name, gameToJoin!);
		}
		else if ( gameToJoin.status !== "pending" )
			gameToJoin.addWaitingPlayer(this, embed);
			
		else
			gameToJoin.addPlayer(this, embed);

		this.inGame = new InGame(gameToJoin!);
	}


	leaveGame(bot: Client, embed: EmbedBuilder): boolean
	{
		if ( (this.waitingRoom === null) && (this.inGame === null) )
		{
			if ( this.tellError )
				embed.addFields({ name: '**Error**', value: `You are not in any game`, inline: false });
			return (true);
		}

		if ( this.inGame?.game.status !== "pending" )
		{
			embed.addFields({ name: '**No**', value: `You can't leave a game that has already started`, inline: false });
			return (false);
		}

		if ( this.inGame !== null )
		{
			this.inGame!.game.removePlayer(bot, this, embed);	
			this.inGame = null;
		}
		else
		{
			this.waitingRoom!.removeWaitingPlayer(this, embed);
			this.waitingRoom = null;
		}
		return (true);
	}

	

}