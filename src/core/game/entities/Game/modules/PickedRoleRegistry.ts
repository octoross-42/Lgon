import { type LgonId, getLgonId } from "types/LgonId.js";
import type { RoleGenerator } from "../../LgonRole/RoleGenerator.js";

export type RoleStock =
{
	qty: number,
	gen: RoleGenerator
}

export class PickedRoleRegistry
{
	private readonly roles: Map<LgonId<"role">, RoleStock>;

	constructor()
	{
		this.roles = new Map<LgonId<"role">, RoleStock>();
	}

	add(roleGenerator: RoleGenerator, quantity: number)
	{
		if (quantity < 1)
			throw Error(""); // TODO wtf ?

		let stock: RoleStock | undefined = this.roles.get(roleGenerator.meta.name);
		if ( stock )
			this.roles.set( roleGenerator.meta.name, { gen: roleGenerator, qty: quantity + stock.qty } );
		else
			this.roles.set( roleGenerator.meta.name, { gen: roleGenerator, qty: quantity } );
	}

	rm(roleGenerator: RoleGenerator, quantity: number)
	{
		if (quantity < 1)
			throw Error(""); // TODO wtf ?

		let stock: RoleStock | undefined = this.roles.get(roleGenerator.meta.name);
		if ( stock )
			this.roles.set( roleGenerator.meta.name, { gen: roleGenerator, qty: Math.max(0, quantity - stock.qty) } );
	}

	getNames(): string[]
	{
		return ( Array.from(this.roles.keys(), key => getLgonId(key)) );
	}

	getStock(): RoleStock[]
	{
		return ( Array.from(this.roles.values()) );
	}
}
