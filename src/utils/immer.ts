import { ripplePrimitive } from "./ripplePrimitive";
import { produce, Draft } from "immer"; 

export function createImmerStore<T extends object>(initial: T) {
  const root = ripplePrimitive<T>(initial);

  function update(recipe: (draft: Draft<T>) => void) {
    const next = produce(root.value, recipe);
    if (next !== root.value) root.value = next;
  }

  return Object.assign(root, { update });
}
