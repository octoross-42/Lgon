export type LgonIdKind =
	"player"
	| "user"
	| "role"
	| "game"
	| "where"
	| "archive"
	| "interaction"
	| "view";


export type CommandLgonIdKind = 
	"user"
	| "game"


export type LgonId<K extends LgonIdKind> = string & {
	readonly __kind: K;
};

export function makeLgonId<K extends LgonIdKind>(kind: K, id: string): LgonId<K>
{
	return (`${kind}:${id}` as LgonId<K>);
}

export function getLgonIdKind(lgonId: LgonId<LgonIdKind>): LgonIdKind
{
	 const index = lgonId.indexOf(":");
	return (lgonId.slice(0, index) as LgonIdKind)
}

export function getLgonId(lgonId: LgonId<LgonIdKind>): string
{
	 const index = lgonId.indexOf(":");
	return (lgonId.slice(index + 1))
}

const NUMERIC_BASE = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function itoa_base(n: number, base: string[]): string
{
	if (n < 0)
		n = -n;
	let str = "";
	const len: number = base.length;
	while (n > len)
	{
		str = base[(n % len)] + str;
		n = Math.floor(n / len);
	}
	return (str);
}

export function makeRandomId<K extends LgonIdKind>(kind: K, unique_id: number, base: string[] = NUMERIC_BASE): LgonId<K>
{
	const mod = 1_000_000;

	const a: number = 653_347;
	const b: number = 127_391;
	const rid: number = (a * unique_id + b) % mod;
	return (makeLgonId(kind, itoa_base(rid, base).padStart(6, '0'))); // TODO faire en sorte d; avoir 6 lettres sans 0
}