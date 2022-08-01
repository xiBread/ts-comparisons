import { Comparator, compareValuesBy, type Selector } from ".";
import type { CompareArgs } from "./util";

/**
 * Creates a {@link Comparator} using the sequence of functions to calculate a
 * result of comparison. The functions are called sequentially, receive the given
 * values `a` and `b` and return Comparable objects. As soon as the Comparable
 * instances returned by a function for `a` and `b` values do not compare as
 * equal, the result of that comparison is returned from the {@link Comparator}.
 */
export function compareBy<T>(...selectors: Selector<T>[]): Comparator<T>;

/**
 * Creates a {@link Comparator} using the `selector` function to transform
 * `value` to a Comparable instance for comparison.
 */
export function compareBy<T>(selector: Selector<T>): Comparator<T>;

/**
 * Creates a {@link Comparator} using the `selector` function to transform values
 * being compared and then applying the specified `comparator` to compare
 * transformed values.
 */
export function compareBy<T, K>(
	comparator: Comparator<K>,
	selector: (value: T) => K
): Comparator<T>;
export function compareBy<T, K>(...args: CompareArgs<T, K>): Comparator<T> {
	return new (class extends Comparator<T> {
		public override compare(a: T, b: T): number {
			if (Array.isArray(args[0])) {
				return compareValuesBy(a, b, ...args[0]);
			}

			if (args[0] instanceof Comparator) {
				const comparator = args[0];
				const selector = args[1] as (value: T) => K;

				return compareValuesBy(a, b, comparator, selector);
			}

			return compareValuesBy(a, b, args[0]);
		}
	})();
}
