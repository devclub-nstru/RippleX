import { ripplePrimitive } from "../utils/ripplePrimitive";

export interface RippleInterface<T> {
  value: T;
  subscribe: (cb: () => void, selector?: (v: T) => unknown) => () => void;
  peek: () => T;
  brand: symbol;
}

export interface RippleFunctionInterface {
  <T>(initial: T): RippleInterface<T>;
  proxy: <T extends object>(initial: T) => RippleInterface<T>;
  primitive: typeof ripplePrimitive;
}
