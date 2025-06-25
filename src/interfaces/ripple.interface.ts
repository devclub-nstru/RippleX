export interface RippleInterface<T> {
  value: T;
  subscribe: (cb: () => void, selector?: (v: T) => unknown) => () => void;
  peek: () => T;
  brand: symbol;
}
