export type LgonIdKind =
	"player"
	| "user"
	| "role"
	| "game"
	| "where"
	| "archive"
	| "interaction"
	| "ui_session";


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

export function makeRandgonId<K extends LgonIdKind>(kind: K, unique_id: number): LgonId<K>
{
	const mod = 1_000_000;

	const a = 653_347;
	const b = 127_391;
	const rid = (a * unique_id + b) % mod;
	return (makeLgonId(kind, rid.toString().padStart(6, '0')));
}