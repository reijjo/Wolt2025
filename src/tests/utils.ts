import { screen } from "@testing-library/react";

import { UserInputs } from "../utils";

export const customTestId = (id: string) => {
  return document.querySelector(`[data-test-id=${id}]`) as Element;
};

export const findRawValue = (text: string) => {
  return screen
    .getByText(text)
    .querySelector("span")
    ?.getAttribute("data-raw-value");
};

export const exampleInputs: UserInputs = {
  venueSlug: "home-assingment-venue-helsinki",
  cartValue: 1000,
  userLatitude: 60.1797,
  userLongitude: 24.9344,
};
