import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("home, catalog, detail, and booking flow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LumaDock", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Explore products/i }).click();
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

  await expect(
    page.locator(".inline-success", { hasText: "Request saved locally." }),
  ).toBeVisible();
});

test("admin login opens the protected lead console", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await page.getByLabel("Email").fill("admin@lumadock.local");
  await page.getByLabel("Password").fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("heading", { name: "Lead console" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole("cell", { name: "Test User" })).toBeVisible();
});

test("viewer login is blocked from admin leads", async ({ page }) => {
  await page.goto("/admin");

  await page.getByLabel("Email").fill("viewer@lumadock.local");
  await page.getByLabel("Password").fill("viewer123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("No access")).toBeVisible();
});

test("configurator priority can be reordered from the keyboard", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const priorityList = page.getByRole("list", { name: "Configuration priority" }).first();
  await expect(priorityList.getByRole("listitem").nth(1)).toContainText("Stand");

  await priorityList.getByRole("button", { name: "Move Profile earlier" }).focus();
  await page.keyboard.press("Enter");

  await expect(priorityList.getByRole("listitem").nth(1)).toContainText("Profile");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include(".priority-list")
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("home page supports keyboard entry and has no critical a11y violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LumaDock", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .exclude(".product-scene")
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
