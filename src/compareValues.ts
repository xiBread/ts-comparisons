import { isDeepStrictEqual } from "util";
import type { Comparable } from "../";

/**
 * Compares two nullable {@link Comparable} values. `null` is considered less
 * than any value.
 */
export function compareValues<T extends Comparable<unknown>>(a: T | null, b: T | null): number {
	if (isDeepStrictEqual(a, b)) return 0;
	if (a === null) return -1;
	if (b === null) return 1;

	return a.compareTo(b);
}
