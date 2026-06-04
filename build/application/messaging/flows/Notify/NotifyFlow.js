export const NotifyFlow = (script) => {
    return ([{
            id: "Notifier",
            steps: [{
                    modes: [{
                            mode: "basic",
                            script: (ctx) => script,
                            interactions: [[]]
                        }],
                    defaultMode: "basic"
                }]
        }]);
};
