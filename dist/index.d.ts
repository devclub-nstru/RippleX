type HandlerType = (payload?: any, tools?: {
    aborted: () => boolean;
}) => void | Promise<any>;

interface RippleInterface<T> {
    value: T;
    subscribe: (cb: () => void, selector?: (v: T) => unknown) => () => void;
    peek: () => T;
    brand: symbol;
}

interface OptionsInterface {
    loadingSignal?: RippleInterface<boolean>;
    errorSignal?: RippleInterface<string>;
    [key: string]: any;
}

declare function useRippleEffect(event: string, handler: HandlerType, options?: OptionsInterface): void;

declare function ripple<T>(initial: T): RippleInterface<T>;

declare function useRipple<T, S = T>(ripple: RippleInterface<T>, selector?: (value: T) => S): S;

type ListenerInterface = (payload?: any) => void;

declare function emit(event: string, payload?: string): void;
declare function on(event: string, handler: ListenerInterface): () => void;

export { type RippleInterface, emit, on, ripple, useRipple, useRippleEffect };
