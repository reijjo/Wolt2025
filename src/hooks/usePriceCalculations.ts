import { useState } from "react";

import { getDistance } from "geolib";

import { usePriceContext } from "../context";
import { DeliverySpecs, LonLatWithStatus, UserInputs } from "../utils";
import { useApi } from "./useApi";
import { useValidInputs } from "./useValidInputs";

export const usePriceCalculations = () => {
  const [venue, setVenue] = useState<LonLatWithStatus | null>(null);
  const [deliverySpecs, setDeliverySpecs] = useState<DeliverySpecs | null>(
    null,
  );
  const { setPriceData } = usePriceContext();
  const { fetchSpecs, fetchVenueLocation } = useApi();
  const { parseCart, isPriceData } = useValidInputs();

  const getOrderInfo = async (inputs: UserInputs) => {
    const [specsResult, venueResult] = await Promise.all([
      fetchSpecs(inputs.venueSlug),
      fetchVenueLocation(inputs.venueSlug),
    ]);

    if (!specsResult || !venueResult) {
      console.error(!specsResult ? "No specs found" : "No venue found");
      setDeliverySpecs(null);
      setVenue(null);
      throw new Error(
        !specsResult ? "Can't find delivery information" : "No venue found",
      );
    }

    setDeliverySpecs(specsResult);
    setVenue(venueResult);

    const dist = getDistance(
      {
        latitude: inputs.userLatitude,
        longitude: inputs.userLongitude,
      },
      {
        latitude: venueResult.venue.lat,
        longitude: venueResult.venue.lon,
      },
    );

    return { specs: specsResult, distance: dist };
  };

  const getPrice = (
    inputs: UserInputs,
    distance: number,
    specs: DeliverySpecs,
  ) => {
    if (!specs) {
      console.error("No delivery info found");
      throw new Error("No specs found");
    }

    const { pricing, noSurcharge } = specs;
    const cartValue = parseCart(inputs.cartValue.toString());
    const smallOrderSurcharge = Math.max(0, noSurcharge - cartValue);

    const range = pricing.distanceRanges.find(
      (range) =>
        distance >= range.min && (distance < range.max || range.max === 0),
    );

    if (!range) {
      console.error("Invalid delivery distance");
      throw new Error("Invalid delivery distance");
    }

    if (range && range.max === 0 && distance >= range.min) {
      console.error("Delivery distance out of range");
      throw new Error("Delivery distance out of range");
    }

    const { a, b } = range;
    const deliveryFee = pricing.basePrice + a + Math.round((b * distance) / 10);

    const totalPrice = cartValue + deliveryFee + smallOrderSurcharge;

    const calculatedPrice = {
      cartValue,
      smallOrderSurcharge,
      deliveryFee,
      deliveryDistance: distance,
      totalPrice,
    };

    if (!isPriceData(calculatedPrice)) {
      throw new Error("Invalid price data");
    }

    setPriceData(calculatedPrice);
    return calculatedPrice;
  };

  return {
    venue,
    deliverySpecs,
    getOrderInfo,
    getPrice,
  };
};
