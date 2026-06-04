import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { Logger } from "infra/Logger.js";
import { InteractionRegistry } from "application/context/modules/InteractionRegistry.js";
import type { FlowRunner } from "./model/FlowRunner.js";
import type { ViewStore } from "./model/ViewStore.js";
import { AddRoleHandler } from "./flows/Lobby/interactions/add_role.js";
import { BasicSelectHandler } from "./flows/Lobby/interactions/basic_select.js";
import { CancelMsgHandler } from "./flows/Lobby/interactions/cancel_msg.js";

export type ButtonName = "start_game" | "pause_game" | "restart_game" |
							"switch_game" | "join_game" | "leave_game" |
							"add_role" | "rm_role" |
							"cancel_msg";
export type SelectName = "choose_role";

export function loadInteractions(viewStore: ViewStore,gameStore: GameStore, userStore: UserStore, flowRunner: FlowRunner, logger: Logger): InteractionRegistry 
{
	return new InteractionRegistry({
		"add_role": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
		"rm_role": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
		"join_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
		"leave_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
		"pause_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
		"restart_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
		"start_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
		"switch_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
		"cancel_msg": new CancelMsgHandler(viewStore, flowRunner, logger)
	},
	{
		"choose_role": new BasicSelectHandler(viewStore, flowRunner, logger)
	},
	logger);
}
