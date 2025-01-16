import { fetchDeliverySpecs, fetchVenue } from "../api/api";

export const useApi = () => {
  const fetchSpecs = async (url: string) => {
    try {
      const specs = await fetchDeliverySpecs(url);
      return specs;
    } catch (error: unknown) {
      console.error("Error fetching delivery specs", error);
    }
  };

  const fetchVenueLocation = async (url: string) => {
    try {
      const venue = await fetchVenue(url);
      return venue;
    } catch (error: unknown) {
      console.error("Error fetching venue location", error);
    }
  };

  return { fetchSpecs, fetchVenueLocation };
};
