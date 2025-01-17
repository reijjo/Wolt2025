import { UserInputs } from "../utils";

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

  const parseNumber = (input: number): number => {
    return Number(input);
  };

  const parseCart = (input: string) => {
    // if (!isValidCartInput(input)) return null;

    const floatValue = parseFloat(input);
    // if (!isNaN(floatValue)) return null;

    return Math.round(floatValue * 100);
  };

  const validateUserInputs = (inputs: UserInputs) => {
    const errors: { [key: string]: string } = {};

    if (!isString(inputs.venue)) {
      errors.venue = "Venue is required";
    } else if (
      inputs.venue !== "home-assignment-venue-helsinki" &&
      inputs.venue !== "home-assignment-venue-tallinn"
    ) {
      errors.venue = `Venue must be either "home-assignment-venue-helsinki" or "home-assignment-venue-tallinn"`;
    }

    if (inputs.cart.toString().includes(",")) {
      errors.cart = "Change ',' to '.'";
    } else if (!isValidCartInput(inputs.cart)) {
      errors.cart = "Cart value must be a number";
    } else {
      const parsedCart = parseCart(inputs.cart);
      if (parsedCart === null) {
        errors.cart = "Invalid cart value";
      }
    }

    if (!isValidNumber(parseNumber(inputs.latitude))) {
      errors.latitude = "Latitude must be a number";
    }

    if (!isValidNumber(parseNumber(inputs.longitude))) {
      errors.longitude = "Longitude must be a number";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    parseCart,
    validateUserInputs,
  };
};
