import { ripplePrimitive } from "./ripplePrimitive";
import type { produce as ImmerProduce, Draft } from "immer";

let produce: typeof import("immer").produce | undefined;

async function loadProduce(): Promise<typeof ImmerProduce> {
  if (produce) return produce;
  try {
    const immer = await import("immer");
    produce = immer.produce;
    return produce;
  } catch {
    throw new Error(
      "Immer is not installed. Run `npm i immer` or switch to the proxy-based ripple()."
    );
  }
}

export function createImmerStore<T extends object>(initial: T) {
  const root = ripplePrimitive<T>(initial);

  async function update(recipe: (draft: Draft<T>) => void) {
    const prod = await loadProduce();
    const next = prod(root.value, recipe);
    if (next !== root.value) root.value = next;
  }

  return Object.assign(root, { update });
}
