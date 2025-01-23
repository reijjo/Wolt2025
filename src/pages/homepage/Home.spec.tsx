import React from "react";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { ModalProvider, PriceProvider, usePriceContext } from "../../context";
import { customTestId, findRawValue } from "../../tests/utils";
import { PriceData } from "../../utils";
import { Home } from "./Home";

beforeEach(() => {
  vi.clearAllMocks();

  // render(
  //   <ModalProvider>
  //     <PriceProvider>
  //       <Home />
  //     </PriceProvider>
  //   </ModalProvider>,
  // );
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

    vi.spyOn(React, "useContext").mockReturnValue({
      priceData: null,
      setPriceData: vi.fn(),
    });

    render(
      <ModalProvider>
        <PriceProvider>
          <Home />
        </PriceProvider>
      </ModalProvider>,
    );

    expect(screen.getByText("Delivery Order Price Calculator")).toBeVisible();
    expect(screen.queryByText("Price breakdown")).not.toBeVisible();
  });

  test.skip("renders PriceBreakdown component", async () => {
    const mockData: PriceData = {
      cartValue: 1000,
      smallOrderSurcharge: 0,
      deliveryFee: 190,
      deliveryDistance: 177,
      totalPrice: 1190,
    };

    vi.clearAllMocks();

    vi.mocked(usePriceContext).mockReturnValue({
      priceData: mockData,
      setPriceData: vi.fn(),
    });

    render(
      <ModalProvider>
        <PriceProvider>
          <Home />
        </PriceProvider>
      </ModalProvider>,
    );

    expect(
      screen.queryByText("Delivery Order Price Calculator"),
    ).not.toBeVisible();
    expect(screen.getByText("Price breakdown")).toBeVisible();
  });
});
