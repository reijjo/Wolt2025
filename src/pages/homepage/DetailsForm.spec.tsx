import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import { ModalProvider, PriceProvider } from "../../context";
import { customTestId } from "../../tests/utils";
import { DetailsForm } from "./DetailsForm";

describe("DetailsForm", () => {
  beforeEach(() => {
    render(
      <ModalProvider>
        <PriceProvider>
          <DetailsForm />
        </PriceProvider>
      </ModalProvider>,
    );
  });

  test("renders DetailsForm component", () => {
    const form = customTestId("formDetails");
    expect(form).toBeInTheDocument();
  });

  test("finds all critical elements", () => {
    const venue = customTestId("venueSlug");
    const cart = customTestId("cartValue");
    const userLat = customTestId("userLatitude");
    const userLot = customTestId("userLongitude");
    const location = customTestId("getLocation");

    expect(venue).toBeInTheDocument();
    expect(cart).toBeInTheDocument();
    expect(userLat).toBeInTheDocument();
    expect(userLot).toBeInTheDocument();
    expect(location).toBeInTheDocument();
  });
});
