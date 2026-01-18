import { Collection, type Client } from "discord.js";
import type { BotCommand } from "../../commands/BotCommand.js";
import type { Game } from "../../Game/Game.js";
import type { Player } from "../../Player/Player.js";
import type { AwaitingInteraction } from "../../Embed/AwaitingInteraction.js";
import type { LgonRoleGenerator } from "../../roles/LgonRoleGenerator.js";
import type { SlashCommand } from "../../commands/SlashCommand.js";

import loadCommands from "./commands.js";
import loadSlashCommands from "./slashCommands.js";
import loadEvents from "./events.js";
import loadRoles from "./roles.js";

export async function loader(bot: Client): Promise<void>
{

	const collections = 
	{
	  commands: new Collection<string, BotCommand>(),
	  slashCommands: new Collection<string, any>(),
	  cooldowns: new Collection<string, Collection<string, number>>(),
	  roles: new Collection<string, LgonRoleGenerator>(),
	  games: new Collection<string, Collection<string, Game>>(),
	  players: new Collection<string, Player>(),
	  awaitingInteractions: new Collection<string, AwaitingInteraction>(),
	  // "channelsJeu",
	  // "messagesRoles",
	}
	
	Object.assign(bot, collections);

	await loadCommands(bot);
	await loadSlashCommands(bot);
	await loadEvents(bot);
	await loadRoles(bot);
}
