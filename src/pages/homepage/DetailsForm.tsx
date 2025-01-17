import "./DetailsForm.css";

import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import {
  Button,
  Divider,
  Loading,
  Notification,
  TextInput,
} from "../../components";
import { useModalContext } from "../../context";
import {
  useDetailsForm,
  usePriceCalculations,
  useValidInputs,
} from "../../hooks";
import { DeliverySpecs } from "../../utils";

export const DetailsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    userInputs,
    setUserInputs,
    useIp,
    getBrowserLocation,
    errors,
    setErrors,
    notification,
    showNotification,
    handleFocus,
    handleBlur,
    invalidInput,
    getIpLocation,
  } = useDetailsForm();
  const { validateUserInputs } = useValidInputs();
  const { getOrderInfo, getPrice } = usePriceCalculations();
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
      showNotification(`Check your inputs`, 5000);
      return;
    }

    try {
      setIsLoading(true);

      const infoResult = await getOrderInfo(userInputs);
      const { distance, specs } = infoResult ?? {};

      getPrice(userInputs, distance ?? 0, specs as DeliverySpecs);
    } catch (error: unknown) {
      console.log("error fetching order info", error);
    } finally {
      showNotification("", 0);
      setIsLoading(false);
    }
  };

  return (
    <form className="form-details" onSubmit={getBrowserLocation}>
      {isLoading && <Loading />}
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
      {notification && <Notification message={notification} type="error" />}
      <Divider />
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
