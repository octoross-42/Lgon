declare module 'discord.js'
{
	import { Client, Collection, Message } from 'discord.js';
	
	export interface Command
	{
		help: {
			name: string;
			aliases?: string[];
			category?: string;
			description: string;
			nbrArgsRequired: number;
			cooldown: number; // en secondes
			usage: string;
		};
		run: (bot:Client, message: Message, argv: string[]) => Promise<void> | void;
	}

	export interface Event
	{
		name: string;
		onEvent: (bot: Client, ...args: any[]) => Promise<void> | void;
	}

	export interface Role
	{
		help: {
			name: string,
            category: string,
            description: string,
			cdv: string,
			usage: string,
			aliases: string[],
			typeRole: string[3]
		};
	}


	interface Client
	{
	  commands: Collection<string, Command>;                     // command name -> Command
	  roles: Collection<string, Role>;			     			 // role name    -> Role
	  cooldowns: Collection<string, Collection<string, number>>; // command name -> Collection<userId, timestamp in ms>
  }
}