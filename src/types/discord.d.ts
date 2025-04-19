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
  
	interface Client
	{
	  commands: Collection<string, Command>;
	  cooldowns: Collection<string, Collection<string, number>>; // command name -> Collection<userId, timestamp in ms>
  }
}