import { act } from "react";

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { ModalProvider } from "../context";
import { exampleInputs } from "../tests/utils";
import { useDetailsForm } from "./useDetailsForm";
import { useGetLocation } from "./useGetLocation";
import { beforeEach } from "node:test";

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
  // const mockGetCurrentPosition = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    // const mockGeolocation = {
    //   getCurrentPosition: vi.fn((successCallback, errorCallback) => {
    //     // You can simulate success or error scenarios
    //     successCallback({
    //       coords: {
    //         latitude: 40.7128,
    //         longitude: -74.006,
    //       },
    //     });

    //     errorCallback({
    //       code: 1,
    //       message: "Permission denied",
    //     });
    //   }),
    // };
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  // test("useGetLocation - get browser location", async () => {
  //   const mockPosition = {
  //     coords: {
  //       latitude: 40.7128,
  //       longitude: -74.006,
  //     },
  //   } as GeolocationPosition;

  //   mockGetCurrentPosition.mockImplementation((successCallback) => {
  //     successCallback(mockPosition);
  //   });

  //   const { result } = renderHook(
  //     () =>
  //       useGetLocation({
  //         setUserInputs: mockSetUserInputs,
  //       }),
  //     {
  //       wrapper: ModalProvider,
  //     },
  //   );

  //   const event = {
  //     preventDefault: vi.fn(),
  //   } as unknown as React.SyntheticEvent;

  //   await act(async () => {
  //     result.current.getBrowserLocation(event);
  //   });

  //   expect(event.preventDefault).toHaveBeenCalledTimes(1);
  //   expect(mockSetUserInputs).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       userLatitude: 40.7128,
  //       userLongitude: -74.006,
  //     }),
  //   );
  // });
});
