import { makeRandomId } from "../../../../types/LgonId.js";
const ALPHA_BASE = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
export class GameMeta {
    creationTime;
    id;
    static ids_count = 0;
    constructor() {
        this.id = makeRandomId("game", GameMeta.ids_count++, ALPHA_BASE);
        this.creationTime = new Date();
    }
    getCreationTime() {
        const creationTimeStr = new Intl.DateTimeFormat('fr', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(this.creationTime);
        return (creationTimeStr);
    }
    getCreationDate() {
        const creationDateStr = new Intl.DateTimeFormat('fr', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(this.creationTime);
        return (creationDateStr);
    }
}
