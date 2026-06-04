import type { FlowContext, FlowDataGame, FlowDataSwitchGame } from "application/messaging/model/Flow.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";

export function enableGameSetupInteraction(ctx: FlowContext<FlowDataGame>)
{
	const game: Game | undefined = ctx.data.gameStore.get(ctx.data.gameId);
	if ( !game )
		return (false);
	return (game.phase === "setup");
}

export function enableLeaveGameInteraction(ctx: FlowContext<FlowDataGame>)
{
	const game: Game | undefined = ctx.data.gameStore.get(ctx.data.gameId);
	if ( !game )
		return (false);
	return (game.phase === "setup");
}

export function enableSwitchToNewGameInteraction(ctx: FlowContext<FlowDataSwitchGame>)
{
	const user: LgonUser | undefined = ctx.data.userStore.get(ctx.data.userId);
	if ( !user )
		return (false);
	if ( !user.game )
		return (true);
	return (user.game.phase === "setup");
}