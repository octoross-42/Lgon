import type { GameDataFlow } from "application/messaging/model/Flow.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import { SelectHandler } from "application/messaging/model/InteractionHandler.js";
import type { View, SelectView } from "application/messaging/model/View.js";
import type { ViewStore } from "application/messaging/model/ViewStore.js"
import type { Logger } from "infra/Logger.js";
import type { LgonId } from "types/LgonId.js";
import type { SelectInteractionModel } from "application/messaging/model/Flow.js";
import { type InteractionCode, INTERACTION_CODES } from "application/errors/InteractionError.js";
import type { MessagingSource } from "application/ports/MessagingDirective.js";
import type { AdapterKind } from "application/ports/MessagingPort.js";

export class BasicSelectHandler extends SelectHandler
{
	constructor(viewStore: ViewStore,
				flowRunner: FlowRunner,
				logger: Logger) { super("update", viewStore, flowRunner, logger); }
	
	async run(authorId: LgonId<"user">, selected: string[], selectName: string, viewId: LgonId<"view">, source: MessagingSource<AdapterKind>): Promise<InteractionCode>
	{
		const view: View<GameDataFlow> | undefined = this.viewStore.get<GameDataFlow>(viewId);
		if ( !view )
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: `In basic select handler triggered by ${authorId}, view of "${selectName}" was not found` } } );
			return (INTERACTION_CODES.DISCORD_COMPONENT_DESIGN_ERROR);
		}

		const select_interaction: SelectView<GameDataFlow> | undefined = view.interactions.flat().find(interaction => ( ((interaction.model as SelectInteractionModel<GameDataFlow>).name === selectName) && (interaction.model.id === "basic_select") && (interaction.model.kind === "select"))) as SelectView<GameDataFlow> | undefined;
		if ( !select_interaction )
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: `In basic select handler triggered by ${authorId}, select interaction "${selectName}" was not found in the view` } } );
			return (INTERACTION_CODES.DISCORD_COMPONENT_DESIGN_ERROR);
		}

		select_interaction.selected = selected;
		return (INTERACTION_CODES.OK);
	}
}

