import type { Command } from "../.../core/commands/Command.js";
import type { RoleGenerator } from "./RoleGenerator.js";
import type { Game } from "../Game/Game.js";
import type { Player } from "../Game/Player.js";

import type
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
import { EmbedManager } from "../discord/EmbedManagment/EmbedManager.js";
import { LgonContext } from "../core/LgonContext/LgonContext.js";
  
declare module 'discord.js'
{
	export interface Event
	{
		name: string;
		onEvent: (bot: Client, ...args: any[]) => Promise<void> | void;
	}

	export interface Client
	{
		lgon: LgonContext;
		commands: Collection<string, Command>;                     // command name -> Command
		slashCommands: Collection<string, any>;						// slash command name -> // TODO
		cooldowns: Collection<string, Collection<string, number>>;	// command name -> Collection<userId, timestamp in ms> // TODO changer les cooldowns par personnes qui utilisent pas utilisation globale
	}
}