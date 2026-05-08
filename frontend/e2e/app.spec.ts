import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth/login", async (route) => {
    const body = route.request().postDataJSON() as { email: string; password: string };
    const isAdmin = body.email === "admin@lumadock.local" && body.password === "admin123";
    const isViewer = body.email === "viewer@lumadock.local" && body.password === "viewer123";

    if (!isAdmin && !isViewer) {
      await route.fulfill({
        contentType: "application/json",
        json: { detail: "Invalid email or password" },
        status: 401,
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      json: {
        access_token: isAdmin ? "admin-token" : "viewer-token",
        token_type: "bearer",
        user: {
          email: body.email,
          id: isAdmin ? 1 : 2,
          name: isAdmin ? "LumaDock Admin" : "LumaDock Viewer",
          role: isAdmin ? "admin" : "viewer",
        },
      },
      status: 200,
    });
  });

  await page.route("**/api/admin/leads", async (route) => {
    if (route.request().headers().authorization !== "Bearer admin-token") {
      await route.fulfill({
        contentType: "application/json",
        json: { detail: "Insufficient permissions" },
        status: 403,
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      json: [
        {
          id: 1,
          product_id: "lumadock-studio",
          product_name: "LumaDock Studio",
          name: "Test User",
          email: "test@example.com",
          company: "Demo",
          role: "Learner",
          message: "E2E booking",
          configuration: { finish: "graphite" },
          created_at: new Date().toISOString(),
        },
      ],
      status: 200,
    });
  });

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
