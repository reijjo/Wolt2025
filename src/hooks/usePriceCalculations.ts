import { useState } from "react";

import { getDistance } from "geolib";

import { usePriceContext } from "../context/price";
import { DeliverySpecs, LonLat, UserInputs } from "../utils/types";
import { useApi } from "./useApi";
import { useParsers } from "./useParsers";

export const usePriceCalculations = () => {
  const [venue, setVenue] = useState<LonLat | null>(null);
  const [deliverySpecs, setDeliverySpecs] = useState<DeliverySpecs | null>(
    null,
  );
  // const [distance, setDistance] = useState<number>(0);
  // const [priceData, setPriceData] = useState<PriceData | null>(null);
  const { setPriceData } = usePriceContext();

  const { fetchSpecs, fetchVenueLocation } = useApi();
  const { parseCart } = useParsers();

  const getOrderInfo = async (inputs: UserInputs) => {
    try {
      const [specsResult, venueResult] = await Promise.all([
        fetchSpecs(inputs.venue),
        fetchVenueLocation(inputs.venue),
      ]);

      if (!specsResult || !venueResult) {
        console.error(!specsResult ? "No specs found" : "No venue found");
        setDeliverySpecs(null);
        setVenue(null);
        return null;
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
    } catch (error: unknown) {
      console.error("Error getting venues", error);
      return null;
    }
  };

  const getPrice = (
    inputs: UserInputs,
    distance: number,
    specs: DeliverySpecs,
  ) => {
    console.log("getPrice inputs", inputs);
    console.log("getPrice distance", distance);
    console.log("getPrice specs", specs);

    if (!specs || !distance) {
      console.error(!specs ? "No specs found" : "No distance found");
      return null;
    }

    try {
      const { pricing, noSurcharge } = specs;
      const cartValue = parseCart(inputs.cart);

      let smallOrderSurcharge = Math.max(0, noSurcharge - cartValue);
      if (smallOrderSurcharge < 0) {
        smallOrderSurcharge = 0;
      }
      console.log("small order surcharge", smallOrderSurcharge);

      const distanceRanges = pricing.distanceRanges.find(
        (range) =>
          distance >= range.min && (distance < range.max || range.max === 0),
      );

      if (!distanceRanges) {
        console.error("Delivery distance out of range");
        return null;
      }

      const { a, b } = distanceRanges;
      const deliveryFee =
        pricing.basePrice + a + Math.round((b * distance) / 10);

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
    } catch (error: unknown) {
      console.error("Error getting price", error);
      return null;
    }
  };

  return {
    venue,
    deliverySpecs,
    getOrderInfo,
    getPrice,
  };
};
