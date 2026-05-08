import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      json: {
        id: 1,
        product_id: "lumadock-studio",
        name: "Test User",
        email: "test@example.com",
        company: "Demo",
        role: "Learner",
        message: "E2E booking",
        configuration: {},
        created_at: new Date().toISOString(),
      },
      status: 201,
    });
  });
});

test("home, catalog, detail, and booking flow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LumaDock", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /产品目录/ }).click();
  await expect(page.getByRole("heading", { name: "LumaDock lineup" })).toBeVisible();

  await page.getByRole("link", { name: /LumaDock Studio/i }).click();
  await expect(page.getByRole("heading", { name: "LumaDock Studio" })).toBeVisible();
  await page.getByRole("link", { name: /Book LumaDock Studio/i }).click();

  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Company").fill("Demo");
  await page.getByLabel("Role").fill("Learner");
  await page.getByLabel("Project notes").fill("E2E booking");
  await page.getByLabel(/local demo/i).check();
  await page.getByRole("button", { name: /Send request/i }).click();

  await expect(page.getByText("Request saved locally.")).toBeVisible();
});
