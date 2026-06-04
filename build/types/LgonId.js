export function makeLgonId(kind, id) {
    return `${kind}:${id}`;
}
export function getLgonIdKind(lgonId) {
    const index = lgonId.indexOf(":");
    return lgonId.slice(0, index);
}
export function getLgonId(lgonId) {
    const index = lgonId.indexOf(":");
    return (lgonId.slice(index + 1));
}
const NUMERIC_BASE = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
function itoa_base(n, base) {
    if (n < 0)
        n = -n;
    let str = "";
    const len = base.length;
    while (n > len) {
        str = base[(n % len)] + str;
        n = Math.floor(n / len);
    }
    return (str);
}
export function makeRandomId(kind, unique_id, base = NUMERIC_BASE) {
    const mod = 1_000_000;
    const a = 653_347;
    const b = 127_391;
    const rid = (a * unique_id + b) % mod;
    return (makeLgonId(kind, itoa_base(rid, base).padStart(6, '0'))); // TODO faire en sorte d; avoir 6 lettres sans 0
}
