import type { Comparable, Comparator } from "../";
import { NaturalOrderComparator } from "../util";

/**
 * Returns a Comparator that compares {@link Comparable} objects in natural
 * order.
 */
export function naturalOrder<T extends Comparable<T>>(): Comparator<T> {
	return new NaturalOrderComparator() as Comparator<T>;
}
