import type { Game } from "core/game/entities/Game/Game.js";
import type { RoleStock } from "core/game/entities/Game/modules/PickedRoleRegistry.js";
import type { Script } from "application/messaging/model/View.js";
import type { FlowContext, FlowDataGame } from "application/messaging/model/Flow.js";

export function LobbyRolesScript(ctx: FlowContext<FlowDataGame>): Script
{
	const game: Game | undefined = ctx.data.gameStore.get(ctx.data.gameId);
	if ( !game )
		return ({
			title: "Roles",
				fields: [
					{
						name: "",
						value: "Game not found"
					}
				]
		});

	const stocks: RoleStock[] = game.pickedRoles.getStock();
	const rolesStr: string = (stocks.length > 0) ? ("- " + stocks.map( stock => stock.gen.meta.name ).join("\n- ")): "*(null)*";
	const countStr: string = (stocks.length > 0) ? (stocks.map( stock => stock.qty.toString() ).join("\n")) : "0";
	
	return ({
		title: "Roles",
		description: `*\`${ctx.data.gameId}\`*`,
		fields: [
			{
				name: "Role",
				value: `${rolesStr}`,
				inline: true
			},
			{
				name: "Count",
				value: `${countStr}`,
				inline: true
			}
		]
	});
}
