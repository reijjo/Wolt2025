import { isAxiosError } from "axios";

import { fetchDeliverySpecs, fetchVenue } from "../api/api";

export const useApi = () => {
  const fetchSpecs = async (url: string) => {
    try {
      const specs = await fetchDeliverySpecs(url);
      return specs;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ??
            "An error occurred while fetching data",
        );
      }
      console.error("Error fetching venue location");
      throw new Error("Error fetching venue location");
    }
  };

  const fetchVenueLocation = async (url: string) => {
    try {
      const venue = await fetchVenue(url);
      return venue;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ??
            "An error occurred while fetching data",
        );
      }
      console.error("Error fetching venue location");
      throw new Error("Error fetching venue location");
    }
  };

  const handleApiErrors = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    } else if (isAxiosError(error)) {
      return (
        error.response?.data?.message ?? "An error occurred while fetching data"
      );
    } else {
      return "An unexpected error occurred";
    }
  };

  return { fetchSpecs, fetchVenueLocation, handleApiErrors };
};
