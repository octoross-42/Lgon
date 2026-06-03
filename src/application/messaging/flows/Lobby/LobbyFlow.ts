import type { Flow } from "../../model/Flow.js";

// playersIds // TODO max 1024 caracteres -> envoyer plusieurs fields
// 				.map(id => `- <@${id}>`)
// 				.join("\n"),

export const LobbyFlow: Flow = 
[{
	id: "Lobby-controls",
	steps: [
	{
		defaultMode: "basic",
		modes: [
		{
			mode: "basic",
			script: "LobbyControls",
			interactions: [
				[
					{
						id: "start_game",
						customIdKind: "game",
						kind: "button",
						build: {
							label: "Start",
							style: "green"
						},
						// onSubmit: (userId: string) => TODO(userId)
					},
					{
						id: "pause_game",
						customIdKind: "game",
						kind: "button",
						build: {
							label: "Pause",
							style: "grey"
						},
						// onSubmit: (userId: string) => TODO(userId)
					},
					{
						id: "restart_game",
						customIdKind: "game",
						kind: "button",
						build: {
							label: "Restart",
							style: "grey"				
						},
						// onSubmit: (userId: string) => TODO(userId)
					},
					// {
					// 	id: "reset_game",
					// 	customIdKind: "game",
					// 	kind: "button",
					// 	build: {
					// 		label: "Reset",
					// 		style: "grey"
					// 	},
					// 	// onSubmit: (userId: string) => TODO(userId)
					// },
					// {
					// 	id: "delete_game",
					// 	customIdKind: "game",
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
			script: "LobbyPlayers",
			interactions: [ 
			[
				{
					id: "join_game",
					customIdKind: "game",
					kind: "button",
					build: {
						label: "Join",
						style: "green"				
					},
					// onSubmit: (userId: string) => TODO(userId)
				},
				{
					id: "leave_game",
					customIdKind: "game",
					kind: "button",
					build: {
						label: "Leave",
						style: "red"				
					},
					// onSubmit: (userId: string) => TODO(userId)
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
			script: "LobbyRoles",
			interactions: [
			[
				{
					id: "choose_role",
					customIdKind: "game",
					kind: "select",
					build: {
						placeholder: "Select role",
						options: [
							{
								label: "Loup-garou",
								value: "loup",
								description: "TODO"
							}
						],
						minValues: 1,
						maxValues: 1
					},
					// onSubmit: (userId: string) => TODO(userId)
				}
			],
			[
				{
					id: "add_role",
					customIdKind: "game",
					kind: "button",
					build: {
						label: "+",
						style: "green",			
					},
					// onSubmit: (userId: string) => TODO(userId)
				},
				{
					id: "rm_role",
					customIdKind: "game",
					kind: "button",
					build: {
						label: "-",
						style: "red"				
					},
					// onSubmit: (userId: string) => TODO(userId)
				}
			]]
		},
		{
			mode: "preset",
			script: "LobbyPresetRoles",
			interactions: [
			[
				{
					id: "choose_role",
					customIdKind: "game",
					kind: "select",
					build: {
						placeholder: "Select role",
						options: [
							{
								label: "Loup-garou",
								value: "loup",
								description: "TODO"
							}
						],
						minValues: 1,
						maxValues: 1
					},
					// onSubmit: (userId: string) => TODO(userId)
				}
			],
			[
				{
					id: "add_role",
					customIdKind: "game",
					kind: "button",
					build: {
						label: "+",
						style: "green"				
					},
					// onSubmit: (userId: string) => TODO(userId)
				},
				{
					id: "rm_role",
					customIdKind: "game",
					kind: "button",
					build: {
						label: "-",
						style: "red"				
					},
					// onSubmit: (userId: string) => TODO(userId)
				}
			]
			]
		}
	]}]
}]
