export class CannotJoinScriptMaker {
    constructor() { }
    script(authorId) {
        return (new CannotJoinScript());
    }
}
export class CannotJoinScript {
    constructor() { }
    make() {
        return ({
            title: "\\:(",
            fields: [
                {
                    name: "",
                    value: "You cannot join this game"
                }
            ]
        });
    }
}
