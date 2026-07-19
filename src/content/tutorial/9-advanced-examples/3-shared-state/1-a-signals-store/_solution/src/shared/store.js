import { signal } from "@preact/signals-core";

export const count = signal(0);

export function increment() {
  count.value++;
}
export function decrement() {
  count.value--;
}
export function reset() {
  count.value = 0;
}
