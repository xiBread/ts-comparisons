import type { Selector } from '../';
import { Comparator } from '../';
import type { CompareArgs } from '../util';
import { compareValues } from './';

/**
 * Compares two values using the specified functions to calculate the result of
 * the comparison. The functions are called sequentially, receive the given
 * values `a` and `b` and return {@link Comparable} objects. As soon as the
 * {@link Comparable} instances returned by a function for `a` and `b` values do
 * not compare as equal, the result of that comparison is returned.
 */
export function compareValuesBy<T>(a: T, b: T, ...selectors: Selector<T>[]): number;

/**
 * Compares two values using the specified `selector` function to calculate the
 * result of the comparison. The function is applied to the given values `a`
 * and `b` and return {@link Comparable} objects. The result of comparison of
 * these {@link Comparable} instances is returned.
 */
export function compareValuesBy<T>(a: T, B: T, selector: Selector<T>): number;

/**
 * Compares two values using the specified `selector` function to calculate the
 * result of the comparison. The function is applied to the given values `a`
 * and `b` and return objects of type `K` which are then being ompared with the
 * given `comparator`.
 */
export function compareValuesBy<T, K>(a: T, b: T, comparator: Comparator<K>, selector: (value: T) => K): number;
export function compareValuesBy<T, K>(a: T, b: T, ...args: CompareArgs<T, K>): number {
	if (Array.isArray(args[0])) {
		const selectors: Selector<T>[] = args[0];

		for (const selector of selectors) {
			const diff = compareValues(selector(a), selector(b));

			if (diff !== 0) return diff;
		}

		return 0;
	}

	if (args[0] instanceof Comparator) {
		const selector = args[1] as (value: T) => K;

		return args[0].compare(selector(a), selector(b));
	}

	const selector = args[0];

	return compareValues(selector(a), selector(b));
}
