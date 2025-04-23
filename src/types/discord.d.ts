declare module 'discord.js'
{
	import { Command } from "./Command.js";
	import { Role } from "./Role.js";
	import { Client, Collection, Message } from 'discord.js';
	
	export interface CommandHelp
	{
		name: string;
		aliases?: string[];
		category?: string;
		description: string;
		nbrArgsRequired: number;
		cooldown: number; // en secondes
		usage?: string;
	};

	export interface Event
	{
		name: string;
		onEvent: (bot: Client, ...args: any[]) => Promise<void> | void;
	}

	export interface RoleHelp
	{
		name: string,
		category: string,
		description: string,
		cdv: string,
		usage: string,
		aliases?: string[],
		action: boolean,
		information: boolean,
		vote: boolean,
	};

	interface Client
	{
	  commands: Collection<string, Command>;                     // command name -> Command
	  cooldowns: Collection<string, Collection<string, number>>; // command name -> Collection<userId, timestamp in ms> // TODO changer les cooldowns par personnes qui utilisent pas utilisation globale
	  roles: Collection<string, Role>;			     			 // role name    -> Role
	  games: Collection<string, Game>        					 // guild id     -> Game
	  players: Collection<string, Player>;					 	 // player id    -> Player (mais ce qui arrive dans un serveur reste dans un serveur)
  }
}