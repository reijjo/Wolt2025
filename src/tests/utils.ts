import { UserInputs } from "../utils";

export const customTestId = (id: string) => {
  return document.querySelector(`[data-test-id=${id}]`) as Element;
};

export const inputs: UserInputs = {
  venueSlug: "home-assingment-venue-helsinki",
  cartValue: 1000,
  userLatitude: 60.71094,
  userLongitude: 24.93087,
};
