import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { Logger } from "infra/Logger.js";
import { InteractionReply } from "./model/InteractionReply.js";
import type { LgonId } from "types/LgonId.js";
import { InteractionRegistry } from "application/context/modules/InteractionRegistry.js";
import type { FlowRunner } from "./model/FlowRunner.js";

export type ButtonName = "start_game" | "pause_game" | "restart_game" |
							"switch_game" | "join_game" | "leave_game" |
							"add_role" | "rm_role";
export type SelectName = "choose_role";

class InteractionReplyTODO extends InteractionReply
{
	constructor()
	{
		super("update");
	}

	run(authorId: LgonId<"user">): void
	{
		return ;
	}
}

export function loadInteractions(gameStore: GameStore, userStore: UserStore, flowRunner: FlowRunner, logger: Logger): InteractionRegistry 
{
	return new InteractionRegistry({
		"add_role": new InteractionReplyTODO(),
		"rm_role": new InteractionReplyTODO(),
		"join_game": new InteractionReplyTODO(),
		"leave_game": new InteractionReplyTODO(),
		"pause_game": new InteractionReplyTODO(),
		"restart_game": new InteractionReplyTODO(),
		"start_game": new InteractionReplyTODO(),
		"switch_game": new InteractionReplyTODO(),
	},
	{
		"choose_role": new InteractionReplyTODO()
	},
	logger);
}
