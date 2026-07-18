import { expect, test } from "@playwright/test";

test("the server sends real HTML", async ({ request }) => {
  const response = await request.get("/");

  expect(await response.text()).toContain("Count is 4");
});

test("the button counts up in a real browser", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/");
  await page.getByRole("button").click();
  await page.getByRole("button").click();

  await expect(page.getByRole("button")).toHaveText(/Count is 6/);
  expect(errors).toEqual([]);
});

// TODO: add a test called "starts at four" that visits the page and
// asserts the button already reads "Count is 4" before any clicking.
