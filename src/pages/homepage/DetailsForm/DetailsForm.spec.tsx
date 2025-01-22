import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  ModalProvider,
  PriceProvider,
  usePriceContext,
} from "../../../context";
import { useApi } from "../../../hooks/useApi";
import { usePriceCalculations } from "../../../hooks/usePriceCalculations";
import { useValidInputs } from "../../../hooks/useValidInputs";
import {
  fetchSpecsMock,
  fetchVenueLocationMock,
} from "../../../tests/mockData";
import { customTestId, exampleInputs } from "../../../tests/utils";
import { PriceData, inputErrors } from "../../../utils";
import { DetailsForm } from "./DetailsForm";

const mockData: PriceData = {
  cartValue: 0,
  smallOrderSurcharge: 0,
  deliveryFee: 0,
  deliveryDistance: 0,
  totalPrice: 0,
};

beforeEach(() => {
  render(
    <ModalProvider>
      <PriceProvider>
        <DetailsForm />
      </PriceProvider>
    </ModalProvider>,
  );
});

describe("DetailsForm", () => {
  const setUserInputMock = vi.fn();

  vi.mock("../../../hooks/useGetLocation", () => ({
    useGetLocation: vi.fn(({ setUserInputs }) => {
      setUserInputMock.mockImplementation(setUserInputs);

      return {
        getBrowserLocation: vi.fn(),
        getIpLocation: vi.fn(),
        useIp: false,
      };
    }),
  }));

  vi.mock(import("../../../hooks/useGetLocation"), async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useGetLocation: vi.fn(() => ({
        getBrowserLocation: vi.fn(),
        getIpLocation: vi.fn(),
        useIp: false,
        setUseIp: vi.fn(),
      })),
    };
  });

  vi.mock(import("../../../context"), async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useModalContext: vi.fn(() => ({
        openModal: vi.fn(),
        closeModal: vi.fn(),
        modalContent: null,
        isModalOpen: false,
      })),
    };
  });

  test("renders DetailsForm component", () => {
    const form = customTestId("formDetails");
    expect(form).toBeInTheDocument();
  });

  test("finds all critical elements", () => {
    const venue = customTestId("venueSlug");
    const cart = customTestId("cartValue");
    const userLat = customTestId("userLatitude");
    const userLot = customTestId("userLongitude");
    const location = customTestId("getLocation");

    expect(venue).toBeInTheDocument();
    expect(cart).toBeInTheDocument();
    expect(userLat).toBeInTheDocument();
    expect(userLot).toBeInTheDocument();
    expect(location).toBeInTheDocument();
  });

  test("form accepts valid inputs", async () => {
    const user = userEvent.setup();

    const venue = customTestId("venueSlug");
    const cart = customTestId("cartValue");
    const userLat = customTestId("userLatitude");
    const userLot = customTestId("userLongitude");
    const calculate = screen.getByRole("button", { name: /calculate/i });

    expect(calculate).toBeInTheDocument();
    expect(calculate).toBeDisabled();

    await user.type(venue, exampleInputs.venueSlug);
    await user.type(cart, exampleInputs.cartValue.toString());
    await user.type(userLat, exampleInputs.userLatitude.toString());
    await user.type(userLot, exampleInputs.userLongitude.toString());

    expect(calculate).not.toBeDisabled();
  });

  test("invalid venue", async () => {
    const user = userEvent.setup();

    const venue = customTestId("venueSlug");
    expect(venue).toBeInTheDocument();

    await user.type(venue, "turku");
    expect(screen.getByText(inputErrors.venueInvalid)).toBeInTheDocument();

    await user.clear(venue);
    await user.type(venue, "home-assignment-venue-helsinki");
    expect(screen.queryByText(inputErrors.venueInvalid)).toBeNull();
  });

  test("invalid cart value", async () => {
    const user = userEvent.setup();

    const cart = customTestId("cartValue");
    expect(cart).toBeInTheDocument();

    await user.type(cart, "1000");
    expect(screen.queryByText(inputErrors.cartInvalid)).toBeNull();

    await user.clear(cart);
    await user.type(cart, "10,00");
    expect(screen.getByText(inputErrors.cartComma)).toBeInTheDocument();
    await user.clear(cart);
    await user.type(cart, "10.00");
    expect(screen.queryByText(inputErrors.cartComma)).toBeNull();

    await user.clear(cart);
    await user.type(cart, "0");
    expect(screen.getByText(inputErrors.cartRequired)).toBeInTheDocument();
  });

  test("invalid user latitude", async () => {
    const user = userEvent.setup();

    const userLat = customTestId("userLatitude");
    expect(userLat).toBeInTheDocument();

    await user.type(userLat, "-90.000001");
    expect(screen.getByText(inputErrors.latitudeInvalid)).toBeInTheDocument();
  });

  test("invalid user longitude", async () => {
    const user = userEvent.setup();
    const userLot = customTestId("userLongitude");

    expect(userLot).toBeInTheDocument();
    await user.type(userLot, "10.00");
    expect(screen.queryByText(inputErrors.longitudeInvalid)).toBeNull();
  });
});

