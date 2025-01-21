import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.context().clearCookies();
  await page.context().clearPermissions();
});

test.describe("HOMEPAGE", () => {
  test("should display header and form", async ({ page }) => {
    const header = page.locator("h1");
    const form = page.locator("form");

    await expect(header).toBeVisible();
    await expect(form).toBeVisible();
  });

  test("finds all important stuff", async ({ page }) => {
    const venue = page.locator('[data-test-id="venueSlug"]');
    const cart = page.locator('[data-test-id="cartValue"]');
    const userLatitude = page.locator('[data-test-id="userLatitude"]');
    const userLongitude = page.locator('[data-test-id="userLongitude"]');
    const getLocation = page.locator('[data-test-id="getLocation"]');

    await expect(venue).toBeVisible();
    await expect(cart).toBeVisible();
    await expect(userLatitude).toBeVisible();
    await expect(userLongitude).toBeVisible();
    await expect(getLocation).toBeVisible();
  });

  test("finds price breakdown and null values", async ({ page }) => {
    const header = page.locator("h5");

    await expect(header).toHaveText("Price breakdown");
  });
});
