import type { GameStore } from "application/context/modules/GameStore.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import { SelectHandler } from "application/messaging/model/InteractionHandler.js";
import type { MessageView, SelectView } from "application/messaging/model/View.js";
import type { ViewStore } from "application/messaging/model/ViewStore.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { Logger } from "infra/Logger.js";
import type { LgonId } from "types/LgonId.js";

export class ChooseRoleHandler extends SelectHandler
{
	constructor(private readonly gameStore: GameStore,
				viewStore: ViewStore,
				flowRunner: FlowRunner,
				logger: Logger) { super("update", viewStore, flowRunner, logger); }
	
	async run(authorId: LgonId<"user">, selected: string[], contextId: string): Promise<void>
	{
		const viewId = contextId as LgonId<"view">;
		const view: MessageView | undefined = this.viewStore.get(viewId);
		if ( !view )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "view", whatId: viewId, ctx: `choose_role handler triggered by ${authorId}` } } );
			return ;
		}

		const game: Game | undefined = this.gameStore.get(view.blockCtx.data.gameId);
		if ( !game )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "game", whatId: `${view.blockCtx.data.gameId}`, ctx: `choose_role handler triggered by ${authorId}` } } );
			return ;
		}

		const select_interaction: SelectView | undefined = view.interactions.flat().find(interaction => (interaction.model.id === "select_role") && (interaction.model.kind === "select")) as SelectView | undefined;
		if ( !select_interaction )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "interaction", whatId: "select_role", ctx: `choose_role handler triggered by ${authorId}` } } );
			return ;
		}

		select_interaction.selected = selected;
	}
}
