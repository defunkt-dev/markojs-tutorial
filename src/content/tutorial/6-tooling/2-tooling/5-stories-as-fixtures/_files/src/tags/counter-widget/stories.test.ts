import { render, screen } from "@marko/testing-library";
import { expect, test } from "vitest";
import { StartAtTen } from "./counter.stories";

test("the story's args reach the tag", async () => {
  await render(StartAtTen);

  expect(screen.getByText("Count is 10")).toBeTruthy();
});
