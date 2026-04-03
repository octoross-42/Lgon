import type { Flow, MessageScript } from "../../model/Flow.js"

function scriptLobbyControls(contextId: string, userId: string): MessageScript
{
	return {
		title: "Controls",
		fields: [
			{
				title: "",
				value: "TODO"
			}
		]
	}
}

function TODOO(contextId: string, userId: string): MessageScript
{
	return {
		title: "TODO",
		fields: []
	}
}

// playersIds // TODO max 1024 caracteres -> envoyer plusieurs fields
// 				.map(id => `- <@${id}>`)
// 				.join("\n"),

function TODO(contextId: string, userId: string): void { return ; }

export const LobbyFlow: Flow = 
[{
	id: "Lobby-controls",
	steps: [
	{
		defaultMode: "basic",
		modes: [
		{
			mode: "basic",
			script: (contextId: string, userId: string) => scriptLobbyControls(contextId, userId),
			interactions: [
				[
					{
						kind: "button",
						build: {
							label: "Start",
							style: "command"				
						},
						onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
					},
					{
						kind: "button",
						build: {
							label: "Stop",
							style: "command"				
						},
						onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
					},
					{
						kind: "button",
						build: {
							label: "Reset",
							style: "command"				
						},
						onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
					},
					{
						kind: "button",
						build: {
							label: "End",
							style: "command"				
						},
						onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
					},
					{
						kind: "button",
						build: {
							label: "Restart",
							style: "command"				
						},
						onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
					}
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
			script: (contextId: string, userId: string) => TODOO(contextId, userId),
			interactions: [ 
			[
				{
					kind: "button",
					build: {
						label: "Join",
						style: "command"				
					},
					onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
				},
				{
					kind: "button",
					build: {
						label: "Leave",
						style: "command"				
					},
					onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
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
			script: (contextId: string, userId: string) => TODOO(contextId, userId),
			interactions: [
			[
				{
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
					onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
				},
				{
					kind: "button",
					build: {
						label: "+",
						style: "command"				
					},
					onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
				},
				{
					kind: "button",
					build: {
						label: "-",
						style: "command"				
					},
					onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
				}
			]]
		},
		{
			mode: "preset",
			script: (contextId: string, userId: string) => TODOO(contextId, userId),
			interactions: [
			[
				{
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
					onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
				},
				{
					kind: "button",
					build: {
						label: "+",
						style: "command"				
					},
					onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
				},
				{
					kind: "button",
					build: {
						label: "-",
						style: "command"				
					},
					onSubmit: (contextId: string, userId: string) => TODO(contextId, userId)
				}
			]]
		}
	]}]
}]
