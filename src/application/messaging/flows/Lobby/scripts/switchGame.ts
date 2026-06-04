import type { Script } from "application/messaging/model/View.js";
import type { FlowContext, FlowDataSwitchGame } from "application/messaging/model/Flow.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";

export function SwitchGameScript(ctx: FlowContext<FlowDataSwitchGame>): Script
{	
	const user: LgonUser | undefined = ctx.data.userStore.get(ctx.data.userId);
	if ( !user )
	{
		return ({
			title: "Switch Game",
			fields: [
				{
					name: "",
					value: "User not found"
				}
			]
		});
	}

	return ({
		title: "Switch Game",
		fields: [
			{
				name: "\u200b",
				value: `Do you want to switch game ?\n*From ${(user.game)? user.game.meta.id: "null"}*`
			}
		]
	});
}
