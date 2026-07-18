import type { Meta, Story } from "@storybook/marko";
import CounterWidget, { type Input } from "./index.marko";

export default {
  title: "CounterWidget",
  component: CounterWidget,
} satisfies Meta<Input>;

export const Default: Story<Input> = {};

export const StartAtTen: Story<Input> = {
  args: { start: 10 },
};

// TODO: add a third story called `Renamed` that passes a `label` of "Clicks".
