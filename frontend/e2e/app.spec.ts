import { expect, test } from "@playwright/test";

test("home, catalog, detail, and booking flow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LumaDock", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /(产品目录|Products)/ }).click();
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

test("admin login opens the protected lead console", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await page.getByLabel("Email").fill("admin@lumadock.local");
  await page.getByLabel("Password").fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("heading", { name: "Lead console" })).toBeVisible();
  await expect(page.getByText("Test User")).toBeVisible();
});

test("viewer login is blocked from admin leads", async ({ page }) => {
  await page.goto("/admin");

  await page.getByLabel("Email").fill("viewer@lumadock.local");
  await page.getByLabel("Password").fill("viewer123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("No access")).toBeVisible();
});
