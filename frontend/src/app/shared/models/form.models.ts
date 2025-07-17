export type OnChangeControlFn<T> = (value: T) => void;
export type OnTouchedControlFn = () => void;

export type CompareFn<T> = (o1: T, o2: T) => boolean;
