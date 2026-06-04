import type { GameStore } from "application/context/modules/GameStore.js";
import type { FlowContext, FlowDataGame } from "application/messaging/model/Flow.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import { ButtonHandler } from "application/messaging/model/InteractionHandler.js";
import type { View, SelectView } from "application/messaging/model/View.js";
import type { ViewStore } from "application/messaging/model/ViewStore.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { Logger } from "infra/Logger.js";
import type { LgonId } from "types/LgonId.js";

export class CancelMsgHandler extends ButtonHandler
{
	constructor(viewStore: ViewStore,
				flowRunner: FlowRunner,
				logger: Logger) { super("update", viewStore, flowRunner, logger); }
	
	async run(authorId: LgonId<"user">, viewId: string): Promise<void>
	{
		const view: View<FlowDataGame> | undefined = this.viewStore.get(viewId as LgonId<"view">);
		if ( !view )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "view", whatId: viewId, ctx: `add_role handler triggered by ${authorId}` } } );
			return ;
		}

		this.flowRunner.delete(view)
	}
}
