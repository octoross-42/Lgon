export class CannotLeaveScriptMaker {
    constructor() { }
    script(authorId) {
        return (new CannotLeaveScript());
    }
}
export class CannotLeaveScript {
    constructor() { }
    make() {
        return ({
            title: "\\:(",
            fields: [
                {
                    name: "",
                    value: "You cannot leave your current game"
                }
            ]
        });
    }
}
