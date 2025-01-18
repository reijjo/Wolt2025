import "./DetailsForm.css";

import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import { Button, Loading, Notification, TextInput } from "../../components";
import { useModalContext } from "../../context";
import { useApi } from "../../hooks/useApi";
import { useDetailsForm } from "../../hooks/useDetailsForm";
import { useGetLocation } from "../../hooks/useGetLocation";
import { usePriceCalculations } from "../../hooks/usePriceCalculations";
import { useValidInputs } from "../../hooks/useValidInputs";
import { DeliverySpecs } from "../../utils";

export const DetailsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    errors,
    setErrors,
    notification,
    showNotification,
    clearNotification,
    handleFocus,
    handleBlur,
    invalidInput,
  } = useDetailsForm();
  const { validateUserInputs } = useValidInputs();
  const { getOrderInfo, getPrice } = usePriceCalculations();
  const {
    getBrowserLocation,
    getIpLocation,
    useIp,
    userInputs,
    setUserInputs,
  } = useGetLocation();
  const { handleApiErrors } = useApi();
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

    console.log("userInputs", userInputs);

    const validation = validateUserInputs(userInputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showNotification(`Please check your inputs`, "error", 5);
      return;
    }

    try {
      setIsLoading(true);
      clearNotification();

      const infoResult = await getOrderInfo(userInputs);
      if (!infoResult) {
        throw new Error("Failed to get order information");
      }

      const { distance, specs } = infoResult ?? {};
      const priceResult = getPrice(
        userInputs,
        distance,
        specs as DeliverySpecs,
      );
      if (priceResult) {
        showNotification("Thanks for the order!", "success", 5);
      }
    } catch (error: unknown) {
      showNotification(handleApiErrors(error), "error", 5);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="form-details"
      onSubmit={getBrowserLocation}
      data-test-id="formDetails"
    >
      {isLoading && <Loading />}
      <TextInput
        label="Venue slug"
        name="venueSlug"
        id="venueSlug"
        dataTestId="venueSlug"
        placeholder="Venue..."
        value={userInputs.venueSlug}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errors={errors}
      />
      <TextInput
        label="Cart value (EUR)"
        name="cartValue"
        id="cartValue"
        dataTestId="cartValue"
        placeholder="Value..."
        value={userInputs.cartValue || ""}
        onChange={handleInput}
        onFocus={handleFocus}
        errors={errors}
      />
      <TextInput
        label="User latitude"
        name="userLatitude"
        id="userLatitude"
        dataTestId="userLatitude"
        placeholder="Latitude..."
        value={userInputs.userLatitude || ""}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errors={errors}
      />
      <TextInput
        label="User longitude"
        name="userLongitude"
        id="userLongitude"
        dataTestId="userLongitude"
        placeholder="Longitude..."
        value={userInputs.userLongitude || ""}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errors={errors}
      />
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
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
            !userInputs.userLatitude ||
            !userInputs.userLongitude ||
            !userInputs.cartValue ||
            !userInputs.venueSlug
          }
        />
      </div>
    </form>
  );
};
