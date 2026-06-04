import { getLgonId } from "../../../../../types/LgonId.js";
export class PickedRoleRegistry {
    availables;
    logger;
    roles;
    constructor(availables, logger) {
        this.availables = availables;
        this.logger = logger;
        this.roles = new Map();
    }
    add(roleNames, quantity) {
        let update = false;
        if (quantity < 1) {
            this.logger.event({ code: "DESIGN_ERROR", data: { error: "add roles count < 1" } });
            throw Error(""); // TODO wtf ?
        }
        for (const roleName of roleNames) {
            const roleGenerator = this.availables.get(roleName);
            if (!roleGenerator) {
                this.logger.event({ code: "DESIGN_ERROR", data: { error: `Tried to add ${roleName} but wasn't found` } });
                continue;
            }
            update = true;
            let stock = this.roles.get(roleGenerator.meta.id);
            if (stock)
                this.roles.set(roleGenerator.meta.id, { gen: roleGenerator, qty: quantity + stock.qty });
            else
                this.roles.set(roleGenerator.meta.id, { gen: roleGenerator, qty: quantity });
        }
        return (update);
    }
    rm(roleNames, quantity) {
        let update = false;
        if (quantity < 1) {
            this.logger.event({ code: "DESIGN_ERROR", data: { error: "add roles count < 1" } });
            throw Error(""); // TODO wtf ?
        }
        for (const roleName of roleNames) {
            const roleGenerator = this.availables.get(roleName);
            if (!roleGenerator) {
                this.logger.event({ code: "DESIGN_ERROR", data: { error: `Tried to add ${roleName} but wasn't found` } });
                continue;
            }
            let stock = this.roles.get(roleGenerator.meta.id);
            if (!stock)
                continue;
            update = true;
            if (stock && (stock.qty - quantity > 0))
                this.roles.set(roleGenerator.meta.id, { gen: roleGenerator, qty: stock.qty - quantity });
            else
                this.roles.delete(roleGenerator.meta.id);
        }
        return (update);
    }
    getNames() {
        return (Array.from(this.roles.keys(), key => getLgonId(key)));
    }
    getStock() {
        return (Array.from(this.roles.values()));
    }
}
