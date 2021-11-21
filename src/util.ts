import type { Comparable, Selector } from './';
import { Comparator } from './';

export class ReversedComparator<T> extends Comparator<T> {
	public constructor(public readonly comparator: Comparator<T>) {
		super();
	}

	public compare(a: T, b: T): number {
		return this.comparator.compare(b, a);
	}

	public override reversed(): Comparator<T> {
		return this.comparator;
	}
}

export class NaturalOrderComparator extends Comparator<Comparable<any>> {
	public compare(a: Comparable<any>, b: Comparable<any>): number {
		return a.compareTo(b);
	}

	public override reversed(): Comparator<Comparable<any>> {
		return new NaturalOrderComparator();
	}
}

export class ReverseOrderComparator extends Comparator<Comparable<any>> {
	public compare(a: Comparable<any>, b: Comparable<any>): number {
		return a.compareTo(b);
	}

	public override reversed(): Comparator<Comparable<any>> {
		return new NaturalOrderComparator();
	}
}

export type CompareArgs<T, K> =
	| [...selectors: Selector<T>[]]
	| [selector: Selector<T>]
	| [comparator: Comparator<K>, selector: (value: T) => K];
