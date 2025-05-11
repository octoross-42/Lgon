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
        this.help = help;
        this.owner = owner;
        this.id = id;
    }
}
