import { initDiscordClient } from "adapters/discord/client.js";
import type { Client, UserSelectMenuBuilder } from "discord.js";

import { loadEvents } from "adapters/discord/events/loadEvents.js";
import { loadRoles } from "core/game/roles/loadRoles.js";
import { LgonContext } from "application/context/LgonContext.js";
import { Logger } from "infra/Logger.js";
import { DiscordMessagingCache } from "adapters/discord/store/DiscordMessagingCache.js";
import { FlowRunner } from "application/messaging/model/FlowRunner.js";

import 'dotenv/config';
import { UserStore } from "application/context/modules/UserStore.js";
import { GameStore } from "application/context/modules/GameStore.js";
import { L, L_RED, L_BLACK, L_RESET, L_BGBLACK, L_BGBLUE, L_BGBLUEPURPLE, L_BGBROWN, L_BGCYAN, L_BGGREEN, L_BGGREY, L_BGLBLUE, L_BGLGREEN, L_BGLGREY, L_BGORANGE, L_BGPURPLE, L_BGRED, L_BGRESET, L_BGROSE, L_BGWHITE, L_BGYELLOW, L_BLUE, L_BLUEPURPLE, L_BOLD, L_BRGB, L_BROWN, L_CPRESET, L_CYAN, L_FSRESET, L_FWRESET, L_GREEN, L_GREY, L_ITALIC, L_LBLUE, L_LGREEN, L_LGREY, L_LIGHT, L_LINETHROUGH, L_ORANGE, L_OVERLINE, L_PURPLE, L_RGB, L_RMLINETHROUGH, L_ROSE, L_WHITE, L_YELLOW } from "infra/LOG_FORMAT.js";
import { LgonRoleGeneratorRegistry } from "application/context/modules/LgonRoleGeneratorRegistry.js";

function test_log()
{
	console.log("\n" + L(L_BLACK) + "L_BLACK" + L(L_RESET));
	console.log(L(L_BGBLACK) + "L_BGBLACK" + L(L_RESET));
	console.log(L(L_RED) + "L_RED" + L(L_RESET));
	console.log(L(L_BGRED) + "L_BGRED" + L(L_RESET));
	console.log(L(L_GREEN) + "L_GREEN" + L(L_RESET));
	console.log(L(L_BGGREEN) + "L_BGGREEN" + L(L_RESET));
	console.log(L(L_BROWN) + "L_BROWN" + L(L_RESET));
	console.log(L(L_BGBROWN) + "L_BGBROWN" + L(L_RESET));
	console.log(L(L_BLUE) + "L_BLUE" + L(L_RESET));
	console.log(L(L_BGBLUE) + "L_BGBLUE" + L(L_RESET));
	console.log(L(L_PURPLE) + "L_PURPLE" + L(L_RESET));
	console.log(L(L_BGPURPLE) + "L_BGPURPLE" + L(L_RESET));
	console.log(L(L_LBLUE) + "L_LBLUE" + L(L_RESET));
	console.log(L(L_BGLBLUE) + "L_BGLBLUE" + L(L_RESET));
	console.log(L(L_LGREY) + "L_LGREY" + L(L_RESET));
	console.log(L(L_BGLGREY) + "L_BGLGREY" + L(L_RESET));
	console.log(L(L_GREY) + "L_GREY" + L(L_RESET));
	console.log(L(L_BGGREY) + "L_BGGREY" + L(L_RESET));
	console.log(L(L_ORANGE) + "L_ORANGE" + L(L_RESET));
	console.log(L(L_BGORANGE) + "L_BGORANGE" + L(L_RESET));
	console.log(L(L_LGREEN) + "L_LGREEN" + L(L_RESET));
	console.log(L(L_BGLGREEN) + "L_BGLGREEN" + L(L_RESET));
	console.log(L(L_YELLOW) + "L_YELLOW" + L(L_RESET));
	console.log(L(L_BGYELLOW) + "L_BGYELLOW" + L(L_RESET));
	console.log(L(L_BLUEPURPLE) + "L_BLUEPURPLE" + L(L_RESET));
	console.log(L(L_BGBLUEPURPLE) + "L_BGBLUEPURPLE" + L(L_RESET));
	console.log(L(L_ROSE) + "L_ROSE" + L(L_RESET));
	console.log(L(L_BGROSE) + "L_BGROSE" + L(L_RESET));
	console.log(L(L_CYAN) + "L_CYAN" + L(L_RESET));
	console.log(L(L_BGCYAN) + "L_BGCYAN" + L(L_RESET));
	console.log(L(L_WHITE) + "L_WHITE" + L(L_RESET));
	console.log(L(L_BGWHITE) + "L_BGWHITE" + L(L_RESET));
}

export async function bootstrap(): Promise<void>
{
	test_log();

	const logger: Logger = new Logger();

	const bot: Client = await initDiscordClient( new DiscordMessagingCache(), logger );

	const roles: LgonRoleGeneratorRegistry = await loadRoles();

	const userStore: UserStore = new UserStore(logger);
	const gameStore: GameStore = new GameStore(roles, logger);

	const flowRunner = new FlowRunner(bot.messenger, gameStore, userStore, logger);
	const lgon: LgonContext = new LgonContext(roles, gameStore, userStore, flowRunner, logger);
	
	await loadEvents(bot, lgon);

	bot.login(process.env.TOKEN);
}
