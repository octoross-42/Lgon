export class InternalErrorScriptMaker {
    constructor() { }
    script(authorId) {
        return (new InternalErrorScript());
    }
}
export class InternalErrorScript {
    constructor() { }
    make() {
        return ({
            title: "Error \\:(",
            fields: [
                {
                    name: "",
                    value: "Internal error, please contact the dev"
                }
            ]
        });
    }
}
