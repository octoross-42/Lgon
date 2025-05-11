export class LgonRole {
    // this.inGameId = -1;
    // this.rolesToKill = [];
    // this.playerToKill = [];
    // this.rolesToKeepAlive = [];
    // this.playersToKeepAlive = [];
    // this.run = run;
    id;
    owner;
    help;
    // rolesToKill: number[];
    // playerToKill: string[];
    // rolesToKeepAlive: number[];
    // playersToKeepAlive: string[];
    // run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;
    constructor(help, owner, id) {
        if (this.constructor === LgonRole) {
            throw new Error("Nonono LgonRole is abstract");
        }
        this.help = help;
        this.owner = owner;
        this.id = id;
    }
    preshot_action() { }
}
