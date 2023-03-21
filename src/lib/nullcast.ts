export function nullCast<T>(value: T | null | undefined): T {
    if (!value) throw new Error("Value is null");
    return value;
 }