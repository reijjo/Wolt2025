import { screen } from "@testing-library/react";

import { UserInputs } from "../utils";

export const customTestId = (id: string) => {
  return document.querySelector(`[data-test-id=${id}]`) as Element;
};

export const findRawValue = (labelText: string): string | null => {
  const labelElement = screen.getByText(labelText);
  if (!labelElement) return null;

  const span = labelElement?.parentElement?.querySelector(
    "span[data-raw-value]",
  );
  return span ? span.getAttribute("data-raw-value") : null;
};

export const exampleInputs: UserInputs = {
  venueSlug: "home-assignment-venue-helsinki",
  cartValue: 10,
  userLatitude: 60.1797,
  userLongitude: 24.9344,
};
