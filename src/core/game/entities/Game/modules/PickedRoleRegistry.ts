import { type LgonId, getLgonId } from "types/LgonId.js";
import type { RoleGenerator } from "../../LgonRole/RoleGenerator.js";
import type { Logger } from "infra/Logger.js";
import type { LgonRoleGeneratorRegistry } from "application/context/modules/LgonRoleGeneratorRegistry.js";

export type RoleStock =
{
	qty: number,
	gen: RoleGenerator
}

export class PickedRoleRegistry
{
	private readonly roles: Map<LgonId<"role">, RoleStock>;

	constructor(public readonly availables: LgonRoleGeneratorRegistry,
				public readonly logger: Logger)
	{
		this.roles = new Map<LgonId<"role">, RoleStock>();
	}

	add(roleNames: LgonId<"role">[], quantity: number): boolean
	{
		let update: boolean = false;

		if (quantity < 1)
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: "add roles count < 1" } } );
			throw Error(""); // TODO wtf ?
		}

		for (const roleName of roleNames)
		{			
			const roleGenerator: RoleGenerator | undefined = this.availables.get(roleName);
			if ( !roleGenerator )
			{
				this.logger.event( { code: "DESIGN_ERROR", data: { error: `Tried to add ${roleName} but wasn't found` } } );
				continue ;
			}
	
			update = true;
			let stock: RoleStock | undefined = this.roles.get(roleGenerator.meta.name);
			if ( stock )
				this.roles.set( roleGenerator.meta.name, { gen: roleGenerator, qty: quantity + stock.qty } );
			else
				this.roles.set( roleGenerator.meta.name, { gen: roleGenerator, qty: quantity } );
		}
	
		return (update);
	}

	rm(roleNames: LgonId<"role">[], quantity: number): boolean
	{
		let update: boolean = false;

		if (quantity < 1)
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: "add roles count < 1" } } );
			throw Error(""); // TODO wtf ?
		}

		for (const roleName of roleNames)
		{			
			const roleGenerator: RoleGenerator | undefined = this.availables.get(roleName);
			if ( !roleGenerator )
			{
				this.logger.event( { code: "DESIGN_ERROR", data: { error: `Tried to add ${roleName} but wasn't found` } } );
				continue ;
			}
	
			let stock: RoleStock | undefined = this.roles.get(roleGenerator.meta.name);

			if ( !stock )
				continue ;

			update = true;
			if ( stock && (stock.qty - quantity > 0) )
				this.roles.set( roleGenerator.meta.name, { gen: roleGenerator, qty: stock.qty - quantity } );
			else
				this.roles.delete(roleGenerator.meta.name);
		}
		return (update);
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
