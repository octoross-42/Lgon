export class NightRole {
    meta;
    owner;
    // rolesToKill: number[];
    // playerToKill: string[];
    // rolesToKeepAlive: number[];
    // playersToKeepAlive: string[];
    // run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;
    constructor(meta, owner) {
        this.meta = meta;
        this.owner = owner;
    }
    async preshot_action() { }
    register_action(actions) { }
    play_auto() { }
}
