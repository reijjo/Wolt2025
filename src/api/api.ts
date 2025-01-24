import axios from "axios";

import {
  DeliverySpecs,
  DeliverySpecsApiResponse,
  LonLat,
  LonLatWithStatus,
} from "../utils/types";

export const fetchIpLocation = async (): Promise<LonLat | undefined> => {
  const response = await axios.get("http://ip-api.com/json/?fields=lon,lat");
  return response.data;
};

export const fetchVenue = async (
  venueSlug: string,
): Promise<LonLatWithStatus> => {
  const response = await axios.get(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`,
  );
  return parsedVenue({
    venue: response.data?.venue_raw?.location?.coordinates,
    status: response.status,
  });
};

export const fetchDeliverySpecs = async (
  venueSlug: string,
): Promise<DeliverySpecs> => {
  const response = await axios.get(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`,
  );
  return parseDeliverySpecs({
    specs: response.data?.venue_raw?.delivery_specs,
    status: response.status,
  });
};

const parsedVenue = ({
  venue,
  status,
}: {
  venue: number[];
  status: number;
}): LonLatWithStatus => {
  return {
    venue: {
      lon: venue[0],
      lat: venue[1],
    },
    status: status,
  };
};

const parseDeliverySpecs = ({
  specs,
  status,
}: {
  specs: DeliverySpecsApiResponse;
  status: number;
}): DeliverySpecs => {
  return {
    noSurcharge: specs.order_minimum_no_surcharge,
    pricing: {
      basePrice: specs?.delivery_pricing?.base_price,
      distanceRanges:
        specs?.delivery_pricing?.distance_ranges.map((range) => ({
          min: range.min,
          max: range.max,
          a: range.a,
          b: range.b,
          flag: range.flag,
        })) ?? [],
    },
    status: status,
  };
};
