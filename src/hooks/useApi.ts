import { isAxiosError } from "axios";

import { fetchDeliverySpecs, fetchVenue } from "../api/api";

export const useApi = () => {
  const fetchSpecs = async (url: string) => {
    try {
      const specs = await fetchDeliverySpecs(url);
      return specs;
    } catch (error: unknown) {
      console.error("Error fetching delivery specs", error);
      throw new Error("Error fetching delivery info");
    }
  };

  const fetchVenueLocation = async (url: string) => {
    try {
      const venue = await fetchVenue(url);
      return venue;
    } catch (error: unknown) {
      console.error("Error fetching venue location", error);
      throw new Error("Error fetching venue location");
    }
  };

  const handleApiErrors = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    } else if (isAxiosError(error)) {
      return "An error occurred while fetching data";
    } else {
      return "An unexpected error occurred";
    }
  };

  return { fetchSpecs, fetchVenueLocation, handleApiErrors };
};
