import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { ModalProvider, PriceContext, PriceProvider } from "../../context";
import { customTestId, findRawValue } from "../../tests/utils";
import { filledPriceData } from "../../utils";
import { Home } from "./Home";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Home component", () => {
    render(
      <ModalProvider>
        <PriceProvider>
          <Home />
        </PriceProvider>
      </ModalProvider>,
    );

    const main = document.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main?.childElementCount).toBe(1);

    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();
    expect(container?.childElementCount).toBe(2);

    expect(document.querySelector("h1")?.textContent).toBe(
      "Delivery Order Price Calculator",
    );

    const priceBreakdown = screen.getByText("Price breakdown");
    expect(priceBreakdown).toBeInTheDocument();
  });

  test("raw-data to be null", async () => {
    render(
      <ModalProvider>
        <PriceProvider>
          <Home />
        </PriceProvider>
      </ModalProvider>,
    );

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

  test("renders DetailsForm component", () => {
    vi.clearAllMocks();

    render(
      <ModalProvider>
        <PriceContext.Provider
          value={{ priceData: null, setPriceData: vi.fn() }}
        >
          <Home />
        </PriceContext.Provider>
      </ModalProvider>,
    );

    const detailsFormElement = screen.queryByText(
      "Delivery Order Price Calculator",
    );
    expect(detailsFormElement).toBeVisible();

    const priceBreakdownElement = screen.queryByText("Price breakdown");
    expect(priceBreakdownElement).not.toBeVisible();
  });

  test("renders PriceBreakdown component", async () => {
    vi.clearAllMocks();

    render(
      <ModalProvider>
        <PriceContext.Provider
          value={{ priceData: filledPriceData, setPriceData: vi.fn() }}
        >
          <Home />
        </PriceContext.Provider>
      </ModalProvider>,
    );

    const detailsFormElement = screen.queryByText(
      "Delivery Order Price Calculator",
    );
    expect(detailsFormElement).not.toBeVisible();

    const priceBreakdownElement = screen.queryByText("Price breakdown");
    expect(priceBreakdownElement).toBeVisible();
  });

  test("doesnt find raw value element", () => {
    render(
      <ModalProvider>
        <PriceProvider>
          <Home />
        </PriceProvider>
      </ModalProvider>,
    );

    const random = findRawValue("random stuff");

    expect(random).toBe(null);
  });
});
