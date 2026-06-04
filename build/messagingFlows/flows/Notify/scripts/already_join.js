export class AlreadyJoinedScriptMaker {
    constructor() { }
    script(authorId) {
        return (new AlreadyJoinedScript());
    }
}
export class AlreadyJoinedScript {
    constructor() { }
    make() {
        return ({
            title: "\\:(",
            fields: [
                {
                    name: "",
                    value: "You already joined this game"
                }
            ]
        });
    }
}
