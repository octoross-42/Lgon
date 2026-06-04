export const NotifyFlow = (status) => {
    return ([{
            id: "Notifier",
            steps: [{
                    modes: [{
                            mode: "basic",
                            script: status,
                            interactions: [[]]
                        }],
                    defaultMode: "basic"
                }]
        }]);
};
