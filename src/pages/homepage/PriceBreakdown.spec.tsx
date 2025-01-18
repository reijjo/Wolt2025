import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { usePriceContext } from "../../context";
import { customTestId } from "../../tests/utils";
import { PriceData } from "../../utils";
import { PriceBreakdown } from "./PriceBreakdown";

vi.mock("../../context", () => ({
  usePriceContext: vi.fn(),
}));

describe("PriceBreakdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders PriceBreakdown component", () => {
    const mockData: PriceData = {
      cartValue: 1000,
      smallOrderSurcharge: 0,
      deliveryFee: 190,
      deliveryDistance: 177,
      totalPrice: 1190,
    };

    vi.mocked(usePriceContext).mockReturnValue({
      priceData: mockData,
      setPriceData: vi.fn(),
    });

    render(<PriceBreakdown />);

    expect(screen.getByText("Price breakdown")).toBeInTheDocument();

    const cartValue = document.querySelector("[data-test-id=cartValue]");
    const smallOrderSurcharge = customTestId("smallOrderSurcharge");
    const deliveryFee = customTestId("deliveryFee");
    const deliveryDistance = customTestId("deliveryDistance");
    const totalPrice = customTestId("totalPrice");

    expect(cartValue).toBeInTheDocument();
    expect(smallOrderSurcharge).toBeInTheDocument();
    expect(deliveryFee).toBeInTheDocument();
    expect(deliveryDistance).toBeInTheDocument();
    expect(totalPrice).toBeInTheDocument();

    const expectedData = [
      { key: "cartValue", value: "1000" },
      { key: "deliveryDistance", value: "177" },
      { key: "deliveryFee", value: "190" },
      { key: "smallOrderSurcharge", value: "0" },
      { key: "totalPrice", value: "1190" },
    ];

    const rawValueElements = screen
      .getAllByText(/.+/)
      .filter((element) => element.hasAttribute("data-raw-value"));

    expect(rawValueElements).toHaveLength(expectedData.length);
    expectedData.forEach((expected, index) => {
      const element = rawValueElements[index];
      expect(element).toHaveAttribute("data-raw-value", expected.value);

      const parentElement = element.closest(`[data-test-id="${expected.key}"]`);
      expect(parentElement).toBeInTheDocument();
    });

    const cartRaw = document.querySelector('span[data-raw-value="1000"]');
    expect(cartRaw).toBeInTheDocument();
  });

  test("sorts and displays items in correct order", () => {
    const mockData: PriceData = {
      totalPrice: 1190,
      cartValue: 1000,
      deliveryFee: 190,
      smallOrderSurcharge: 0,
      deliveryDistance: 177,
    };

    vi.mocked(usePriceContext).mockReturnValue({
      priceData: mockData,
      setPriceData: vi.fn(),
    });

    render(<PriceBreakdown />);

    const expectedOrder = [
      "Cart value",
      "Delivery distance",
      "Delivery fee",
      "Small order surcharge",
      "Total price",
    ];

    const labels = Array.from(document.querySelectorAll(".breakdown-item p"));
    const labelTexts = labels.map((label) => label.textContent);

    expect(labelTexts).toEqual(expectedOrder);
  });

  test("null data", () => {
    vi.mocked(usePriceContext).mockReturnValue({
      priceData: null,
      setPriceData: vi.fn(),
    });

    render(<PriceBreakdown />);

    const rawValueElements = screen
      .getAllByText(/.+/)
      .filter((element) => element.hasAttribute("data-raw-value"));

    rawValueElements.forEach((element) => {
      expect(element).toHaveAttribute("data-raw-value", "0");
    });
  });

  test("missing data fields", () => {
    const partialMockData = {
      cartValue: 1000,
      deliveryFee: 190,
      totalPrice: 1190,
    } as PriceData;

    vi.mocked(usePriceContext).mockReturnValue({
      priceData: partialMockData,
      setPriceData: vi.fn(),
    });

    render(<PriceBreakdown />);

    expect(
      document.querySelector('[data-test-id="cartValue"] span'),
    ).toHaveAttribute("data-raw-value", "0");
    expect(
      document.querySelector('[data-test-id="deliveryFee"] span'),
    ).toHaveAttribute("data-raw-value", "0");
    expect(
      document.querySelector('[data-test-id="totalPrice"] span'),
    ).toHaveAttribute("data-raw-value", "0");
    expect(
      document.querySelector('[data-test-id="smallOrderSurcharge"] span'),
    ).toHaveAttribute("data-raw-value", "0");
    expect(
      document.querySelector('[data-test-id="deliveryDistance"] span'),
    ).toHaveAttribute("data-raw-value", "0");
  });

  test("handles BIG numbers", () => {
    const mockData: PriceData = {
      cartValue: 999999999,
      smallOrderSurcharge: 999999,
      deliveryFee: 999999,
      deliveryDistance: 999999,
      totalPrice: 1001999997,
    };

    vi.mocked(usePriceContext).mockReturnValue({
      priceData: mockData,
      setPriceData: vi.fn(),
    });

    render(<PriceBreakdown />);

    expect(
      document.querySelector('[data-test-id="cartValue"] span'),
    ).toHaveAttribute("data-raw-value", "999999999");
    expect(screen.getByText("9999999.99 €")).toBeInTheDocument();
  });

  test("handles all zeros", () => {
    const mockData: PriceData = {
      cartValue: 0,
      smallOrderSurcharge: 0,
      deliveryFee: 0,
      deliveryDistance: 0,
      totalPrice: 0,
    };

    vi.mocked(usePriceContext).mockReturnValue({
      priceData: mockData,
      setPriceData: vi.fn(),
    });

    render(<PriceBreakdown />);

    const rawValueElements = screen
      .getAllByText(/.+/)
      .filter((element) => element.hasAttribute("data-raw-value"));

    rawValueElements.forEach((element) => {
      expect(element).toHaveAttribute("data-raw-value", "0");
    });

    const elements = {
      deliveryDistance: customTestId("deliveryDistance"),
      cartValue: customTestId("cartValue"),
      smallOrderSurcharge: customTestId("smallOrderSurcharge"),
      deliveryFee: customTestId("deliveryFee"),
      totalPrice: customTestId("totalPrice"),
    };

    Object.entries(elements).forEach(([key, element]) => {
      if (key !== "deliveryDistance") {
        expect(element).toHaveTextContent("0 €");
      } else {
        expect(element).toHaveTextContent("0 m");
      }
    });
  });
});
