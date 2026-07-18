import { render, screen } from "@marko/testing-library";
import { expect, test } from "vitest";
import CounterWidget from "./index.marko";

test("renders the starting count from its input", async () => {
  await render(CounterWidget);

  expect(screen.getByText("Count is 4")).toBeTruthy();
});