describe("DetailsForm Calculations & APIs", () => {
  const { validateUserInputs } = useValidInputs();

  vi.mock(import("../../../context"), async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      usePriceContext: vi.fn(() => ({
        priceData: mockData,
        setPriceData: vi.fn(),
      })),
    };
  });

  vi.mock("../../hooks/useApi", () => ({
    useApi: vi.fn(() => ({
      fetchSpecs: vi.fn().mockResolvedValue(fetchSpecsMock),
      fetchVenueLocation: vi.fn().mockResolvedValue(fetchVenueLocationMock),
      handleApiErrors: vi.fn(),
    })),
  }));

  const { fetchSpecs, fetchVenueLocation } = useApi();
  const { result } = renderHook(() => usePriceCalculations());

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePriceContext).mockReturnValue({
      priceData: mockData,
      setPriceData: vi.fn(),
    });
  });

  test("fetch venue", async () => {
    const result = await fetchVenueLocation(exampleInputs.venueSlug);
    expect(result).toEqual(fetchVenueLocationMock);
  });

  test("fetch delivery specs", async () => {
    const result = await fetchSpecs(exampleInputs.venueSlug);
    expect(result).toEqual(fetchSpecsMock);
  });

  test("correct inputs", async () => {
    await act(async () => {
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs, distance } = orderInfo;

      expect(specs).toEqual(fetchSpecsMock);

      const price = result.current.getPrice(exampleInputs, distance, specs);
      expect(price.totalPrice).toBe(1390);
    });
  });

  test("invalid cart - negative'", async () => {
    await act(async () => {
      const inputs = {
        ...exampleInputs,
        cartValue: -10.0,
      };
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const validationResult = validateUserInputs(inputs);
      if (!validationResult.isValid) {
        expect(validationResult.errors.cartValue).toBe(
          "Cart minimum value is 0.01",
        );
        return;
      }

      const price = result.current.getPrice(inputs, 100, specs);
      expect(price.totalPrice).toBe(null);
    });
  });

  test("invalid cart - 0'", async () => {
    await act(async () => {
      const inputs = {
        ...exampleInputs,
        cartValue: 0,
      };
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const validationResult = validateUserInputs(inputs);
      if (!validationResult.isValid) {
        expect(validationResult.errors.cartValue).toBe(
          "Cart minimum value is 0.01",
        );
        return;
      }

      const price = result.current.getPrice(inputs, 100, specs);
      expect(price.totalPrice).toBe(null);
    });
  });

  test("cart value 0.01", async () => {
    await act(async () => {
      const inputs = {
        ...exampleInputs,
        cartValue: 0.01,
      };
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const validationResult = validateUserInputs(inputs);
      if (!validationResult.isValid) {
        expect(validationResult.errors.cartValue).toBe(
          "Cart value must be at least 0.1",
        );
        return;
      }

      const price = result.current.getPrice(inputs, 100, specs);
      expect(price.smallOrderSurcharge).toBe(999);
    });
  });

  test("cart value 10", async () => {
    await act(async () => {
      const inputs = {
        ...exampleInputs,
        cartValue: 10,
      };
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const validationResult = validateUserInputs(inputs);
      if (!validationResult.isValid) {
        return;
      }

      const price = result.current.getPrice(inputs, 100, specs);
      expect(price.smallOrderSurcharge).toBe(0);
    });
  });

  test("valid latitude", async () => {
    await act(async () => {
      const inputs = {
        ...exampleInputs,
        userLatitude: 90,
      };
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const validationResult = validateUserInputs(inputs);
      if (!validationResult.isValid) {
        return;
      }

      const price = result.current.getPrice(inputs, 100, specs);
      expect(price.smallOrderSurcharge).toBe(0);
    });
  });

  test("invalid latitude - 90.1", async () => {
    await act(async () => {
      const inputs = {
        ...exampleInputs,
        userLatitude: 90.1,
      };
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const validationResult = validateUserInputs(inputs);
      if (!validationResult.isValid) {
        expect(validationResult.errors.userLatitude).toBe(
          "Latitude must be between -90 and 90",
        );
        return;
      }

      const price = result.current.getPrice(inputs, 100, specs);
      expect(price.smallOrderSurcharge).toBe(null);
    });
  });

  test("invalid longitude - 200", async () => {
    await act(async () => {
      const inputs = {
        ...exampleInputs,
        userLongitude: 200,
      };
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const validationResult = validateUserInputs(inputs);
      if (!validationResult.isValid) {
        expect(validationResult.errors.userLongitude).toBe(
          "Longitude must be between -180 and 180",
        );
        return;
      }

      const price = result.current.getPrice(inputs, 100, specs);
      expect(price.smallOrderSurcharge).toBe(null);
    });
  });

  test("valid negative longitude - -120", async () => {
    await act(async () => {
      const inputs = {
        ...exampleInputs,
        userLongitude: -120,
      };
      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const validationResult = validateUserInputs(inputs);
      if (!validationResult.isValid) {
        expect(validationResult.errors.userLongitude).toBe(0);
        return;
      }

      const price = result.current.getPrice(inputs, 100, specs);
      expect(price.smallOrderSurcharge).toBe(0);
    });
  });

  test("delivery fee - distance: 0", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const price = result.current.getPrice(inputs, 0, specs);
      expect(price.deliveryFee).toBe(190);
    });
  });

  test("delivery fee - distance: -99", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      expect(() => result.current.getPrice(inputs, -99, specs)).toThrowError(
        "Invalid delivery distance",
      );
    });
  });

  test("delivery fee - distance: 499", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const price = result.current.getPrice(inputs, 49, specs);
      expect(price.deliveryFee).toBe(190);
    });
  });

  test("delivery fee - distance: 500", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const price = result.current.getPrice(inputs, 500, specs);
      expect(price.deliveryFee).toBe(290);
    });
  });

  test("delivery fee - distance: 1000", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const price = result.current.getPrice(inputs, 1000, specs);
      expect(price.deliveryFee).toBe(390);
    });
  });

  test("delivery fee - distance: 1500", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const price = result.current.getPrice(inputs, 1500, specs);
      expect(price.deliveryFee).toBe(540);
    });
  });

  test("delivery fee - distance: 1555", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const price = result.current.getPrice(inputs, 1555, specs);
      expect(price.deliveryFee).toBe(546);
    });
  });

  test("delivery fee - distance: 1999", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      const price = result.current.getPrice(inputs, 1999, specs);
      expect(price.deliveryFee).toBe(590);
    });
  });

  test("delivery fee - distance: 2000", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      expect(() => result.current.getPrice(inputs, 2000, specs)).toThrowError(
        "Delivery distance out of range",
      );
    });
  });

  test("delivery fee - distance: 32323232", async () => {
    await act(async () => {
      const inputs = exampleInputs;

      const orderInfo = await result.current.getOrderInfo(exampleInputs);
      const { specs } = orderInfo;

      expect(() =>
        result.current.getPrice(inputs, 32323232, specs),
      ).toThrowError("Delivery distance out of range");
    });
  });
});
