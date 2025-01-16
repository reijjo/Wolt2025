import { useState } from "react";

import { getDistance } from "geolib";

import { DeliverySpecs, LonLat, UserInputs } from "../utils/types";
import { useApi } from "./useApi";

export const usePriceCalculations = () => {
  const [venue, setVenue] = useState<LonLat | null>(null);
  const [deliverySpecs, setDeliverySpecs] = useState<DeliverySpecs | null>(
    null,
  );
  const [distance, setDistance] = useState<number | null>(null);
  const { fetchSpecs, fetchVenueLocation } = useApi();

  const getOrderInfo = async (inputs: UserInputs) => {
    try {
      const [specsResult, venueResult] = await Promise.all([
        fetchSpecs(inputs.venue),
        fetchVenueLocation(inputs.venue),
      ]);

      if (!specsResult) {
        console.error("No specs found");
        setDeliverySpecs(null);
        return;
      }

      if (!venueResult) {
        console.error("No venue found");
        setVenue(null);
        return;
      }

      setDeliverySpecs(specsResult);
      setVenue(venueResult);

      const dist = getDistance(
        {
          latitude: inputs.latitude,
          longitude: inputs.longitude,
        },
        {
          latitude: venueResult.lat,
          longitude: venueResult.lon,
        },
      );

      setDistance(dist);
    } catch (error: unknown) {
      console.error("Error getting venues", error);
    }
  };

  return { venue, deliverySpecs, distance, getOrderInfo };
};
