import { SwitchGameScript } from "./scripts/switchGame.js";
import { enableSwitchToNewGameInteraction } from "./interactions/enable.js";
export const SwitchGameFlow = [{
        id: "SwitchGame",
        steps: [{
                defaultMode: "basic",
                modes: [{
                        mode: "basic",
                        script: SwitchGameScript,
                        interactions: [[
                                {
                                    id: "switch_game",
                                    kind: "button",
                                    build: {
                                        label: "Switch",
                                        style: "green",
                                        enabled: enableSwitchToNewGameInteraction
                                    }
                                },
                                {
                                    id: "cancel_msg",
                                    kind: "button",
                                    build: {
                                        label: "Don't",
                                        style: "red",
                                        enabled: (ctx) => true
                                    }
                                }
                            ]]
                    }]
            }]
    }];
