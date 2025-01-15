import "./DetailsForm.css";

import { ChangeEvent, SyntheticEvent, useEffect } from "react";

import { fetchVenues } from "../../api/api";
import { useModalContext } from "../../context/modal";
import { useDetailsForm } from "../../hooks/useDetailsForm";
import { useParsers } from "../../hooks/useParsers";
import { Button } from "../common/Button";
import { TextInput } from "../common/TextInput";

export const DetailsForm = () => {
  const {
    userInputs,
    setUserInputs,
    useIp,
    getIpLocation,
    getBrowserLocation,
    errors,
    setErrors,
  } = useDetailsForm();
  const { validateUserInputs } = useParsers();
  const { closeModal } = useModalContext();

  useEffect(() => {
    if (useIp) {
      getIpLocation();
    }
  }, [useIp, getIpLocation, closeModal]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const calculatePrice = async (e: SyntheticEvent) => {
    e.preventDefault();

    const validation = validateUserInputs(userInputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      console.log("all errors", errors);
      console.log("venuerrorr", errors.venue);
      return;
    }

    console.log("userInputs", userInputs);

    try {
      const venues = await fetchVenues(userInputs.venue);
      console.log("Calculating price...");
      console.log("venues", venues);
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
      />
      <TextInput
        label="User longitude"
        name="longitude"
        id="longitude"
        dataTestId="userLongitude"
        placeholder="Longitude..."
        value={userInputs.longitude || ""}
        onChange={handleInput}
      />
      <div className="button-group">
        <Button
          className="btn btn-filled"
          type="submit"
          children="Get Location"
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
