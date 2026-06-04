export function NotifierFlowMaker(notifierScript) {
    return [
        {
            id: "Notifier",
            steps: [{
                    modes: [{
                            mode: "basic",
                            script: (contextId, userId) => notifierScript(contextId, userId),
                            interactions: [[]]
                        }],
                    defaultMode: "basic"
                }]
        }
    ];
}
