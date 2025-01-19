import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import { ModalProvider, PriceProvider } from "../../context";
import { customTestId, exampleInputs } from "../../tests/utils";
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

  test("form accepts valid inputs", async () => {
    const user = userEvent.setup();

    const venue = customTestId("venueSlug");
    const cart = customTestId("cartValue");
    const userLat = customTestId("userLatitude");
    const userLot = customTestId("userLongitude");
    const calculate = screen.getByRole("button", { name: /calculate/i });

    expect(calculate).toBeInTheDocument();
    expect(calculate).toBeDisabled();

    await user.type(venue, exampleInputs.venueSlug);
    await user.type(cart, exampleInputs.cartValue.toString());
    await user.type(userLat, exampleInputs.userLatitude.toString());
    await user.type(userLot, exampleInputs.userLongitude.toString());

    expect(calculate).not.toBeDisabled();
  });
});
