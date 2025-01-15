import axios from "axios";

import { LonLat } from "../utils/types";

export const fetchIpLocation = async (): Promise<LonLat | undefined> => {
  try {
    const response = await axios.get("http://ip-api.com/json/?fields=lon,lat");
    console.log("response", response);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting location by ip", error);
  }
};
