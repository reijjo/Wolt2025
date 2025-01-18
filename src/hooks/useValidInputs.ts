import { PriceData, UserInputs } from "../utils";

export const useValidInputs = () => {
  const isValidNumber = (input: unknown): input is number => {
    return typeof input === "number" && !isNaN(Number(input));
  };

  const isString = (input: unknown): input is string => {
    return typeof input === "string" && input.trim().length > 0;
  };

  const isValidCartInput = (input: string): boolean => {
    const cartRegex = /^\d*\.?\d*$/;
    return cartRegex.test(input) && input.trim() !== "" && input.trim() !== ".";
  };

  const isValidLatitude = (lat: number): boolean => {
    return lat >= -90 && lat <= 90;
  };

  const isValidLongitude = (lon: number): boolean => {
    return lon >= -180 && lon <= 180;
  };

  const isPriceData = (data: unknown): data is PriceData => {
    return (
      typeof data === "object" &&
      data !== null &&
      "cartValue" in data &&
      "smallOrderSurcharge" in data &&
      "deliveryFee" in data &&
      "deliveryDistance" in data &&
      "totalPrice" in data &&
      typeof (data as PriceData).cartValue === "number" &&
      typeof (data as PriceData).smallOrderSurcharge === "number" &&
      typeof (data as PriceData).deliveryFee === "number" &&
      typeof (data as PriceData).deliveryDistance === "number" &&
      typeof (data as PriceData).totalPrice === "number"
    );
  };

  const parseNumber = (input: number): number => {
    return Number(input);
  };

  const parseCart = (input: string) => {
    const floatValue = parseFloat(input);
    return Math.round(floatValue * 100);
  };

  const validateUserInputs = (inputs: UserInputs) => {
    const errors: { [key: string]: string } = {};

    if (!isString(inputs.venueSlug)) {
      errors.venue = "Venue is required";
    } else if (
      inputs.venueSlug !== "home-assignment-venue-helsinki" &&
      inputs.venueSlug !== "home-assignment-venue-tallinn"
    ) {
      errors.venue = `Venue must be either "home-assignment-venue-helsinki" or "home-assignment-venue-tallinn"`;
    }

    const cartString = inputs.cartValue.toString();
    if (cartString.includes(",")) {
      errors.cartValue = "Change ',' to '.'";
    } else if (!isValidCartInput(cartString)) {
      errors.cartValue = "Cart value must be a number";
    } else if (parseCart(cartString) === 0) {
      errors.cartValue = "Cart value is required";
    } else {
      const parsedCart = parseCart(cartString);
      if (parsedCart === null) {
        errors.cart = "Invalid cart value";
      }
    }

    const parsedLat = parseNumber(inputs.userLatitude);
    if (!isValidNumber(parsedLat)) {
      errors.userLatitude = "Latitude must be a number";
    } else if (!isValidLatitude(parsedLat)) {
      errors.userLatitude = "Latitude must be between -90 and 90";
    }

    const parsedLon = parseNumber(inputs.userLongitude);
    if (!isValidNumber(parsedLon)) {
      errors.userLongitude = "Longitude must be a number";
    } else if (!isValidLongitude(parsedLon)) {
      errors.userLongitude = "Longitude must be between -180 and 180";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    isPriceData,
    parseCart,
    validateUserInputs,
  };
};
