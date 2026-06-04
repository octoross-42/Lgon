import { MessagingPort } from "../../../application/ports/MessagingPort.js";
export class DiscordMessenger extends MessagingPort {
    constructor(lgon) {
        super(lgon);
    }
    async send(msgTarget) {
        console.log("we send tkt yipee");
        return;
    }
    async update() {
        console.log("we update tkt yipee");
    }
}
;
