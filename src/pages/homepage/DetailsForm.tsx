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
      getIpLocation().catch((error) => {
        showNotification(handleApiErrors(error), "error", 5);
      });
    }
  }, [useIp, getIpLocation, closeModal, handleApiErrors, showNotification]);

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
      showNotification(`Please check your inputs`, "error", 5);
      return;
    }

    try {
      setIsLoading(true);
      clearNotification();

      const validationResult = validateUserInputs(userInputs);
      if (!validationResult.isValid) {
        throw new Error(JSON.stringify(validationResult.errors));
      }

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
      aria-labelledby="form-title"
    >
      {isLoading && <Loading aria-label="Loading..." role="status" />}

      <h1 className="form-header" id="form-title">
        Delivery Order Price Calculator
      </h1>

      <TextInput
        label="Venue slug"
        name="venueSlug"
        id="venueSlug"
        dataTestId="venueSlug"
        placeholder="Venue..."
        value={userInputs.venueSlug.toString()}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errors={errors}
        aria-required="true"
        aria-invalid={errors.venueSlug ? "true" : "false"}
        aria-describedby={errors.venueSlug ? "venueSlug-error" : ""}
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
        aria-required="true"
        aria-invalid={errors.cartValue ? "true" : "false"}
        aria-describedby={errors.cartValue ? "cartValue-error" : ""}
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
        aria-required="true"
        aria-invalid={errors.userLatitude ? "true" : "false"}
        aria-describedby={errors.userLatitude ? "userLatitude-error" : ""}
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
        aria-required="true"
        aria-invalid={errors.userLongitude ? "true" : "false"}
        aria-describedby={errors.userLongitude ? "userLongitude-error" : ""}
      />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          role="alert"
          aria-live="polite"
        />
      )}
      <div className="button-group" role="group" aria-label="Form actions">
        <Button
          className="btn btn-filled"
          type="submit"
          children="Get Location"
          data-test-id="getLocation"
          aria-label="Get current location"
          tabIndex={0}
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
          aria-label="Calculate delivery price"
          aria-disabled={
            !userInputs.userLatitude ||
            !userInputs.userLongitude ||
            !userInputs.cartValue ||
            !userInputs.venueSlug
          }
          tabIndex={0}
        />
      </div>
    </form>
  );
};
