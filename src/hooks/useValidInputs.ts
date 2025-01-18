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

    if (inputs.cartValue.toString().includes(",")) {
      errors.cartValue = "Change ',' to '.'";
    } else if (!isValidCartInput(inputs.cartValue)) {
      errors.cartValue = "Cart value must be a number";
    } else if (parseCart(inputs.cartValue) === 0) {
      errors.cartValue = "Cart value is required";
    } else {
      const parsedCart = parseCart(inputs.cartValue);
      if (parsedCart === null) {
        errors.cart = "Invalid cart value";
      }
    }

    if (!isValidNumber(parseNumber(inputs.userLatitude))) {
      errors.latitude = "Latitude must be a number";
    }

    if (!isValidNumber(parseNumber(inputs.userLongitude))) {
      errors.longitude = "Longitude must be a number";
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
