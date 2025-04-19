import { Client, Collection, Command } from "discord.js";

require('dotenv').config();
const bot:Client = new Client();

function initBotCollections(bot: Client) {
	const collections = {
	  commands: new Collection<string, Command>(),
	  cooldowns: new Collection<string, Collection<string, number>>(),
	};
	
	Object.assign(bot, collections);
  }

initBotCollections(bot);
	// "commands",
	// "cooldowns",
	// "parties",
	// "channelsJeu",
	// "messagesRoles",
	// "rolesCommands",
	// "joueurs",
	// "joueur"

// joueur : author.id -> joueurs
// joueurs : guild.id -> joueurs
// parties : guild.id -> partie

//https://www.youtube.com/watch?v=QkbveDG94ik&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=12

// loadCommands(bot);
// loadEvents(bot);
// loadRoles(bot);

bot.login(process.env.TOKEN);

console.log(`Bot is online !`);