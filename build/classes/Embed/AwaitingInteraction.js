export var AwaitingInteractionType;
(function (AwaitingInteractionType) {
    AwaitingInteractionType[AwaitingInteractionType["START"] = 0] = "START";
    AwaitingInteractionType[AwaitingInteractionType["ADD"] = 1] = "ADD";
    AwaitingInteractionType[AwaitingInteractionType["RM"] = 2] = "RM";
    AwaitingInteractionType[AwaitingInteractionType["PLAY"] = 3] = "PLAY";
    AwaitingInteractionType[AwaitingInteractionType["PREPLAY"] = 4] = "PREPLAY";
    // STOP,
    // PAUSE,
    // RESUME,
    // DELETE,
    // RESTART,
    // END
})(AwaitingInteractionType || (AwaitingInteractionType = {}));
export class AwaitingInteraction {
    type;
    id;
    embed;
    constructor(type, id, embed) {
        this.type = type;
        this.id = id;
        this.embed = embed;
    }
    interact(bot, reaction, user) {
        this.embed.interact(bot, reaction, user);
    }
}
