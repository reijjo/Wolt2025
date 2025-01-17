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
