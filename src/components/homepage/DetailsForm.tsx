import "./DetailsForm.css";

import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import { getDistance } from "geolib";

import { fetchDeliverySpecs, fetchVenue } from "../../api/api";
import { useModalContext } from "../../context/modal";
import { useDetailsForm } from "../../hooks/useDetailsForm";
import { useParsers } from "../../hooks/useParsers";
import { LonLat } from "../../utils/types";
import { Button } from "../common/Button";
import { TextInput } from "../common/TextInput";

export const DetailsForm = () => {
  // const [distance, setDistance] = useState<number | undefined>(undefined);
  const [venue, setVenue] = useState<LonLat | null>(null);
  const {
    userInputs,
    setUserInputs,
    useIp,
    getIpLocation,
    getBrowserLocation,
    errors,
    setErrors,
    handleFocus,
    handleBlur,
    invalidInput,
  } = useDetailsForm();
  const { validateUserInputs, parseCart } = useParsers();
  const { closeModal } = useModalContext();

  useEffect(() => {
    if (useIp) {
      getIpLocation();
    }
  }, [useIp, getIpLocation, closeModal]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: value }));
    invalidInput(name, value);
  };

  const calculatePrice = async (e: SyntheticEvent) => {
    e.preventDefault();

    const validation = validateUserInputs(userInputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      console.log("all errors", errors);
      return;
    }

    console.log("parsecart", parseCart(userInputs.cart.toString()));
    console.log("userInputs", userInputs);

    try {
      const venueData = await fetchVenue(userInputs.venue);
      setVenue(venueData);

      const distance = getDistance(
        {
          latitude: userInputs.latitude,
          longitude: userInputs.longitude,
        },
        {
          latitude: venueData.lat,
          longitude: venueData.lon,
        },
      );

      console.log("distance", distance);

      const prices = await fetchDeliverySpecs(userInputs.venue);
      console.log("distance", distance);
      console.log("Calculating price...");
      console.log("venues", venue);
      console.log("prices", prices);
    } catch (error: unknown) {
      console.error("Error getting venues", error);
    }
  };

  return (
    <form className="form-details" onSubmit={getBrowserLocation}>
      <TextInput
        label="Venue slug"
        name="venue"
        id="venue"
        dataTestId="venuSlug"
        placeholder="Venue..."
        value={userInputs.venue}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errors={errors}
      />
      <TextInput
        label="Cart value (EUR)"
        name="cart"
        id="cart"
        dataTestId="cartValue"
        placeholder="Value..."
        value={userInputs.cart || ""}
        onChange={handleInput}
        onFocus={handleFocus}
        errors={errors}
      />
      <TextInput
        label="User latitude"
        name="latitude"
        id="latitude"
        dataTestId="userLatitude"
        placeholder="Latitude..."
        value={userInputs.latitude || ""}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errors={errors}
      />
      <TextInput
        label="User longitude"
        name="longitude"
        id="longitude"
        dataTestId="userLongitude"
        placeholder="Longitude..."
        value={userInputs.longitude || ""}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errors={errors}
      />
      <div className="button-group">
        <Button
          className="btn btn-filled"
          type="submit"
          children="Get Location"
          data-test-id="getLocation"
        />
        <Button
          className="btn btn-outlined"
          type="button"
          children="Calculate delivery price"
          onClick={calculatePrice}
          disabled={
            !userInputs.latitude ||
            !userInputs.longitude ||
            !userInputs.cart ||
            !userInputs.venue
          }
        />
      </div>
    </form>
  );
};
