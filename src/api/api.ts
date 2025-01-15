import axios from "axios";

import { LonLat } from "../utils/types";

export const fetchIpLocation = async (): Promise<LonLat | undefined> => {
  const response = await axios.get("http://ip-api.com/json/?fields=lon,lat");
  return response.data;
};

export const fetchVenues = async (venueSlug: string): Promise<void> => {
  const response = await axios.get(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`,
  );
  return response.data?.venue_raw?.location?.coordinates;
};
