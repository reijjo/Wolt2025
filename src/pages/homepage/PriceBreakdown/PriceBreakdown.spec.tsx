import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { usePriceContext } from "../../../context";
import { customTestId } from "../../../tests/utils";
import { PriceData, filledPriceData } from "../../../utils";
import { PriceBreakdown } from "../PriceBreakdown/PriceBreakdown";

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

vi.mock(import("../../../context"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    usePriceContext: vi.fn(),
  };
});

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

    const cartValue = document.querySelector("[data-test-id=cartValue-result]");
    const smallOrderSurcharge = customTestId("smallOrderSurcharge-result");
    const deliveryFee = customTestId("deliveryFee-result");
    const deliveryDistance = customTestId("deliveryDistance-result");
    const totalPrice = customTestId("totalPrice-result");

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

      const parentElement = element.closest(
        `[data-test-id="${expected.key}-result"]`,
      );
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
      expect(element).toHaveAttribute("data-raw-value", null);
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
      document.querySelector('[data-test-id="cartValue-result"] span'),
    ).not.toHaveAttribute("data-raw-value", "0");
    expect(
      document.querySelector('[data-test-id="deliveryFee-result"] span'),
    ).not.toHaveAttribute("data-raw-value", "0");
    expect(
      document.querySelector('[data-test-id="totalPrice-result"] span'),
    ).not.toHaveAttribute("data-raw-value", "0");
    expect(
      document.querySelector(
        '[data-test-id="smallOrderSurcharge-result"] span',
      ),
    ).not.toHaveAttribute("data-raw-value", "0");
    expect(
      document.querySelector('[data-test-id="deliveryDistance-result"] span'),
    ).not.toHaveAttribute("data-raw-value", "0");
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
      document.querySelector('[data-test-id="cartValue-result"] span'),
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
      deliveryDistance: customTestId("deliveryDistance-result"),
      cartValue: customTestId("cartValue-result"),
      smallOrderSurcharge: customTestId("smallOrderSurcharge-result"),
      deliveryFee: customTestId("deliveryFee-result"),
      totalPrice: customTestId("totalPrice-result"),
    };

    Object.entries(elements).forEach(([key, element]) => {
      if (key !== "deliveryDistance") {
        expect(element).toHaveTextContent("0 €");
      } else {
        expect(element).toHaveTextContent("0 m");
      }
    });
  });

  test("handles Order again button", () => {
    const setPriceData = vi.fn();

    vi.mocked(usePriceContext).mockReturnValue({
      priceData: filledPriceData,
      setPriceData,
    });

    render(<PriceBreakdown />);

    const orderAgainButton = screen.getByRole("button", {
      name: "Order again!",
    });

    orderAgainButton.click();

    expect(setPriceData).toHaveBeenCalledWith(null);
  });
});
