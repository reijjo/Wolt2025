import { useState } from "react";

import { getDistance } from "geolib";

import { usePriceContext } from "../context";
import { DeliverySpecs, LonLat, UserInputs, initialPricaData } from "../utils";
import { useApi } from "./useApi";
import { useValidInputs } from "./useValidInputs";

export const usePriceCalculations = () => {
  const [venue, setVenue] = useState<LonLat | null>(null);
  const [deliverySpecs, setDeliverySpecs] = useState<DeliverySpecs | null>(
    null,
  );
  const { setPriceData } = usePriceContext();
  const { fetchSpecs, fetchVenueLocation } = useApi();
  const { parseCart } = useValidInputs();

  const getOrderInfo = async (inputs: UserInputs) => {
    setPriceData(initialPricaData);

    // try {
    const [specsResult, venueResult] = await Promise.all([
      fetchSpecs(inputs.venue),
      fetchVenueLocation(inputs.venue),
    ]);

    console.log("venue", venueResult);

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
        latitude: inputs.latitude,
        longitude: inputs.longitude,
      },
      {
        latitude: venueResult.lat,
        longitude: venueResult.lon,
      },
    );

    return { specs: specsResult, distance: dist };
    // } catch (error: unknown) {
    //   console.error("Error getting venues", error);
    //   throw error;
    // }
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

    console.log("delivery", specs);

    const { pricing, noSurcharge } = specs;
    const cartValue = parseCart(inputs.cart);
    const smallOrderSurcharge = Math.max(0, noSurcharge - cartValue);

    const range = pricing.distanceRanges.find(
      (range) =>
        distance >= range.min && (distance < range.max || range.max === 0),
    );

    if (range && range.max === 0 && distance >= range.min) {
      console.error("Delivery distance out of range");
      throw new Error("Delivery distance out of range");
    }

    if (!range) {
      console.log("LOGGG Invalid delivery distance");
      throw new Error("Invalid delivery distance");
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
