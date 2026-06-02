import { Client, GatewayIntentBits, MessageManager } from "discord.js";
import { loadCommands } from "adapters/discord/commands/loadCommands.js";

import type { DiscordMessagingCache } from "./store/DiscordMessagingCache.js";
import type { Logger } from "infra/Logger.js";
import { DiscordMessenger } from "./messaging/DiscordMessenger.js";

export async function initDiscordClient(msgsCache: DiscordMessagingCache, logger: Logger): Promise<Client>
{
	const bot: Client = new Client( {intents: [
		GatewayIntentBits.Guilds, // Intent de base pour les serveurs
		GatewayIntentBits.GuildMessages, // Pour les messages des salons textuels
		GatewayIntentBits.MessageContent, // Pour lire le contenu des messages
		GatewayIntentBits.GuildMembers, // Pour les membres du serveur (nécessite l'activation dans le portail dev));
		GatewayIntentBits.DirectMessages, // Pour les messages privés
		GatewayIntentBits.GuildMessageReactions, // Pour les réactions sur les messages
		// GatewayIntentBits.Mess
	]});

	bot.cooldowns = new Map<string, Map<string, number>>();
	bot.messenger = new DiscordMessenger( bot, msgsCache, logger );
	bot.commands = await loadCommands(msgsCache, logger);
	
	return (bot);
}
