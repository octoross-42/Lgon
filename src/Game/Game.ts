import { Collection, type Guild, type Client, type EmbedBuilder, type Message, type PartialMessage } from "discord.js";
import type { Player } from "../Player/Player.js";
import type { LgonRoleGenerator } from "../roles/LgonRoleGenerator.js";
import { getRoleName } from "../roles/helpers.js"
import { CONSTANTES } from "../config/constantes.js";
import type { LgonRole } from "../roles/LgonRole.js";
import { newEmbed } from "../Embed/AwaitingInteraction.js"
import { GameMeta } from "./GameMeta.js";

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
		bot.games.get(guild!.id)!.set(game!.meta.name, game!);
	}
	return (game || null);
}

export class Game
{
	meta: GameMeta;
	
	isDefaultGame: boolean = false;
	
	static games_nbr: number = 0;
	
	phase: "setup" | "night" | "day" | "voting" | "ended";
	
	players: Collection<string, Player>; 				// userId -> Player
	waitingRoom: Collection<string, Player>; // userId -> Player
	ready: number;
	
	rolesCount: number;
	roles: Collection<string, number>;
	playersRoles: LgonRole[] | null;
	center: Collection<string, LgonRole> | null;
	

	msg : Message | PartialMessage | null;
	
	nightTurn: number;
	remainingTimeout: number;
	pause: boolean;
	timeoutId: NodeJS.Timeout | null;

	constructor(guild: Guild, name: string)
	{
		// TODO GERER LES OVERFLOW D'ids
		this.meta = new GameMeta(Game.games_nbr, guild, name);

		this.timeoutId = null;
		this.playersRoles = null;
		
		Game.games_nbr ++;
		this.phase = "setup";
		this.players = new Collection<string, Player>();
		this.waitingRoom = new Collection<string, Player>();
		this.roles = new Collection<string, number>();
		this.isDefaultGame = false;
		this.pause = false;
		this.remainingTimeout = -1;
		this.ready = 0;
		this.rolesCount = 0;
		this.center = null;
		this.msg = null;
		this.nightTurn = 0;
	}

	addReady(message: Message | PartialMessage): void
	{
		this.ready ++;
	}

	rmReady(message: Message | PartialMessage): void
	{
		this.ready --;
	}

	setDefaultGame(isDefault: boolean): void
	{
		this.isDefaultGame = isDefault;
	}
	
	addPlayer(player: Player, embed: EmbedBuilder): void
	{
		this.players.set(player.name, player);
		embed.addFields({ name: '**Join**', value: `${player.name} has joined **${this.meta.name}**`, inline: false });
	}

	addWaitingPlayer(player: Player, embed: EmbedBuilder): void
	{
		this.waitingRoom.set(player.name, player);
		embed.addFields({ name: '**Join**', value: `${player.name} has joined **${this.meta.name}**'s waiting room`, inline: false });
	}

	removePlayer(bot: Client, player: Player, embed: EmbedBuilder): void
	{
		this.players.delete(player.name);
		embed.addFields({ name: '**Leave**', value: `${player.name} has left **${this.meta.name}**`, inline: false });
		if ( this.players.size === 0 )
		{
			let games: Collection<string, Game> = bot.games.get(this.meta.guildId)!;
			games.delete(this.meta.name);
			embed.addFields({ name: '**Delete**', value: `Game **${this.meta.name}** has no player left, it has been destroyed`, inline: false });
			if (games.size === 1)
			{
				const game = games.first()!;
				game.setDefaultGame(true);
				embed.addFields({ name: '**Default**', value: `Game **${game.meta.name}** has been set to default`, inline: false });
			}
		}
	}

	removeWaitingPlayer(player: Player, embed: EmbedBuilder): void
	{
		this.waitingRoom.delete(player.name);
		embed.addFields({ name: '**Leave**', value: `${player.name} has left **${this.meta.name}**'s waiting room`, inline: false });
	}

	
	addRole(bot: Client, roleName: string, addNbr: number, embed: EmbedBuilder): void
	{
		let roleRealName: string | null = getRoleName(bot, roleName);
		if ( !roleRealName )
		{
			embed.addFields({ name: '**Error**', value: `Role **${roleName}** does not exist`, inline: false });
			return ;
		}

		if (this.roles.has(roleRealName))
		{
			let roleCount = this.roles.get(roleRealName)!;
			roleCount += addNbr;
		}
		else
			this.roles.set(roleRealName, addNbr);
		this.rolesCount += addNbr;
		
		embed.addFields({ name: `**Roles**`, value: `Added **${addNbr}** ${roleRealName}`, inline: false });
	}

	showPlayers(embed: EmbedBuilder, showReady: boolean = false): void
	{
		let playersString: string = "";
		this.players.forEach((player) =>
		{
			playersString += player.name;
			if (showReady)
			{
				if (player.ready)
					playersString += " ✅";
				else
					playersString += " ❌";
			}
			playersString += "\n";
		});
		if (playersString.length > 0)
			embed.addFields({ name: `**Players**`, value: playersString, inline: true });
		else
			embed.addFields({ name: `**Players**`, value: "No players", inline: true });
	}

