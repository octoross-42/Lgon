import type { Game } from "core/game/entities/Game/Game.js";
import type { Script } from "application/messaging/model/View.js";
import type { FlowContext, FlowDataGame } from "application/messaging/model/Flow.js";

export function LobbyPlayersScript(ctx: FlowContext<FlowDataGame>): Script
{
	const game: Game | undefined = ctx.data.gameStore.get(ctx.data.gameId);
	if ( !game )
		return ({
			title: "Players",
				fields: [
					{
						name: "",
						value: "Game not found"
					}
				]
		});

	const playersIds: string[] = game.players.getIds();
	const playersStr: string = ((playersIds.length > 0) ? "- <@" : "") + playersIds.join(">\n- <@") + ((playersIds.length > 0) ? ">" : "");
	
	return ({
		title: "Players",
		description: `*\`${ctx.data.gameId}\`*`,
		fields: [
			{
				name: "",
				value: playersStr
			}
		]
	});
}
