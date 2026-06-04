import type { SelectName } from "application/messaging/loadInteractions.js";
import type { FlowDataGame } from "application/messaging/model/Flow.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import { SelectHandler } from "application/messaging/model/InteractionHandler.js";
import type { View, SelectView } from "application/messaging/model/View.js";
import type { ViewStore } from "application/messaging/model/ViewStore.js"
import type { Logger } from "infra/Logger.js";
import type { LgonId } from "types/LgonId.js";

export class BasicSelectHandler extends SelectHandler
{
	constructor(viewStore: ViewStore,
				flowRunner: FlowRunner,
				logger: Logger) { super("update", viewStore, flowRunner, logger); }
	
	async run(authorId: LgonId<"user">, selected: string[], selectId: string, viewId: LgonId<"view">): Promise<void>
	{
		const view: View<FlowDataGame> | undefined = this.viewStore.get<FlowDataGame>(viewId);
		if ( !view )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "view", whatId: viewId, ctx: `choose_role handler triggered by ${authorId}` } } );
			return ;
		}

		const select_interaction: SelectView<FlowDataGame> | undefined = view.interactions.flat().find(interaction => ( (interaction.model.id === selectId) && (interaction.model.interactionId === "basic_select") && (interaction.model.kind === "select"))) as SelectView<FlowDataGame> | undefined;
		if ( !select_interaction )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "interaction", whatId: "select_role", ctx: `choose_role handler triggered by ${authorId}` } } );
			return ;
		}

		select_interaction.selected = selected;
	}
}

