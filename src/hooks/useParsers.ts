import { UserInputs } from "../utils/types";

export const useParsers = () => {
  const isValidNumber = (input: unknown): input is number => {
    return typeof input === "number" && !isNaN(input);
  };

  const isString = (input: unknown): input is string => {
    return typeof input === "string" && input.trim().length > 0;
  };

  const parseNumber = (input: number): number => {
    return Number(input);
  };

  const validateUserInputs = (inputs: UserInputs) => {
    const errors: { [key: string]: string } = {};

    if (!isString(inputs.venue)) {
      errors.venue = "Venue is required";
    } else if (
      inputs.venue !== "home-assignment-venue-helsinki" &&
      inputs.venue !== "home-assignment-venue-tallinn"
    ) {
      errors.venue =
        "Venue must be either 'home-assignment-venue-helsinki' or 'home-assignment-venue-tallinn'";
    }

    if (!isValidNumber(parseNumber(inputs.cart))) {
      errors.cart = "Cart must be a number";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    // parseNumber,
    validateUserInputs,
  };
};
