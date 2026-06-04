import type { Flow, FlowContext, FlowDataSwitchGame } from "application/messaging/model/Flow.js";
import { SwitchGameScript } from "./scripts/switchGame.js";
import { enableSwitchToNewGameInteraction } from "./interactions/enable.js";

export const SwitchGameFlow: Flow<FlowDataSwitchGame> =
[{
	id: "SwitchGame",
	steps: [{
		defaultMode: "basic",
		modes: [{
			mode: "basic",
			script: SwitchGameScript,
			interactions: [[
			{
				interactionId: "switch_game", 
				id: "switch",
				kind: "button",
				build: {
					label: "Switch",
					style: "green",
					enabled: enableSwitchToNewGameInteraction
				}
			},
			{
				id: "cancel",
				interactionId: "cancel_msg",
				kind: "button",
				build: {
					label: "Don't",
					style: "red",
					enabled: (ctx: FlowContext<FlowDataSwitchGame>) => true
				}
			}]]
		}]
	}]
}];