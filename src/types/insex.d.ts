import type { Draft } from "immer";
import type { RippleInterface } from "../interfaces/ripple.interface";

declare function ripple<T>(initial: T): RippleInterface<T>;

declare namespace ripple {
  export function proxy<T extends object>(initial: T): RippleInterface<T>;
  export function primitive<T>(initial: T): RippleInterface<T>;

  export function immer<T extends object>(
    initial: T
  ): RippleInterface<T> & {
    update(recipe: (draft: Draft<T>) => void): void | Promise<void>;
  };
}

export = ripple;
