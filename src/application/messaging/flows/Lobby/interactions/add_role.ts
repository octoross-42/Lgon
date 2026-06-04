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

		const select_roles: SelectView<FlowDataGame> | undefined = view.interactions.flat().find(interaction => (interaction.model.id === "choose_role") && (interaction.model.kind === "select")) as SelectView<FlowDataGame> | undefined;
		if ( !select_roles )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "select interaction", whatId: "select_role", ctx: `add_role handler triggered by ${authorId}` } } );
			return ;
		}
		
		let count: number = 1;
		const select_count: SelectView<FlowDataGame> | undefined = view.interactions.flat().find(interaction => (interaction.model.id === "role_count") && (interaction.model.kind === "select")) as SelectView<FlowDataGame> | undefined;
		if ( !select_count )
			this.logger.event( { code: "NOT_FOUND", data: { what: "select interaction", whatId: "role_count", ctx: `add_role handler triggered by ${authorId}` } } );	

		else if ( select_count.selected.length > 1 )
			this.logger.event( { code: "DESIGN_ERROR", data: { error: "Select number component has multiple selections" } } );	

		else if ( select_count.selected.length === 1 )
		{
			count = Number(select_count.selected[0]);
			if (Number.isNaN(count) || (count < 1))
				count = 1;
		}

		if ( !game.add_roles(select_roles.selected as LgonId<"role">[], count) )
			return ;

		this.flowRunner.update(view);
	}
}
