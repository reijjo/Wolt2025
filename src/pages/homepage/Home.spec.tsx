import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { ModalProvider, PriceProvider } from "../../context";
import { fetchSpecsMock, fetchVenueLocationMock } from "../../tests/mockData";
import { customTestId, findRawValue } from "../../tests/utils";
import { Home } from "./Home";

vi.mock("../../hooks/useApi", () => ({
  useApi: vi.fn(() => ({
    fetchSpecs: vi.fn().mockResolvedValue(fetchSpecsMock),
    fetchVenueLocation: vi.fn().mockResolvedValue(fetchVenueLocationMock),
    handleApiErrors: vi.fn(),
  })),
}));

beforeEach(() => {
  render(
    <ModalProvider>
      <PriceProvider>
        <Home />
      </PriceProvider>
    </ModalProvider>,
  );
});

describe("Home", () => {
  test("renders Home component", () => {
    const main = document.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main?.childElementCount).toBe(2);

    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();
    expect(container?.childElementCount).toBe(3);

    expect(document.querySelector("h1")?.textContent).toBe(
      "Delivery Order Price Calculator",
    );

    const priceBreakdown = screen.getByText("Price breakdown");
    expect(priceBreakdown).toBeInTheDocument();
  });

  test("raw-data to be null", async () => {
    const venue = customTestId("venueSlug");
    const value = customTestId("cartValue");
    const latitude = customTestId("userLatitude");
    const longitude = customTestId("userLongitude");

    expect(venue).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(latitude).toBeInTheDocument();
    expect(longitude).toBeInTheDocument();

    expect(findRawValue("Cart value")).toBe(null);
    expect(findRawValue("Delivery distance")).toBe(null);
    expect(findRawValue("Delivery fee")).toBe(null);
    expect(findRawValue("Small order surcharge")).toBe(null);
    expect(findRawValue("Total price")).toBe(null);
  });
});
