import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { Logger } from "infra/Logger.js";
import { InteractionRegistry } from "application/context/modules/InteractionRegistry.js";
import type { FlowRunner } from "./model/FlowRunner.js";
import type { ViewStore } from "./model/ViewStore.js";

export type ButtonName = "start_game" | "pause_game" | "restart_game" |
							"switch_game" | "join_game" | "leave_game" |
							"add_role" | "rm_role";
export type SelectName = "choose_role";

export function loadInteractions(viewStore: ViewStore,gameStore: GameStore, userStore: UserStore, flowRunner: FlowRunner, logger: Logger): InteractionRegistry 
{
	return new InteractionRegistry({
		"add_role": new InteractionReplyTODO("update"),
		"rm_role": new InteractionReplyTODO("update"),
		"join_game": new InteractionReplyTODO("update"),
		"leave_game": new InteractionReplyTODO("update"),
		"pause_game": new InteractionReplyTODO("update"),
		"restart_game": new InteractionReplyTODO("update"),
		"start_game": new InteractionReplyTODO("update"),
		"switch_game": new InteractionReplyTODO("update"),
	},
	{
		"choose_role": new InteractionReplyTODO("update")
	},
	logger);
}
