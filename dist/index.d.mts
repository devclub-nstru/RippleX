import { Draft } from 'immer';

declare function ripplePrimitive<T>(initial: T): RippleInterface<T>;

interface RippleWithImmerUpdate<T> extends RippleInterface<T> {
    update(recipe: (draft: Draft<T>) => void | Promise<void>): Promise<void>;
}
interface RippleInterface<T> {
    value: T;
    subscribe: (cb: () => void, selector?: (v: T) => unknown) => () => void;
    peek: () => T;
    brand: symbol;
}
interface RippleFunctionInterface {
    <T>(initial: T): RippleInterface<T>;
    proxy: <T extends object>(initial: T) => RippleInterface<T>;
    primitive: typeof ripplePrimitive;
    immer: <T extends object>(initial: T) => RippleWithImmerUpdate<T>;
}

type HandlerType = (payload?: any, tools?: {
    aborted: () => boolean;
}) => void | Promise<any>;

interface OptionsInterface {
    loadingSignal?: RippleInterface<boolean>;
    errorSignal?: RippleInterface<string>;
    [key: string]: any;
}

declare function useRippleEffect(event: string, handler: HandlerType, options?: OptionsInterface | RippleInterface<any>): void;

declare const ripple: RippleFunctionInterface;

declare function useRipple<T, S = T>(ripple: RippleInterface<T>, selector?: (value: T) => S): S;

type ListenerInterface = (payload?: any) => void;

declare function emit(event: string, payload?: string): void;
declare function on(event: string, handler: ListenerInterface): () => void;

export { type RippleInterface, emit, on, ripple, useRipple, useRippleEffect };
