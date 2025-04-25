import { BotCommand } from "./BotCommand.js";
import { LgonRole } from "./LgonRole.js";
import { Game } from "./Game.js";
import { Player } from "./Player.js";
import
{
	Client,
	Collection,
	ChatInputCommandInteraction,
	Message,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	SelectMenuBuilder
} from 'discord.js';
  
	
declare module 'discord.js'
{
	export interface CommandHelp
	{
		name: string;
		aliases?: string[];
		category?: string;
		description: string;
		nbrArgsRequired: number;
		cooldown: number; // en secondes
		where: "dm" | "guild" | "any";
		usage?: string;
	}

	export interface RoleHelp
	{
		name: string;
		category: string;
		description: string;
		cdv: string;
		usage: string;
		aliases?: string[];
		action: boolean;
		information: boolean;
		vote: boolean;
	}
	
	export interface Event
	{
		name: string;
		onEvent: (bot: Client, ...args: any[]) => Promise<void> | void;
	}

	export interface Client
	{
	  commands: Collection<string, BotCommand>;                     // command name -> BotCommand
	  cooldowns: Collection<string, Collection<string, number>>; // command name -> Collection<userId, timestamp in ms> // TODO changer les cooldowns par personnes qui utilisent pas utilisation globale
	  roles: Collection<string, LgonRole>;			     			 // role name    -> LgonRole
	  games: Collection<string, Collection<string, Game>>;	     // guild id     -> game_name -> Game
	  players: Collection<string, Player>;					 	 // player id    -> Player (mais ce qui arrive dans un serveur reste dans un serveur)
	}
}