import "./DetailsForm.css";

import { ChangeEvent, SyntheticEvent, useEffect } from "react";

import { useModalContext } from "../../context/modal";
import { useDetailsForm } from "../../hooks/useDetailsForm";
import { useParsers } from "../../hooks/useParsers";
import { usePriceCalculations } from "../../hooks/usePriceCalculations";
import { Button } from "../common/Button";
import { TextInput } from "../common/TextInput";

export const DetailsForm = () => {
  const {
    userInputs,
    setUserInputs,
    useIp,
    getBrowserLocation,
    errors,
    setErrors,
    handleFocus,
    handleBlur,
    invalidInput,
    getIpLocation,
  } = useDetailsForm();
  const { validateUserInputs } = useParsers();
  const { isLoading, venue, deliverySpecs, distance, getOrderInfo } =
    usePriceCalculations();
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

    getOrderInfo(userInputs);
  };

  console.log("venue and specs and distance", venue, deliverySpecs, distance);

  return (
    <form className="form-details" onSubmit={getBrowserLocation}>
      {isLoading && <div className="loading">Loading...</div>}
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
