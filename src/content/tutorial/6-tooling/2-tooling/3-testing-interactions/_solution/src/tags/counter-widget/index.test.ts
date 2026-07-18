import { fireEvent, render, screen } from "@marko/testing-library";
import { expect, test } from "vitest";
import CounterWidget from "./index.marko";

test("renders the starting count from its input", async () => {
  await render(CounterWidget, { start: 4 });

  expect(screen.getByText("Count is 4")).toBeTruthy();
});

test("counts up when the button is clicked", async () => {
  await render(CounterWidget, { start: 4 });

  await fireEvent.click(screen.getByText("Count is 4"));

  expect(screen.getByText("Count is 5")).toBeTruthy();
});
