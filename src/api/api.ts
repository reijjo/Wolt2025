import axios from "axios";

import {
  DeliverySpecs,
  DeliverySpecsApiResponse,
  LonLat,
} from "../utils/types";

export const fetchIpLocation = async (): Promise<LonLat | undefined> => {
  const response = await axios.get("http://ip-api.com/json/?fields=lon,lat");
  return response.data;
};

export const fetchVenue = async (venueSlug: string): Promise<LonLat> => {
  const response = await axios.get(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`,
  );
  return parsedVenue(response.data?.venue_raw?.location?.coordinates);
};

export const fetchDeliverySpecs = async (
  venueSlug: string,
): Promise<DeliverySpecs> => {
  const response = await axios.get(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`,
  );
  return parseDeliverySpecs(response.data?.venue_raw?.delivery_specs);
};

const parsedVenue = (venue: number[]): LonLat => {
  return {
    lon: venue[0],
    lat: venue[1],
  };
};

const parseDeliverySpecs = (
  deliverySpecs: DeliverySpecsApiResponse,
): DeliverySpecs => {
  return {
    noSurcharge: deliverySpecs.order_minimum_no_surcharge,
    pricing: {
      basePrice: deliverySpecs?.delivery_pricing?.base_price,
      distanceRanges:
        deliverySpecs?.delivery_pricing?.distance_ranges.map((range) => ({
          min: range.min,
          max: range.max,
          a: range.a,
          b: range.b,
          flag: range.flag,
        })) ?? [],
    },
  };
};
