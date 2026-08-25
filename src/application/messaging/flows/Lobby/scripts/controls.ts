import type { Script } from "application/messaging/model/View.js";
import type { FlowContext, GameDataFlow } from "application/messaging/model/Flow.js";

export function LobbyControlsScript(ctx: FlowContext<GameDataFlow>): Script
{
	return ({
		title: "Controls",
		description: `*\`${ctx.data.gameId}\`*`,
		fields: [
			{
				name: "",
				value: ""
			}
		]
	});
}
