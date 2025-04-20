import { Client, Collection, Command } from "discord.js";
import { loadCommands } from "./loader/commands.js";
import { loadEvents } from "./loader/events.js";

import 'dotenv/config';

const bot:Client = new Client();

function initBotCollections(bot: Client)
{
	const collections = 
	{
	  commands: new Collection<string, Command>(),
	  cooldowns: new Collection<string, Collection<string, number>>(),
	  // "commands",
	  // "cooldowns",
	  // "parties",
	  // "channelsJeu",
	  // "messagesRoles",
	  // "rolesCommands",
	  // "joueurs",
	  // "joueur"
	};
	
	Object.assign(bot, collections);
}

initBotCollections(bot);


//https://www.youtube.com/watch?v=QkbveDG94ik&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=12

await loadCommands(bot);
await loadEvents(bot);
// loadRoles(bot);


bot.login(process.env.TOKEN);

console.log(`Bot is online !`);
