import { Client, User, Message, MessageReaction, PartialMessage, TextChannel, DMChannel } from "discord.js";
import { Game } from "../Game/Game.js";
import { Player } from "../Game/Player.js";
import { CONSTANTES } from "../../config/constantes.js";
import { AwaitingInteraction, newEmbed } from "./AwaitingInteraction.js";

export class StartEmbed extends AwaitingInteraction
{
	game: Game | null;

	constructor(player: Player | null)
	{
		super();

		if ( !player || (player!.game === null) )
		{
			this.game = null;
			this.embed.setTitle("Start game");
			this.embed.addFields( { name: "**Error**", value: "You need to be activly in a game to start a game", inline: false });
		}
		else if ( player.waitingRoom )
		{
			this.game = null;
			this.embed.setTitle("Start game");
			this.embed.addFields( { name: "**Error**", value: "You can't start a game in a waiting room", inline: false });
		}
		else
		{
			this.game = player.game!;
			this.embed.setTitle(`**Start ${this.game!.name}**`);
			
			this.game!.showRoles(this.embed)
			this.game!.showPlayers(this.embed, true);

			let rolesCount: number = 0;
			this.game!.roles.forEach((role) => { rolesCount += role; });
			let error : string = "";
			if (this.game!.players.size < CONSTANTES.MIN_NBR_PLAYERS)
				error += "Not enough players to start the game";
			if (this.game!.players.size !== rolesCount - 3)
				error += `Not enough roles for the players ${rolesCount}/${this.game!.players.size + 3}\nThere needs to be 3 more roles than players to play`;
	
			if (this.game!.status !== "setup")
				error += "The game has already started";

			if (error.length > 0)
			{				
				this.embed.addFields({ name: '', value: '\u200B'});
				this.embed.addFields({ name: '**Error**', value: error, inline: false });
			}
			else
				this.register = true;
		}
	}

	public async reply(bot: Client, message: Message): Promise<void>
	{
		await message.reply(
		{
			embeds: [this.embed],
			flags: CONSTANTES.FLAGS,
		}).then(msg =>
			{
				if (this.register)
				{
					this.id = msg.id;
					bot.awaitingInteractions.set(msg.id, this);
					msg.react("✅");
					msg.react("❌");
					console.log("startConfirmation", message.id);
				}
			}
		);
	}

	public async send(bot: Client, channel: TextChannel | DMChannel): Promise<void>
	{
		// TODO : check all channel type: CategoryChannel
										// DMChannel
										// PartialDMChannel
										// PartialGroupDMChannel
										// NewsChannel
										// StageChannel
										// TextChannel
										// AnyThreadChannel
										// VoiceChannel
										// ForumChannel
										// MediaChannel

										// guild Channel :
										// TextChannel - VoiceChannel - CategoryChannel - NewsChannel - StageChannel - ForumChannel - MediaChannel
		await channel.send(
		{
			embeds: [this.embed],
			flags: CONSTANTES.FLAGS,
		}).then(msg =>
			{
				if (this.register)
				{
					this.id = msg.id;
					bot.awaitingInteractions.set(msg.id, this);
					msg.react("✅");
					msg.react("❌");
				}
			}
		);
	}

	public update(message: Message | PartialMessage, user: User, yes: boolean): void
	{
		this.embed = newEmbed();
		if (this.game)
		{
			this.game.players.get(user.username)?.setReady(message, yes);
			this.embed.setTitle(`**Start ${this.game!.name}**`);
			this.game!.showRoles(this.embed);
			this.game!.showPlayers(this.embed, true);
		}
		else
		{
			this.embed.setTitle(`**Start**`);
			this.embed.addFields({ name: "No Game", value: "This game is not available anymore"});
		}
	}

	async updateGame(bot: Client, message: Message | PartialMessage)
	{
		if (!this.game || (this.game.status !== "setup"))
			return ;
		if ((this.game!.ready === this.game!.players.size) && (this.game!.players.size + 3 === this.game!.rolesCount) && (this.game!.players.size >= CONSTANTES.MIN_NBR_PLAYERS))
			await this.game!.start(bot, message);
	}

	public async react(bot: Client, reaction: MessageReaction, user: User): Promise<void>
	{
		if ((reaction.emoji.name !== "✅") && (reaction.emoji.name !== "❌"))
				return ;
		this.update(reaction.message, user, reaction.emoji.name === "✅");
		// TODO faire en sorte que pas ready in game en cours fasse pause
		
		await reaction.message.edit({ embeds: [this.embed] });

		await this.updateGame(bot, reaction.message);
	}
}