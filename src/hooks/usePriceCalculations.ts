import { useState } from "react";

import { getDistance } from "geolib";

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

  const { fetchSpecs, fetchVenueLocation } = useApi();
  const { parseCart } = useParsers();

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
      console.log("SOmethingwrong with the delivery specs or distance");
      console.log("WRONT SPECS", deliverySpecs);
      console.log("WORONG DISTANCE", distance);
      return;
    }

    try {
      const { pricing, noSurcharge } = specs;

      let smallOrderSurcharge = Math.max(
        0,
        noSurcharge - parseCart(inputs.cart),
      );
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
        return;
      }

      const { a, b } = distanceRanges;
      const deliveryFee =
        pricing.basePrice + a + Math.round((b * distance) / 10);

      const totalPrice =
        parseCart(inputs.cart) + deliveryFee + smallOrderSurcharge;

      // setPriceData({
      //   cartValue: Number(inputs.cart),
      //   smallOrderSurcharge,
      //   deliveryFee,
      //   deliveryDistance: distance,
      //   totalPrice,
      // });
      // console.log("pricedata", priceData);
      return {
        cartValue: parseCart(inputs.cart),
        smallOrderSurcharge,
        deliveryFee,
        deliveryDistance: distance,
        totalPrice,
      };
    } catch (error: unknown) {
      console.error("Error getting price", error);
    }
  };

  return {
    venue,
    deliverySpecs,
    getOrderInfo,
    getPrice,
    // priceData,
  };
};
