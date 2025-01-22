import { expect, test } from "@playwright/test";

import { exampleInputs } from "../../src/tests/utils";
import { inputErrors } from "../../src/utils";

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

  test("finds price breakdown and raw-data null values", async ({ page }) => {
    const header = page.locator("h2");
    const rawValues = page.locator("[data-raw-value]");

    await expect(header).toHaveText("Price breakdown");
    await expect(rawValues).toHaveCount(0);
  });
});

test.describe("FORM FIELDS", () => {
  test("submits form with valid values", async ({ page }) => {
    const venue = page.locator('[data-test-id="venueSlug"]');
    const cart = page.locator('[data-test-id="cartValue"]');
    const userLatitude = page.locator('[data-test-id="userLatitude"]');
    const userLongitude = page.locator('[data-test-id="userLongitude"]');
    const calculate = page.getByRole("button", { name: /calculate/i });

    await venue.fill(exampleInputs.venueSlug);
    await cart.fill(exampleInputs.cartValue.toString());
    await userLatitude.fill(exampleInputs.userLatitude.toString());
    await userLongitude.fill(exampleInputs.userLongitude.toString());

    await calculate.click();

    const loading = page.getByText("Loading...");
    const allGood = page.getByText(/thanks for the order/i);
    await expect(loading).toBeVisible();
    await expect(allGood).toBeVisible();

    const rawValues = page.locator("[data-raw-value]");
    await expect(rawValues).toHaveCount(5);

    const cartRaw = rawValues.nth(0);
    const cartRawData = await cartRaw.getAttribute("data-raw-value");
    const cartData = await cartRaw.textContent();
    expect(cartRawData).toBe("1000");
    expect(cartData).toBe("10.00 €");

    expect(await rawValues.nth(1).getAttribute("data-raw-value")).toBe("1121");
    expect(await rawValues.nth(1).textContent()).toBe("1.12 km");
    expect(await rawValues.nth(2).getAttribute("data-raw-value")).toBe("390");
    expect(await rawValues.nth(2).textContent()).toBe("3.90 €");
    expect(await rawValues.nth(3).getAttribute("data-raw-value")).toBe("0");
    expect(await rawValues.nth(3).textContent()).toBe("0.00 €");
    expect(await rawValues.nth(4).getAttribute("data-raw-value")).toBe("1390");
    expect(await rawValues.nth(4).textContent()).toBe("13.90 €");
    expect(await rawValues.nth(4).getAttribute("data-raw-value")).not.toBe(
      "13.90",
    );
  });

  test("shows input errors", async ({ page }) => {
    const venue = page.locator('[data-test-id="venueSlug"]');
    const cart = page.locator('[data-test-id="cartValue"]');
    const userLatitude = page.locator('[data-test-id="userLatitude"]');
    const userLongitude = page.locator('[data-test-id="userLongitude"]');
    const calculate = page.getByRole("button", { name: /calculate/i });

    await venue.fill("");
    await expect(venue).toBeEmpty();
    await venue.fill("turku");
    await expect(page.getByText(inputErrors.venueInvalid)).toBeVisible();
    await venue.fill("home-assignment-venue-tallinn");

    await cart.fill("-3");
    await expect(page.getByText(inputErrors.cartInvalid)).toBeVisible();
    await cart.fill("0.000001");
    await expect(page.getByText(inputErrors.cartRequired)).toBeVisible();
    await cart.fill("aaa");
    await expect(page.getByText(inputErrors.cartInvalid)).toBeVisible();
    await cart.fill("0.01");
    await expect(page.getByText(inputErrors.cartInvalid)).not.toBeVisible();
    await cart.fill("10");

    await userLatitude.fill("IM NOT A LATITUDE");
    await expect(page.getByText(inputErrors.latitudeNotNumber)).toBeVisible();
    await userLatitude.fill(exampleInputs.userLatitude.toString());

    await userLongitude.fill("-240");
    await expect(page.getByText(inputErrors.longitudeInvalid)).toBeVisible();
    await userLongitude.fill(exampleInputs.userLongitude.toString());

    await expect(calculate).not.toBeDisabled();
    await calculate.click();

    await expect(page.getByText("Loading...")).toBeVisible();
    await expect(
      page.getByText(/delivery distance out of range/i),
    ).toBeVisible();
  });

  test("gets location", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: {
        latitude: exampleInputs.userLatitude,
        longitude: exampleInputs.userLongitude,
      },
    });

    const page = await context.newPage();
    await page.goto("http://localhost:5173");

    const venue = page.locator('[data-test-id="venueSlug"]');
    const cart = page.locator('[data-test-id="cartValue"]');
    const userLatitude = page.locator('[data-test-id="userLatitude"]');
    const userLongitude = page.locator('[data-test-id="userLongitude"]');
    const getLocation = page.locator('[data-test-id="getLocation"]');
    const calculate = page.getByRole("button", { name: /calculate/i });

    await venue.fill(exampleInputs.venueSlug);
    await cart.fill(exampleInputs.cartValue.toString());

    await getLocation.click();

    await expect(userLatitude).not.toBeEmpty();
    await expect(userLongitude).not.toBeEmpty();

    await calculate.click();

    const rawValues = page.locator("[data-raw-value]");
    expect(await rawValues.nth(1).getAttribute("data-raw-value")).toBe("1121");
    expect(await rawValues.nth(1).textContent()).toBe("1.12 km");
  });

  test("gets location by IP", async ({ browser }) => {
    const context = await browser.newContext({
      permissions: [],
      geolocation: { latitude: 0, longitude: 0 },
    });

    const page = await context.newPage();
    await page.goto("http://localhost:5173");

    const venue = page.locator('[data-test-id="venueSlug"]');
    const cart = page.locator('[data-test-id="cartValue"]');
    const userLatitude = page.locator('[data-test-id="userLatitude"]');
    const userLongitude = page.locator('[data-test-id="userLongitude"]');
    const getLocation = page.locator('[data-test-id="getLocation"]');
    const calculate = page.getByRole("button", { name: /calculate/i });

    const ipButton = page.getByRole("button", { name: "Use IP" });
    const cancelButton = page.getByRole("button", { name: /go back/i });

    await venue.fill(exampleInputs.venueSlug);
    await cart.fill(exampleInputs.cartValue.toString());

    await getLocation.click();
    await page.waitForTimeout(300);

    await expect(cancelButton).toBeVisible({ timeout: 10000 });
    await expect(ipButton).toBeVisible({ timeout: 10000 });

    await cancelButton.click();
    await page.waitForTimeout(300);

    await expect(ipButton).not.toBeVisible();
    await expect(cancelButton).not.toBeVisible();

    await getLocation.click();
    await page.waitForTimeout(300);

    await expect(ipButton).toBeVisible({ timeout: 10000 });
    await expect(cancelButton).toBeVisible({ timeout: 10000 });

    await ipButton.click();
    await page.waitForTimeout(300);
    await expect(ipButton).not.toBeVisible();

    await expect(userLatitude).not.toHaveValue("911");
    await expect(userLongitude).not.toHaveValue("112");

    await userLatitude.fill(exampleInputs.userLatitude.toString());
    await userLongitude.fill(exampleInputs.userLongitude.toString());

    await calculate.click();

    const rawValues = page.locator("[data-raw-value]");
    expect(await rawValues.nth(1).getAttribute("data-raw-value")).toBe("1121");
    expect(await rawValues.nth(1).textContent()).toBe("1.12 km");
  });
});
