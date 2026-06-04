import type { GameStore } from "application/context/modules/GameStore.js";
import type { FlowContext, FlowDataGame } from "application/messaging/model/Flow.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import { ButtonHandler } from "application/messaging/model/InteractionHandler.js";
import type { View, SelectView } from "application/messaging/model/View.js";
import type { ViewStore } from "application/messaging/model/ViewStore.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { Logger } from "infra/Logger.js";
import type { LgonId } from "types/LgonId.js";

export class AddRoleHandler extends ButtonHandler
{
	constructor(private readonly gameStore: GameStore,
				viewStore: ViewStore,
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

		const game: Game | undefined = this.gameStore.get(view.flowData.data.gameId);
		if ( !game )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "game", whatId: `${view.flowData.data.gameId}`, ctx: `add_role handler triggered by ${authorId}` } } );
			return ;
		}

		const select_interaction: SelectView<FlowDataGame> | undefined = view.interactions.flat().find(interaction => (interaction.model.id === "choose_role") && (interaction.model.kind === "select")) as SelectView<FlowDataGame> | undefined;
		if ( !select_interaction )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "interaction", whatId: "select_role", ctx: `add_role handler triggered by ${authorId}` } } );
			return ;
		}

		if ( !game.add_roles(select_interaction.selected as LgonId<"role">[], 1) )
			return ;

		this.flowRunner.update(view);
	}
}
