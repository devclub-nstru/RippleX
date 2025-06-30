import { ripplePrimitive } from "../utils/ripplePrimitive";
import type { Draft } from "immer";

interface RippleWithImmerUpdate<T> extends RippleInterface<T> {
  update(recipe: (draft: Draft<T>) => void | Promise<void>): Promise<void>;
}

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
  immer: <T extends object>(initial: T) => RippleWithImmerUpdate<T>;
}
