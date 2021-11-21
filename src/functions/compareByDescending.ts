import { Comparator } from '../';
import type { Selector } from '../Comparator';
import { compareValuesBy } from './';

/**
 * Creates a descending Comparator using the `selector` function to transform
 * `value` to a Comparable instance for comparison.
 */
export function compareByDescending<T>(selector: Selector<T>): Comparator<T>;

/**
 * Creates a descending Comparator using the `selector` function to transform
 * values being compared and then applying the specified `comparator` to compare
 * transformed values.
 */
export function compareByDescending<T, K>(comparator: Comparator<K>, selector: (value: T) => K): Comparator<T>;
export function compareByDescending<T, K>($1: Selector<T> | Comparator<K>, $2?: (value: T) => K): Comparator<T> {
	return new (class extends Comparator<T> {
		public compare(a: T, b: T): number {
			if ($1 instanceof Comparator) {
				return compareValuesBy(b, a, $1, $2!);
			}

			return compareValuesBy(b, a, $1);
		}
	})();
}
