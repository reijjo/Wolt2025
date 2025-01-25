import { SyntheticEvent, act } from "react";

import { renderHook } from "@testing-library/react";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import * as apiModule from "../api/api";
import { ModalProvider, PriceProvider } from "../context";
import { exampleInputs } from "../tests/utils";
import { UserInputs, initialUserInputs } from "../utils";
import { useDetailsForm } from "./useDetailsForm";
import { useGetLocation } from "./useGetLocation";
import { useGetPrice } from "./useGetPrice";

describe("HOOKS - useApi", () => {
  test("useApi ok", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { fetchSpecs, fetchVenueLocation, handleApiErrors } = useApi();
    expect(fetchSpecs).toBeInstanceOf(Function);
    expect(fetchVenueLocation).toBeInstanceOf(Function);
    expect(handleApiErrors).toBeInstanceOf(Function);
  });

  test("useApi = fetchSpecs ok", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { fetchSpecs } = useApi();
    const url = "home-assignment-venue-helsinki";

    const response = await fetchSpecs(url);
    expect(response.status).toBe(200);
  });

  test("useApi - fetchSpecs error", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { fetchSpecs } = useApi();
    const url = "turku";

    await expect(fetchSpecs(url)).rejects.toThrow(
      "No venue with slug of 'turku' was found",
    );
  });

  test("useApi - fetchSpecs Axios error", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { fetchSpecs } = useApi();
    const url = "turku";

    vi.spyOn(apiModule, "fetchDeliverySpecs").mockRejectedValueOnce({
      isAxiosError: true,
    });

    await expect(fetchSpecs(url)).rejects.toThrow(
      "An error occurred while fetching data",
    );
  });

  test("useApi - fetchSpecs random error", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { fetchSpecs } = useApi();
    const url = "turku";

    vi.spyOn(apiModule, "fetchDeliverySpecs").mockRejectedValueOnce(
      new Error("Network Error"),
    );

    await expect(fetchSpecs(url)).rejects.toThrow("Error fetching data");
  });

  test("useApi - fetchVenueLocation ok", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { fetchVenueLocation } = useApi();
    const url = "home-assignment-venue-helsinki";

    const response = await fetchVenueLocation(url);
    expect(response.status).toBe(200);
  });

  test("useApi - fetchVenueLocation error", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { fetchVenueLocation } = useApi();
    const url = "turku";

    await expect(fetchVenueLocation(url)).rejects.toThrow(
      "No venue with slug of 'turku' was found",
    );
  });

  test("useApi - handleApiErrors with Error instance", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { handleApiErrors } = useApi();

    const error = new Error("Test error");
    expect(handleApiErrors(error)).toBe("Test error");
  });

  test("useApi - handleApiErrors with Axios error", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { handleApiErrors } = useApi();

    const axiosError = {
      isAxiosError: true,
      response: {},
      message: "Network Error",
    };

    expect(handleApiErrors(axiosError)).toBe(
      "An error occurred while fetching data",
    );
  });

  test("useApi - handleApiErrors with unknown error", async () => {
    const { useApi } = await import("../hooks/useApi");
    const { handleApiErrors } = useApi();

    const unknownError = "Some random error";
    expect(handleApiErrors(unknownError)).toBe("An unexpected error occurred");
  });

  test("fetchIpLocation ok", async () => {
    const { fetchIpLocation } = await import("../api/api");
    const response = await fetchIpLocation();
    expect(response).toHaveProperty("lat");
    expect(response).toHaveProperty("lon");
  });
});

describe("HOOKS - useDetailsForm", () => {
  test("useDetailsForm - showNotification", async () => {
    const { result } = renderHook(() =>
      useDetailsForm({ userInputs: exampleInputs }),
    );

    act(() => {
      result.current.showNotification("Test message", "success", 2);
    });

    expect(result.current.notification).toEqual({
      message: "Test message",
      type: "success",
    });
  });

  test("useDetailsForm - clearNotification", () => {
    const { result } = renderHook(() =>
      useDetailsForm({ userInputs: exampleInputs }),
    );

    act(() => {
      result.current.showNotification("Test message", "error", 1);
      result.current.clearNotification();
    });

    expect(result.current.notification).toStrictEqual({
      message: "",
      type: "error",
    });
  });

  test("useDetailsForm - blur no error anymore", () => {
    const { result } = renderHook(() =>
      useDetailsForm({ userInputs: exampleInputs }),
    );

    act(() => {
      result.current.setErrors({ cartValue: "Invalid name" });
      result.current.handleBlur({
        target: { name: "cartValue" },
      } as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.errors).toEqual({ cartValue: "" });
  });
});

describe("HOOKS - useGetLocation", () => {
  const mockSetUserInputs = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  beforeAll(() => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: vi.fn(),
      },
      writable: true,
    });
  });

  test("useGetLocation - get IP location", async () => {
    const { result } = renderHook(
      () => useGetLocation({ setUserInputs: mockSetUserInputs }),
      {
        wrapper: ModalProvider,
      },
    );

    await act(async () => {
      await result.current.getIpLocation();
    });
    expect(mockSetUserInputs).toHaveBeenCalledTimes(1);
  });
});

