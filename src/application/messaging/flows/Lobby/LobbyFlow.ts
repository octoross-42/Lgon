import type { Flow, FlowDataGame } from "../../model/Flow.js";
import { enableGameSetupInteraction } from "./interactions/enable.js";
import { ChooseRoleOptions } from "./interactions/choose_role.js";
import { LobbyControlsScript } from "./scripts/controls.js";
import { LobbyPlayersScript } from "./scripts/players.js";
import { LobbyPresetRolesScript } from "./scripts/preset_roles.js";
import { LobbyRolesScript } from "./scripts/roles.js";
import { SelectNumberOptions } from "./interactions/select_number.js";

// playersIds // TODO max 1024 caracteres -> envoyer plusieurs fields
// 				.map(id => `- <@${id}>`)
// 				.join("\n"),

export const LobbyFlow: Flow<FlowDataGame> = 
[{
	id: "Lobby-controls",
	steps: [
	{
		defaultMode: "basic",
		modes: [
		{
			mode: "basic",
			script: LobbyControlsScript,
			interactions: [
				[
					{
						interactionId: "start_game",
						id: "start",
						kind: "button",
						build: {
							label: "Start",
							style: "green",
							enabled: enableGameSetupInteraction
						},
					},
					{
						interactionId: "pause_game",
						id: "pause",
						kind: "button",
						build: {
							label: "Pause",
							style: "grey",
							enabled: enableGameSetupInteraction
						},
					},
					{
						interactionId: "restart_game",
						id: "restart",
						kind: "button",
						build: {
							label: "Restart",
							style: "grey",
							enabled: enableGameSetupInteraction			
						},
					},
					// {
					// 	id: "reset_game",
		
					// 	kind: "button",
					// 	build: {
					// 		label: "Reset",
					// 		style: "grey"
					// 	},
					// 	// onSubmit: (userId: string) => TODO(userId)
					// },
					// {
					// 	id: "delete_game",
		
					// 	kind: "button",
					// 	build: {
					// 		label: "Delete",
					// 		style: "red"				
					// 	},
					// 	// onSubmit: (userId: string) => TODO(userId)
					// }
				]
			]
		}],
	},
	]
},
{
	id: "Lobby-players",
	steps: [
	{
		defaultMode: "basic",
		modes: [
		{
			mode: "basic",
			script: LobbyPlayersScript,
			interactions: [ 
			[
				{
					interactionId: "join_game",
					id: "join",
					kind: "button",
					build: {
						label: "Join",
						style: "green",
						enabled: enableGameSetupInteraction			
					},
				},
				{
					interactionId: "leave_game",
					id: "leave",
					kind: "button",
					build: {
						label: "Leave",
						style: "grey",
						enabled: enableGameSetupInteraction			
					},
				}
			]]
		}
	],}]
},
{
	id: "Lobby-roles",
	steps: [
	{
		defaultMode: "manual",
		modes: [
		{
			mode: "manual",
			script: LobbyRolesScript,
			interactions: [
			[
				{
					interactionId: "basic_select",
					id: "choose_role",
					kind: "select",
					build: {
						placeholder: "Select role",
						options: ChooseRoleOptions,
						minValues: 1,
						maxValues: -1,
						enabled: enableGameSetupInteraction
					},
				}
			],
			[
				{
					interactionId: "basic_select",
					id: "role_count",
					kind: "select",
					build: {
						placeholder: "Select role count",
						options: SelectNumberOptions,
						minValues: 1,
						maxValues: 1,
						enabled: enableGameSetupInteraction
					},
				}
			],
			[
				{
					interactionId: "add_role",
					id: "add_role",
					kind: "button",
					build: {
						label: "+",
						style: "green",
						enabled: enableGameSetupInteraction
					},
					// onSubmit: (userId: string) => TODO(userId)
				},
				{
					interactionId: "rm_role",
					id: "rm_role",
					kind: "button",
					build: {
						label: "-",
						style: "grey",
						enabled: enableGameSetupInteraction			
					},
					// onSubmit: (userId: string) => TODO(userId)
				}
			]]
		},
		{
			mode: "preset",
			script: LobbyPresetRolesScript,
			interactions: [
			[
				{
					interactionId: "basic_select",
					id: "choose_role",
					kind: "select",
					build: {
						placeholder: "Select role",
						options: ChooseRoleOptions,
						minValues: 1,
						maxValues: 1,
						enabled: enableGameSetupInteraction
					},
					// onSubmit: (userId: string) => TODO(userId)
				}
			],
			[
				{
					interactionId: "add_role",
					id: "add_role",
					kind: "button",
					build: {
						label: "+",
						style: "green",
						enabled: enableGameSetupInteraction
					},
					// onSubmit: (userId: string) => TODO(userId)
				},
				{
					interactionId: "rm_role",
					id: "rm_role",
					kind: "button",
					build: {
						label: "-",
						style: "grey",
						enabled: enableGameSetupInteraction
					},
					// onSubmit: (userId: string) => TODO(userId)
				}
			]
			]
		}
	]}]
}]
