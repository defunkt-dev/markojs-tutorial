import { fireEvent, render, screen } from "@marko/testing-library";
import { test } from "vitest";
import CounterWidget from "./index.marko";

test("counts up when clicked", async () => {
  const { container } = await render(CounterWidget, { start: 1 });

  const button = container.querySelector("button");
  fireEvent.click(button as any);

  screen.debug();
});
