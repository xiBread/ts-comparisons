import { compareValuesBy } from './';
import { NaturalOrderComparator, ReversedComparator, ReverseOrderComparator } from './util';

export type Selector<T> = (value: T) => Comparable<unknown> | null;

export interface Comparable<T> {
	compareTo(arg: T): number;
}

export abstract class Comparator<T> {
	public abstract compare(a: T, b: T): number;

	/**
	 * Returns a Comparator that imposes the reverse ordering of this
	 * Comparator.
	 */
	public reversed(): Comparator<T> {
		if (this instanceof ReversedComparator) {
			return this.comparator;
		}

		if (this instanceof NaturalOrderComparator) {
			return new ReverseOrderComparator() as unknown as Comparator<T>;
		}

		if (this instanceof ReverseOrderComparator) {
			return new NaturalOrderComparator() as unknown as Comparator<T>;
		}

		return new ReversedComparator(this);
	}

	/**
	 * Combines this Comparator and the given `comparator` such that the latter
	 * is applied only when the former considered values equal.
	 */
	public then(comparator: Comparator<T>): Comparator<T> {
		const qualifiedThis = this;

		return new (class extends Comparator<T> {
			public compare(a: T, b: T): number {
				const previousCompare = qualifiedThis.compare(a, b);

				return previousCompare !== 0 ? previousCompare : comparator.compare(a, b);
			}
		})();
	}

	/**
	 * Creates a Comparator comparing values after the primary Comparator defined
	 * them equal. It uses the `selector` function to transform `value` to a
	 * {@link Comparable} instance for comparison.
	 */
	public thenBy(selector: Selector<T>): Comparator<T>;

	/**
	 * Creates a Comparator comparing values after the primary Comparator defined
	 * them equal. It uses the `selector` function to transform values and then
	 * compares them with the given `comparator`.
	 */
	public thenBy<K>(comparator: Comparator<K>, selector: (value: T) => K): Comparator<T>;
	public thenBy<K>($1: Selector<T> | Comparator<K>, $2?: (value: T) => K): Comparator<T> {
		const qualifiedThis = this;

		return new (class extends Comparator<T> {
			public compare(a: T, b: T): number {
				const previousCompare = qualifiedThis.compare(a, b);

				if (previousCompare !== 0) {
					return previousCompare;
				}

				if ($1 instanceof Comparator) {
					return compareValuesBy(a, b, $1, $2!);
				}

				return compareValuesBy(a, b, $1);
			}
		})();
	}

	/**
	 * Creates a descending Comparator using the primary Comparator and the
	 * `selector` function to transform `value` to a {@link Comparable} instance
	 * for comparison.
	 */
	public thenByDescending(selector: Selector<T>): Comparator<T>;

	/**
	 * Creates a descending Comparator comparing values after the primary
	 * Comparator defined them equal. It uses the `selector` function to transform
	 * values and then compares them with the given `comparator`.
	 */
	public thenByDescending<K>(comparator: Comparator<K>, selector: (value: T) => K): Comparator<T>;
	public thenByDescending<K>($1: Selector<T> | Comparator<K>, $2?: (value: T) => K): Comparator<T> {
		const qualifiedThis = this;

		return new (class extends Comparator<T> {
			public compare(a: T, b: T): number {
				const previousCompare = qualifiedThis.compare(a, b);

				if (previousCompare !== 0) {
					return previousCompare;
				}

				if ($1 instanceof Comparator) {
					return compareValuesBy(b, a, /* comparator: */ $1, /* selector: */ $2!);
				}

				return compareValuesBy(b, a, /* selector: */ $1);
			}
		})();
	}

	/**
	 * Creates a Comparator using the primary Comparator and the `comparison`
	 * function to calculate a result of comparison.
	 */
	public thenComparator(comparison: (a: T, b: T) => number): Comparator<T> {
		const qualifiedThis = this;

		return new (class extends Comparator<T> {
			public compare(a: T, b: T): number {
				const previousCompare = qualifiedThis.compare(a, b);

				return previousCompare !== 0 ? previousCompare : comparison(a, b);
			}
		})();
	}

	/**
	 * Combines this Comparator and the given `comparator` such that the latter
	 * is applied only when the former considered values equal.
	 */
	public thenDescending(comparator: Comparator<T>): Comparator<T> {
		const qualifiedThis = this;

		return new (class extends Comparator<T> {
			public compare(a: T, b: T): number {
				const previousCompare = qualifiedThis.compare(a, b);

				return previousCompare !== 0 ? previousCompare : comparator.compare(b, a);
			}
		})();
	}
}
