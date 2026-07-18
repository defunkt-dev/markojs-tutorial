import { fireEvent, render, screen } from "@marko/testing-library";
import { expect, test } from "vitest";
import CounterWidget from "./index.marko";

test("counts up when clicked", async () => {
  await render(CounterWidget, { start: 1 });

  await fireEvent.click(screen.getByRole("button"));

  expect(screen.getByText("Count is 2")).toBeTruthy();
});
