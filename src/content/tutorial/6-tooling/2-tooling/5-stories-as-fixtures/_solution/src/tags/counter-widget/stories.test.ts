import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect, test } from "vitest";
import * as stories from "./counter.stories";

const { Default, StartAtTen } = composeStories(stories);

test("a no-args story renders", async () => {
  await render(Default);

  expect(screen.getByText("Count is 0")).toBeTruthy();
});

test("the story's args reach the tag", async () => {
  await render(StartAtTen);

  expect(screen.getByText("Count is 10")).toBeTruthy();
});

test("render-time input still wins over the story's args", async () => {
  await render(StartAtTen, { start: 42 });

  expect(screen.getByText("Count is 42")).toBeTruthy();
});
