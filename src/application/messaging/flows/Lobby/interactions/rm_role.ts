import type { GameStore } from "application/context/modules/GameStore.js";
import type { GameDataFlow } from "application/messaging/model/Flow.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import { ButtonHandler } from "application/messaging/model/InteractionHandler.js";
import type { View, SelectView } from "application/messaging/model/View.js";
import type { ViewStore } from "application/messaging/model/ViewStore.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { Logger } from "infra/Logger.js";
import type { LgonId } from "types/LgonId.js";
import type { SelectInteractionModel } from "application/messaging/model/Flow.js";
import { InternalErrorScript } from "application/messaging/flows/Notify/scripts/internal_error.js";
import { DEFAULT_STEPMODE } from "core/game/entities/LgonUser/UserPreferences.js";
import { NotifyFlow } from "../../Notify/NotifyFlow.js";
import { InteractionCode, INTERACTION_CODES } from "application/errors/InteractionError.js";

export class RmRoleHandler extends ButtonHandler
{
	constructor(private readonly gameStore: GameStore,
				viewStore: ViewStore,
				flowRunner: FlowRunner,
				logger: Logger) { super("update", viewStore, flowRunner, logger); }
	
	async run(authorId: LgonId<"user">, viewId: string): Promise<InteractionCode>
	{
		const view: View<GameDataFlow> | undefined = this.viewStore.get(viewId as LgonId<"view">);
		let	code: InteractionCode = INTERACTION_CODES.OK;

		if ( !view )
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: `In add_role handler triggered by ${authorId}, view "${viewId}" was not found` } } );
			return (INTERACTION_CODES.VIEW_NOT_FOUND);
		}

		const game: Game | undefined = this.gameStore.get(view.flowData.data.gameId);
		if ( !game )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "game", whatId: `${view.flowData.data.gameId}`, ctx: `add_role handler triggered by ${authorId}` } } );
			return (INTERACTION_CODES.GAME_NOT_FOUND);
		}

		const select_roles: SelectView<GameDataFlow> | undefined = view.interactions.flat().find(interaction => ((interaction.model as SelectInteractionModel<GameDataFlow>).name === "choose_role") && (interaction.model.kind === "select")) as SelectView<GameDataFlow> | undefined;
		if ( !select_roles )
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: `In add_role handler triggered by ${authorId}, select interaction "select role" needed to add role was not found in the view` } } );
			return (INTERACTION_CODES.DISCORD_COMPONENT_NOT_FOUND);
		}
		
		let count: number = 1;
		const select_count: SelectView<GameDataFlow> | undefined = view.interactions.flat().find(interaction => ((interaction.model as SelectInteractionModel<GameDataFlow>).name === "role_count") && (interaction.model.kind === "select")) as SelectView<GameDataFlow> | undefined;
		if ( !select_count )
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: `In add_role handler triggered by ${authorId}, select interaction "select role count" needed to add role was not found in the view` } } );	
			code = INTERACTION_CODES.DISCORD_COMPONENT_DESIGN_ERROR;
		}

		else if ( select_count.selected.length > 1 )
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: "Select number component has multiple selections" } } );
			return (INTERACTION_CODES.DISCORD_COMPONENT_DESIGN_ERROR);
		}

		else if ( select_count.selected.length === 1 )
		{
			count = Number(select_count.selected[0]);
			if (Number.isNaN(count) || (count < 1))
			{
				count = 1;

				this.logger.event( { code: "DESIGN_ERROR", data: { error: "Number selected is nan or < 1" } } );
				code = INTERACTION_CODES.DISCORD_COMPONENT_DESIGN_ERROR;
			}
		}

		// this.logger.event( { code: "" } );
		if ( !game.rm_roles(select_roles.selected as LgonId<"role">[], count) )
			return (INTERACTION_CODES.ROLE_NOT_FOUND);

		this.flowRunner.update(view);
	
		return (INTERACTION_CODES.OK);
	}
}
