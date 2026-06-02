import type { Flow } from "messagingFlows/model/Flow.js";

export const SwitchGameFlow: Flow =
[{
	id: "SwitchGame",
	steps: [{
		defaultMode: "basic",
		modes: [{
			mode: "basic",
			script: "SwitchGame",
			interactions: [[
			{
				id: "switch_game",
				kind: "button",
				build: {
					label: "Switch",
					style: "green"
				},
				customIdKind: "user"
			},
			{
				id: "cancel_msg",
				kind: "button",
				build: {
					label: "Don't",
					style: "red"
				},
				customIdKind: "user"
			}]]
		}]
	}]
}];