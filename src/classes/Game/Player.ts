import { Client, User, Guild, EmbedBuilder, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder, Message, PartialMessage } from "discord.js";
import { Game, getGame } from "./Game.js";
import { LgonEmbed } from "../Embed/LgonEmbed.js";
import { LgonRole } from "../LgonRole/LgonRole.js";
import { CONSTANTES } from "../../config/constantes.js";

// TODO afficher joueurs par nickname et premier arrive premier servi + faire commande pour refresh nickname / changer nickname

export function getPlayer(bot: Client, user: User, createPLayer: boolean = true): Player | null
{
	let player = bot.players.get(user.username);
	if ( !player )
	{
		if (createPLayer)
		{
			// TODO: ajouter ajout message si c'est message final et parametre joueur (exemple join -> truc join truc direct et pas partie created etc)
			// console.log(user);
			player = new Player(user);
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
	name: string;
	game: Game | null;
	role: LgonRole | null;
	waitingRoom: Game | null;
	// historic: Game[]; // TODO creer class game record
	askConfirmation: boolean;
	tellError: boolean;
	user: User;
	ready: boolean;

	constructor(user: User)
	{
		// this.historic = [];
		this.role = null;
		this.ready = false;
		this.name = user.username;
		this.game = null;
		this.waitingRoom = null;
		this.askConfirmation = true;
		this.tellError = true;
		this.user = user;
	}

	getGame(): Game | null
	{
		if (this.game !== null)
			return (this.game);
		if (this.waitingRoom !== null)
			return (this.waitingRoom);
		return (null);
	}

	setReady(message: Message | PartialMessage, ready: boolean): void
	{
		if (this.game !== null)
		{
			if (!this.ready && ready)
				this.game.addReady(message);
			else if (this.ready && !ready)
				this.game.rmReady(message);
			this.ready = ready;
		}
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
					if (this.game !== null)
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
		else if ( gameToJoin.status !== "setup" )
			gameToJoin.addWaitingPlayer(this, embed);
			
		else
			gameToJoin.addPlayer(this, embed);

		this.game = gameToJoin!;
	}


	leaveGame(bot: Client, embed: EmbedBuilder): boolean
	{
		if ( (this.waitingRoom === null) && (this.game === null) )
		{
			if ( this.tellError )
				embed.addFields({ name: '**Error**', value: `Yo're not in any game`, inline: false });
			return (true);
		}

		if ( this.game?.status !== "setup" )
		{
			embed.addFields({ name: '**No**', value: `You can't leave a game that has already started`, inline: false });
			return (false);
		}

		if ( this.game !== null )
		{
			this.game!.removePlayer(bot, this, embed);	
			this.game = null;
		}
		else
		{
			this.waitingRoom!.removeWaitingPlayer(this, embed);
			this.waitingRoom = null;
		}
		return (true);
	}

	async sendRole(role: LgonRole)
	{
		this.role = role;
		let dm = await this.user.createDM(true);
		let embed: EmbedBuilder = LgonEmbed.newEmbed()
			.setTitle(this.name)
			.setDescription(`Your role is **${role.printName}**`);

		await dm.send({ embeds: [embed], flags: CONSTANTES.FLAGS});
	}

}