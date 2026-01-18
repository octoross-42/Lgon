import { Client, GatewayIntentBits } from "discord.js";
import { loader } from "./bot/loader/loader.js"

import 'dotenv/config';


// import dns from "node:dns";
// dns.setDefaultResultOrder("ipv4first");


// process.on("unhandledRejection", (reason) => {
//   console.error("UNHANDLED REJECTION:", reason);
// });

// process.on("uncaughtException", (err) => {
//   console.error("UNCAUGHT EXCEPTION:", err);
// });


const bot:Client = new Client( {intents: [
    GatewayIntentBits.Guilds, // Intent de base pour les serveurs
    GatewayIntentBits.GuildMessages, // Pour les messages des salons textuels
    GatewayIntentBits.MessageContent, // Pour lire le contenu des messages
    GatewayIntentBits.GuildMembers, // Pour les membres du serveur (nécessite l'activation dans le portail dev));
    GatewayIntentBits.DirectMessages, // Pour les messages privés
	GatewayIntentBits.GuildMessageReactions, // Pour les réactions sur les messages
	// GatewayIntentBits.Mess

]});

await loader(bot);


// bot.on("error", (err) => console.error("DISCORD CLIENT ERROR:", err));
// bot.on("shardError", (err) => console.error("SHARD ERROR:", err));


bot.login(process.env.TOKEN);