describe("HOOKS - useGetPrice", () => {
  const mockSetIsLoading = vi.fn();
  const mockSetErrors = vi.fn();
  const mockShowNotification = vi.fn();
  const mockClearNotification = vi.fn();
  const mockSetUserInputs = vi.fn();

  const setupHook = (inputs: UserInputs) => {
    return renderHook(
      () =>
        useGetPrice({
          setIsLoading: mockSetIsLoading,
          setErrors: mockSetErrors,
          showNotification: mockShowNotification,
          clearNotification: mockClearNotification,
          userInputs: inputs,
          setUserInputs: mockSetUserInputs,
        }),
      { wrapper: PriceProvider },
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calculatePrice - success", async () => {
    const { result } = setupHook(exampleInputs);

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent;

    await act(async () => {
      await result.current.calculatePrice(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockClearNotification).toHaveBeenCalled();
    expect(mockSetUserInputs).toHaveBeenCalledWith(initialUserInputs);
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  test("calculatePrice - invalid input", async () => {
    const invalidInputs = { ...initialUserInputs, cartValue: -1 };
    const { result } = setupHook(invalidInputs);

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent;

    await act(async () => {
      await result.current.calculatePrice(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSetErrors).toHaveBeenCalled();
    expect(mockShowNotification).toHaveBeenCalledWith(
      expect.stringContaining("Please check your inputs"),
      "error",
      5,
    );
  });

  test("calculatePrice - handles API error", async () => {
    const originalModule = await import("./usePriceCalculations");
    vi.spyOn(originalModule, "usePriceCalculations").mockImplementation(() => ({
      venue: null,
      deliverySpecs: null,
      getOrderInfo: vi.fn(() => Promise.reject(new Error("API Error"))),
      getPrice: vi.fn(),
    }));

    const { result } = setupHook(initialUserInputs);

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent;

    await act(async () => {
      await result.current.calculatePrice(mockEvent);
    });

    expect(mockShowNotification).toHaveBeenCalledWith(
      "Please check your inputs",
      "error",
      5,
    );

    vi.restoreAllMocks();
  });

  test("useGetLocation - getIpLocation updates location", async () => {
    const { result } = renderHook(
      () => useGetLocation({ setUserInputs: mockSetUserInputs }),
      { wrapper: ModalProvider },
    );

    vi.spyOn(apiModule, "fetchIpLocation").mockResolvedValueOnce({
      lat: 60.1797,
      lon: 24.9344,
    });

    await act(async () => {
      await result.current.getIpLocation();
    });

    expect(mockSetUserInputs).toHaveBeenCalledWith(expect.any(Function));

    const updaterFunction = mockSetUserInputs.mock.calls[0][0];
    const previousState = { userLatitude: 0, userLongitude: 0 };
    const newState = updaterFunction(previousState);

    expect(newState).toEqual({
      ...previousState,
      userLatitude: 60.1797,
      userLongitude: 24.9344,
    });
  });

  test("useGetLocation - getIpLocation handles error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(
      () => useGetLocation({ setUserInputs: mockSetUserInputs }),
      { wrapper: ModalProvider },
    );

    vi.spyOn(apiModule, "fetchIpLocation").mockRejectedValueOnce(
      new Error("Failed to fetch IP location"),
    );

    try {
      await act(async () => {
        await result.current.getIpLocation();
      });
    } catch (error) {
      expect(error).toEqual(new Error("Error getting location by ip"));
    }

    expect(mockSetUserInputs).not.toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting location by ip",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  test("useGetLocation - getBrowserLocation success", async () => {
    const { result } = renderHook(
      () => useGetLocation({ setUserInputs: mockSetUserInputs }),
      { wrapper: ModalProvider },
    );

    const mockPosition = {
      coords: {
        latitude: 60.1699,
        longitude: 24.9384,
      },
    };
    vi.spyOn(
      navigator.geolocation,
      "getCurrentPosition",
    ).mockImplementationOnce((success) =>
      success(mockPosition as GeolocationPosition),
    );

    await act(async () => {
      result.current.getBrowserLocation({
        preventDefault: vi.fn(),
      } as unknown as SyntheticEvent);
    });

    expect(mockSetUserInputs).toHaveBeenCalledWith(expect.any(Function));

    const updaterFunction = mockSetUserInputs.mock.calls[0][0];
    const previousState = { userLatitude: 0, userLongitude: 0 };
    const newState = updaterFunction(previousState);

    expect(newState).toEqual({
      ...previousState,
      userLatitude: 60.1699,
      userLongitude: 24.9384,
    });
  });

  test("useGetLocation - getBrowserLocation error (user denies access)", async () => {
    const { result } = renderHook(
      () => useGetLocation({ setUserInputs: mockSetUserInputs }),
      { wrapper: ModalProvider },
    );

    const mockError = {
      code: 1,
      message: "User denied location access",
    };
    vi.spyOn(
      navigator.geolocation,
      "getCurrentPosition",
    ).mockImplementationOnce((_, error) =>
      error?.(mockError as GeolocationPositionError),
    );

    await act(async () => {
      result.current.getBrowserLocation({
        preventDefault: vi.fn(),
      } as unknown as SyntheticEvent);
    });
  });

  test("useGetLocation - getBrowserLocation error (other errors)", async () => {
    const { result } = renderHook(
      () => useGetLocation({ setUserInputs: mockSetUserInputs }),
      { wrapper: ModalProvider },
    );

    const mockError = {
      code: 2,
      message: "Position unavailable",
    };
    vi.spyOn(
      navigator.geolocation,
      "getCurrentPosition",
    ).mockImplementationOnce((_, error) =>
      error?.(mockError as GeolocationPositionError),
    );

    await act(async () => {
      result.current.getBrowserLocation({
        preventDefault: vi.fn(),
      } as unknown as SyntheticEvent);
    });

    expect(result.current.useIp).toBe(false);
  });

  afterAll(() => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      writable: true,
    });
  });
});
