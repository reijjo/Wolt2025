import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import { ModalProvider, PriceProvider } from "../../context";
import { customTestId, exampleInputs } from "../../tests/utils";
import { inputErrors } from "../../utils";
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

  test("invalid venue", async () => {
    const user = userEvent.setup();

    const venue = customTestId("venueSlug");
    expect(venue).toBeInTheDocument();

    await user.type(venue, "turku");
    expect(screen.getByText(inputErrors.venueInvalid)).toBeInTheDocument();

    await user.clear(venue);
    await user.type(venue, "home-assignment-venue-helsinki");
    expect(screen.queryByText(inputErrors.venueInvalid)).toBeNull();
  });

  test("invalid cart value", async () => {
    const user = userEvent.setup();

    const cart = customTestId("cartValue");
    expect(cart).toBeInTheDocument();

    await user.type(cart, "1000");
    expect(screen.queryByText(inputErrors.cartInvalid)).toBeNull();

    await user.clear(cart);
    await user.type(cart, "10,00");
    expect(screen.getByText(inputErrors.cartComma)).toBeInTheDocument();
    await user.clear(cart);
    await user.type(cart, "10.00");
    expect(screen.queryByText(inputErrors.cartComma)).toBeNull();

    await user.clear(cart);
    await user.type(cart, "0");
    expect(screen.getByText(inputErrors.cartRequired)).toBeInTheDocument();
  });

  test("invalid user latitude", async () => {
    const user = userEvent.setup();

    const userLat = customTestId("userLatitude");
    expect(userLat).toBeInTheDocument();

    await user.type(userLat, "-90.000001");
    expect(screen.getByText(inputErrors.latitudeInvalid)).toBeInTheDocument();
  });

  test("invalid user longitude", async () => {
    const user = userEvent.setup();
    const userLot = customTestId("userLongitude");

    expect(userLot).toBeInTheDocument();
    await user.type(userLot, "10.00");
    expect(screen.queryByText(inputErrors.longitudeInvalid)).toBeNull();
  });
});
