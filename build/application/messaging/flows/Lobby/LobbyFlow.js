import { enableGameSetupInteraction } from "./interactions/enable.js";
import { ChooseRoleOptions } from "./interactions/choose_role.js";
import { LobbyControlsScript } from "./scripts/controls.js";
import { LobbyPlayersScript } from "./scripts/players.js";
import { LobbyPresetRolesScript } from "./scripts/preset_roles.js";
import { LobbyRolesScript } from "./scripts/roles.js";
// playersIds // TODO max 1024 caracteres -> envoyer plusieurs fields
// 				.map(id => `- <@${id}>`)
// 				.join("\n"),
export const LobbyFlow = [{
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
                                    id: "start_game",
                                    kind: "button",
                                    build: {
                                        label: "Start",
                                        style: "green",
                                        enabled: enableGameSetupInteraction
                                    },
                                },
                                {
                                    id: "pause_game",
                                    kind: "button",
                                    build: {
                                        label: "Pause",
                                        style: "grey",
                                        enabled: enableGameSetupInteraction
                                    },
                                },
                                {
                                    id: "restart_game",
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
                    }
                ],
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
                                    id: "join_game",
                                    kind: "button",
                                    build: {
                                        label: "Join",
                                        style: "green",
                                        enabled: enableGameSetupInteraction
                                    },
                                },
                                {
                                    id: "leave_game",
                                    kind: "button",
                                    build: {
                                        label: "Leave",
                                        style: "grey",
                                        enabled: enableGameSetupInteraction
                                    },
                                }
                            ]
                        ]
                    }
                ],
            }
        ]
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
                                    id: "choose_role",
                                    kind: "select",
                                    build: {
                                        placeholder: "Select role",
                                        options: ChooseRoleOptions,
                                        minValues: 1,
                                        maxValues: -1,
                                        enabled: enableGameSetupInteraction
                                    },
                                    // onSubmit: (userId: string) => TODO(userId)
                                }
                            ],
                            [
                                {
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
                    },
                    {
                        mode: "preset",
                        script: LobbyPresetRolesScript,
                        interactions: [
                            [
                                {
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
                ]
            }
        ]
    }];
