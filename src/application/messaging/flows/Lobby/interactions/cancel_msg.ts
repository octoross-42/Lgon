import type { GameDataFlow } from "application/messaging/model/Flow.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import { ButtonHandler } from "application/messaging/model/InteractionHandler.js";
import type { View } from "application/messaging/model/View.js";
import type { ViewStore } from "application/messaging/model/ViewStore.js";
import type { Logger } from "infra/Logger.js";
import { type LgonId, makeLgonIdFrom } from "types/LgonId.js";
import { type InteractionCode, INTERACTION_CODES } from "application/errors/InteractionError.js";
import type { MessagingSource } from "application/ports/MessagingDirective.js";
import type { AdapterKind } from "application/ports/MessagingPort.js";

export class CancelMsgHandler extends ButtonHandler
{
	constructor(viewStore: ViewStore,
				flowRunner: FlowRunner,
				logger: Logger) { super("update", viewStore, flowRunner, logger); }
	
	async run(authorId: LgonId<"user">, viewId: LgonId<"view">, source: MessagingSource<AdapterKind>): Promise<InteractionCode>
	{
		const view: View<GameDataFlow> | undefined = this.viewStore.get(viewId as LgonId<"view">);
		if ( !view )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "view", whatId: viewId, ctx: `add_role handler triggered by ${authorId}` } } );
			return (INTERACTION_CODES.VIEW_NOT_FOUND);
		}

		this.flowRunner.run(
					{
						msg: { kind: "view", viewId: viewId },
						source: source,
						intention: "delete"
					},
		
				);

		return (INTERACTION_CODES.OK);
	}
}
