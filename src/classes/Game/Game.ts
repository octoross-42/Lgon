import { Collection, Guild, Client, EmbedBuilder, Message, PartialMessage } from "discord.js";
import { Player } from "./Player.js";
import { getRoleName, LgonRoleGenerator } from "../../classes/LgonRole/LgonRoleGenerator.js";
import { CONSTANTES } from "../../config/constantes.js";
import { LgonRole } from "../LgonRole/LgonRole.js";
import { newEmbed } from "../Embed/AwaitingInteraction.js"

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

export class Game
{
	name: string;
	guildId: string;
	guildName: string;
	time: string;
	date: string;
	id: number;
	ready: number;
	rolesCount: number;
	isDefaultGame: boolean = false;
	
	static games_nbr: number = 0;
	
	status: "setup" | "night" | "vote" | "ended";
	players: Collection<string, Player>; 				// userId -> InGame
	roles: Collection<string, number>;
	waitingRoom: Collection<string, Player>; // userId -> InGame
	inGameRoles: LgonRole[] | null;
	center: Collection<string, LgonRole> | null;
	msg : Message | PartialMessage | null;
	nightIndex: number;

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

		this.inGameRoles = null;
		this.guildId = guild.id;
		this.guildName = guild.name;
		Game.games_nbr ++;
		this.id = Game.games_nbr;
		this.name = name;
		this.status = "setup";
		this.players = new Collection<string, Player>();
		this.waitingRoom = new Collection<string, Player>();
		this.roles = new Collection<string, number>();
		this.isDefaultGame = false;
		this.ready = 0;
		this.rolesCount = 0;
		this.center = null;
		this.msg = null;
		this.nightIndex = 0;
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
		// console.log("add player", player.name, this.name);
		this.players.set(player.name, player);
		embed.addFields({ name: '**Join**', value: `${player.name} has joined **${this.name}**`, inline: false });
	}

	addWaitingPlayer(player: Player, embed: EmbedBuilder): void
	{
		this.waitingRoom.set(player.name, player);
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
			rolesString += role[0] + "\n";
		}
		if (rolesString.length > 0)
			embed.addFields({ name: `**Roles**`, value: rolesString, inline: true });
		else
			embed.addFields({ name: `**Roles**`, value: "No roles", inline: true });
	}

	async distributeRoles(bot: Client): Promise<void>
	{
		this.inGameRoles = [];
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
						await tmpPlayers[index].sendRole(lgonRole);
						tmpPlayers.splice(index, 1);
					}
					this.inGameRoles.push(lgonRole);
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
			if (player.role!.help.action)
				await player.role!.preshot_action(bot);
		}
	}

	async start(bot: Client, message: Message | PartialMessage)
	{
		this.status = "night";
		const linkImage = "https://i.imgur.com/m3SG4PB.png";
		let embed: EmbedBuilder = newEmbed();
		embed.setTitle(this.name);
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
		while (i < this.inGameRoles!.length)
		{
			roleString += `\t${this.inGameRoles![i].printName}`;
			if (i === this.nightIndex)
				roleString += " ◀"; //➤
			roleString += "\n";
			i ++;
		}
		
		let embed: EmbedBuilder = newEmbed();
		embed.setTitle(`**Night** ${this.name}`)
			.addFields({name: "Night", value: roleString});
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

	async spendNight(bot: Client)
	{
		await this.showNight(bot, false);
	}
}
