import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { CONSTANTES } from "../../config/constantes.js";
class Villageois extends LgonRole {
    constructor(help, owner, id) {
        super(help, owner, id);
        this.owner = "tralalalala";
    }
    preshot_action() {
        console.log("caca");
    }
}
function roleGenerator(help, owner, id) {
    return (new Villageois(help, owner, id));
}
const help = CONSTANTES.ROLES.VILLAGEOIS.VILLAGEOIS;
export { roleGenerator, help };
