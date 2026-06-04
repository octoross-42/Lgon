import { makeLgonId } from "../../../types/LgonId.js";
export class ViewStore {
    logger;
    views;
    static n = 0;
    min;
    constructor(gameStore, userStore, logger) {
        this.logger = logger;
        this.views = new Map();
        this.min = 0;
    }
    static makeViewId() {
        const id = makeLgonId("view", this.n.toString());
        this.n++;
        return (id);
    }
    otherModes(modes, mode) {
        let otherModes = [];
        let i = 0;
        while (i < modes.length) {
            if (modes[i].mode != mode)
                otherModes.push(modes[i].mode);
            i++;
        }
        return (otherModes);
    }
    compactView(msgBlock, ctx) {
        const step = msgBlock.steps[0];
        const mode = step.modes.find(mode => mode.mode === step.defaultMode);
        if (!mode)
            throw Error(""); // TODO
        const view = {
            id: ViewStore.makeViewId(),
            script: mode.script,
            interactions: mode.interactions.map(row => row.map(interaction => {
                if (interaction.kind === 'button')
                    return { model: interaction, enabled: true };
                else
                    return { model: interaction, enabled: true, selected: [] };
            })),
            otherModes: this.otherModes(step.modes, step.defaultMode),
            currentMode: step.defaultMode,
            step: 0,
            target: ctx.originMsgTarget,
            flowData: ctx
        };
        this.views.set(view.id, view);
        return (view);
    }
    longViews(msgBlock, ctx) {
        let views = [];
        let i = 0;
        while (i < msgBlock.steps.length) {
            const step = msgBlock.steps[i];
            const mode = step.modes.find(mode => mode.mode === step.defaultMode);
            if (!mode)
                throw Error(""); // TODO
            const target = (i === 0) ? ctx.originMsgTarget :
                {
                    kind: "view",
                    viewId: views[i - 1].id
                };
            const view = {
                id: ViewStore.makeViewId(),
                script: mode.script,
                interactions: mode.interactions.map(row => row.map(interaction => {
                    if (interaction.kind === 'button')
                        return { model: interaction, enabled: true };
                    else
                        return { model: interaction, enabled: true, selected: [] };
                })),
                otherModes: this.otherModes(step.modes, step.defaultMode),
                currentMode: step.defaultMode,
                step: 0,
                target: target,
                flowData: ctx
            };
            this.views.set(view.id, view);
            views.push(view);
            i++;
        }
        return (views);
    }
    new(flow, author, originMsgTarget, flowData) {
        let views = [];
        for (const msgBlock of flow) {
            const stepMode = author.preferences.stepMode;
            const flowCtx = {
                authorId: author.id,
                stepMode: stepMode,
                step: 0,
                originMsgTarget: originMsgTarget,
                data: flowData
            };
            if (stepMode === "compact")
                views.push(this.compactView(msgBlock, flowCtx));
            else // "long"
                views.concat(this.longViews(msgBlock, flowCtx));
        }
        return (views);
    }
    get(viewId) {
        return this.views.get(viewId);
    }
}
;
