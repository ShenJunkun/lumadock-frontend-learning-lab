import { expect, test, type Page } from "@playwright/test";

async function stabilizePage(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("lumadock.theme", "light");
    window.localStorage.setItem("lumadock.language", "en");
  });

  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "reduce",
  });

  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0s !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      .product-scene canvas {
        visibility: hidden !important;
      }
    `,
  });
}

async function expectPageScreenshot(page: Page, name: string) {
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    maxDiffPixelRatio: 0.04,
  });
}

test.beforeEach(async ({ page }) => {
  await stabilizePage(page);
});

test("home page visual baseline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "LumaDock", exact: true })).toBeVisible();

  await expectPageScreenshot(page, "home-page.png");
});

test("catalog page visual baseline", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "LumaDock lineup" })).toBeVisible();

  await expectPageScreenshot(page, "catalog-page.png");
});

test("product detail page visual baseline", async ({ page }) => {
  await page.goto("/products/lumadock-studio");
  await expect(page.getByRole("heading", { name: "LumaDock Studio" })).toBeVisible();

  await expectPageScreenshot(page, "product-detail-page.png");
});

test("booking page visual baseline", async ({ page }) => {
  await page.goto("/book?product=lumadock-studio");
  await expect(page.getByRole("heading", { name: "Reserve a LumaDock walkthrough" })).toBeVisible();

  await expectPageScreenshot(page, "booking-page.png");
});

test("login page visual baseline", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

  await expectPageScreenshot(page, "login-page.png");
});

test("admin page visual baseline", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@lumadock.local");
  await page.getByLabel("Password").fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("heading", { name: "Lead console" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole("cell", { name: "Test User" })).toBeVisible();

  await expectPageScreenshot(page, "admin-page.png");
});

test("not found page visual baseline", async ({ page }) => {
  await page.goto("/missing-route");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await expectPageScreenshot(page, "not-found-page.png");
});
