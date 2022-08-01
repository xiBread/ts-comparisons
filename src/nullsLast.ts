import { isDeepStrictEqual } from "util";
import { Comparator, naturalOrder, type Comparable } from "../";

/**
 * Extends the given `comparator` of non-nullable values to a Comparator of
 * nullable values considering `null` value greater than any other value.
 */
export function nullsLast<T>(comparator: Comparator<T>): Comparator<T | null>;

/**
 * Provides a Comparator of nullable {@link Comparable} values considering `null`
 * value greater than any other value.
 */
export function nullsLast<T extends Comparable<T>>(): Comparator<T | null>;
export function nullsLast<T>(comparator?: Comparator<T>): Comparator<T | null> {
	if (comparator instanceof Comparator) {
		return new (class extends Comparator<T> {
			public override compare(a: T, b: T): number {
				if (isDeepStrictEqual(a, b)) return 0;
				if (a === null) return 1;
				if (b === null) return -1;

				return comparator.compare(a, b);
			}
		})();
	}

	return nullsLast(naturalOrder() as unknown as Comparator<T>);
}
