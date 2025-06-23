import { useEffect, useRef } from "react";
import { on } from "./eventBus";
import type { Ripple } from "./ripple";

type Handler = (
  payload?: any,
  tools?: { aborted: () => boolean }
) => void | Promise<any>;

interface Options {
  loadingSignal?: Ripple<boolean>;
  errorSignal?: Ripple<any>;
  [key: string]: any;
}

export function onRipple(event: string, handler: Handler, options?: Options) {
  const stableHandler = useRef(handler);
  useEffect(() => {
    stableHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    let cancelled = false;
    const tools = { aborted: () => cancelled };

    const wrapped = async (payload?: any) => {
      if (cancelled) return;

      const loadingSignal =
        options?.loadingSignal ?? (options?.loading as Ripple<boolean>);
      const errorSignal =
        options?.errorSignal ?? (options?.error as Ripple<any>);

      loadingSignal && (loadingSignal.value = true);
      errorSignal && (errorSignal.value = null);

      try {
        const result = stableHandler.current(payload, tools);
        if (result instanceof Promise) {
          const awaited = await result;

          if (awaited instanceof Response && !awaited.ok) {
            throw new Error(`HTTP ${awaited.status}: ${awaited.statusText}`);
          }
        }
      } catch (error) {
        if (errorSignal) {
          errorSignal.value = error;
        }
      } finally {
        if (loadingSignal) {
          loadingSignal.value = false;
        }
      }
    };

    const unsubscribe = on(event, wrapped);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [event]);
}
