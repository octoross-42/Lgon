import { makeLgonId } from "../../types/LgonId.js";
import { loadScripts } from "../loadScripts.js";
export class ViewStore {
    logger;
    views;
    static n = 0;
    min;
    scripts;
    constructor(gameStore, userStore, logger) {
        this.logger = logger;
        this.views = new Map();
        this.min = 0;
        this.scripts = loadScripts(gameStore, userStore, logger);
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
    getScript(scriptName, authorId) {
        return (this.scripts[scriptName].script(authorId));
    }
    compactView(msgBlock, ctx) {
        const step = msgBlock.steps[0];
        const mode = step.modes.find(mode => mode.mode === step.defaultMode);
        if (!mode)
            throw Error(""); // TODO
        const script = this.getScript(mode.script, ctx.authorId);
        if (!script)
            throw Error(""); // TODO
        const view = {
            id: ViewStore.makeViewId(),
            script: script,
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
            blockCtx: ctx
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
            const script = this.getScript(mode.script, ctx.authorId);
            if (!script)
                throw Error(""); // TODO
            const target = (i === 0) ? ctx.originMsgTarget :
                {
                    kind: "reply",
                    viewId: views[i - 1].id
                };
            const view = {
                id: ViewStore.makeViewId(),
                script: script,
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
                blockCtx: ctx
            };
            this.views.set(view.id, view);
            views.push(view);
            i++;
        }
        return (views);
    }
    new(flow, author, originMsgTarget) {
        let views = [];
        for (const msgBlock of flow) {
            const stepMode = author.preferences.stepMode;
            const blockCtx = {
                authorId: author.id,
                stepMode: stepMode,
                step: 0,
                originMsgTarget: originMsgTarget
            };
            if (stepMode === "compact")
                views.push(this.compactView(msgBlock, blockCtx));
            else // "long"
                views.concat(this.longViews(msgBlock, blockCtx));
        }
        return (views);
    }
}
;
