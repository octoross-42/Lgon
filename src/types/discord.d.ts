import { BotCommand } from "../classes/Commands/BotCommand.js";
import { LgonRoleGenerator } from "./LgonRoleGenerator.js";
import { Game } from "../classes/Game/Game.js";
import { Player } from "../classes/Game/Player.js";
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
	export interface CommandMeta
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

	

	export interface LgonRoleMeta
	{
		name: string;
		category: "Loup" | "Villageois" | "Independant";
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
	  slashCommands: Collection<string, any>;						// slash command name -> // TODO
	  cooldowns: Collection<string, Collection<string, number>>;	// command name -> Collection<userId, timestamp in ms> // TODO changer les cooldowns par personnes qui utilisent pas utilisation globale
	  roles: Collection<string, LgonRoleGenerator>;			     			// role name    -> LgonRoleGenerator
	  games: Collection<string, Collection<string, Game>>;	     	// guild id     -> game_name -> Game
	  players: Collection<string, Player>;					 	 	// player id    -> Player (mais ce qui arrive dans un serveur reste dans un serveur)
	  awaitingInteractions: Collection<string, AwaitingInteraction>; // message id -> AwaitingInteraction
	}
}