	showRoles(embed: EmbedBuilder): void
	{
		let rolesString: string = "";
		for (const role of this.roles)
		{
			// console.log(role);
			if (role[1] > 1)
				rolesString += role[1] + " ";
			rolesString += role[0][0].toUpperCase() + role[0].substr(1) + "\n";
		}
		if (rolesString.length > 0)
			embed.addFields({ name: `**Roles**`, value: rolesString, inline: true });
		else
			embed.addFields({ name: `**Roles**`, value: "No roles", inline: true });
	}

	async distributeRoles(bot: Client): Promise<void>
	{
		this.playersRoles = [];
		let rolesOrder: string[] = CONSTANTES.ROLES_ORDER;

		let i: number = 0;
		let roleId: number = 0;
		let tmpPlayers: Player[] = Array.from(this.players.values());
		let tmpCenter: string[] = [ "left", "middle", "right"];
		this.center = new Collection<string, LgonRole>();
		while (i < rolesOrder.length)
		{
			const role: string = rolesOrder[i].toLowerCase();
			if (this.roles.has(role))
			{
				const roleCount: number = this.roles.get(role)!;
				const roleGen: LgonRoleGenerator = bot.roles.get(role)!;
				let j: number = 0;
				while (j < roleCount)
				{
					let lgonRole: LgonRole;
					if ( (Math.floor(Math.random() * (this.rolesCount)) < tmpCenter.length) || (tmpPlayers.length === 0))
					{
						const index: number = Math.floor(Math.random() * tmpCenter.length);
						lgonRole = roleGen.generateRole(tmpCenter[index], roleId);
						this.center.set(tmpCenter[index], lgonRole);
						tmpCenter.splice(index, 1);
					}
					else
					{
						const index: number = Math.floor(Math.random() * tmpPlayers.length);
						lgonRole = roleGen.generateRole(tmpPlayers[index], roleId);
						// let lgonNightyRole: LgonRole = roleGen.generateRole(tmpPlayers[index], roleId);
						await tmpPlayers[index].sendRole(lgonRole);
						tmpPlayers.splice(index, 1);
					}
					this.playersRoles.push(lgonRole);
					j ++;
					roleId ++;
				}
			}
			i ++;
		}
	}

	async sendPreshotActions(bot: Client)
	{
		for (let player of this.players.values())
		{
			console.log(player);
			if (player.role!.generator.action)
				await player.role!.preshot_action(bot);
		}
	}

	async start(bot: Client, message: Message | PartialMessage)
	{
		this.phase = "night";
		const linkImage = "https://i.imgur.com/m3SG4PB.png";
		let embed: EmbedBuilder = newEmbed();
		embed.setTitle(this.meta.name);
        embed.setThumbnail(linkImage);
		embed.addFields({name: "Game has started !", value: "Each player will receieve its role in DM"});
		await message.reply({embeds: [embed]}).then(msg => this.msg = msg);
		await this.distributeRoles(bot);
		await this.sendPreshotActions(bot);
		await this.spendNight(bot);
	}

	async showNight(bot: Client, update: boolean)
	{
		let roleString: string = "";
		let i: number = 0;
		while (i < this.playersRoles!.length)
		{
			roleString += `\t${this.playersRoles![i].generator.printName}`;
			if (this.playersRoles![i].generator.action)
				roleString += "  💪";
			if (this.playersRoles![i].generator.information)
				roleString += "  🧠";
			else
				roleString += "  💤";
			if (i === this.nightTurn)
				roleString += "  ◀"; //➤
			roleString += "\n";
			i ++;
		}
		if (i === this.nightTurn)
			roleString += '________';
		
		let embed: EmbedBuilder = newEmbed();
		embed.setTitle(`**Night** ${this.meta.name}`)
			.addFields({name: "", value: roleString});
		if (update)
			await this.msg!.edit({
			embeds: [embed]
		});
		else
		{
			await this.msg!.reply({
			embeds: [embed]
			}).then(msg => this.msg = msg);
		}
	}

	async nextNightTurn(bot: Client)
	{
		this.nightTurn ++;
		if (this.nightTurn === this.playersRoles!.length)
			await this.endNight(bot);
		else
			await this.spendNight(bot, true);
	}

	async spendNight(bot: Client, update: boolean = false)
	{
		await this.showNight(bot, update);
		if (!this.playersRoles![this.nightTurn].generator.action)
			await this.nextNightTurn(bot);
		else if (typeof(this.playersRoles![this.nightTurn].owner === "string"))
		{
			setTimeout(async (): Promise<void> => {
				await this.nextNightTurn(bot);
			}, Math.floor(Math.random() * CONSTANTES.TURN_TIME_MS / 3));
		}
		else
		{
			this.timeoutId = setTimeout(async (): Promise<void> => {
				await this.playersRoles![this.nightTurn].play_auto();
				await this.nextNightTurn(bot);
			}, CONSTANTES.TURN_TIME_MS);
		}
	}
	
	async endNight(bot: Client): Promise<void>
	{
		await this.showNight(bot, true);

		let embed = newEmbed()
			.setTitle(this.meta.name)
			.addFields({name: "Night has ended", value: "You can now proceed to vote when you're ready !"});
		
		await this.msg!.reply({
			embeds: [embed]
		});
	}
}
