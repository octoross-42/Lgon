import { CONSTANTES } from "../../config/constantes.js";
import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
class LoupGarou extends LgonRole {
    constructor(help, owner, id) {
        super(help, owner, id);
        this.owner = "tralalalala";
    }
    preshot_action() {
        console.log("prout");
    }
}
function roleGenerator(help, owner, id) {
    return (new LoupGarou(help, owner, id));
}
const help = CONSTANTES.ROLES.LOUPS.LOUP_GAROU;
export { roleGenerator, help };
