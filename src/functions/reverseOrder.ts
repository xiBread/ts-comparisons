import type { Comparable, Comparator } from '../';
import { ReverseOrderComparator } from '../util';

export function reverseOrder<T extends Comparable<T>>(): Comparator<T> {
	return new ReverseOrderComparator() as Comparator<T>;
}
