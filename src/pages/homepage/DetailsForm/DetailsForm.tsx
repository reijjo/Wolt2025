import "./DetailsForm.css";

import { ChangeEvent, useEffect, useState } from "react";

import deliverypic from "../../../assets/delivery2.webp";
import { Loading, Notification } from "../../../components";
import { useModalContext } from "../../../context";
import { useApi } from "../../../hooks/useApi";
import { useDetailsForm } from "../../../hooks/useDetailsForm";
import { useGetLocation } from "../../../hooks/useGetLocation";
import { useGetPrice } from "../../../hooks/useGetPrice";
import { UserInputs, initialUserInputs } from "../../../utils";
import { FormButtons } from "./FormButtons";
import { FormInputs } from "./FormInputs";

export const DetailsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInputs, setUserInputs] = useState<UserInputs>(initialUserInputs);

  const {
    errors,
    setErrors,
    notification,
    showNotification,
    clearNotification,
    handleFocus,
    handleBlur,
    invalidInput,
  } = useDetailsForm({ userInputs });
  const { getBrowserLocation, getIpLocation, useIp } = useGetLocation({
    setUserInputs,
  });
  const { handleApiErrors } = useApi();
  const { closeModal } = useModalContext();
  const { calculatePrice } = useGetPrice({
    setIsLoading,
    setErrors,
    showNotification,
    clearNotification,
    userInputs,
    setUserInputs,
  });

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

  return (
    <form
      className="form-details"
      onSubmit={calculatePrice}
      data-test-id="formDetails"
      aria-labelledby="form-title"
    >
      <picture className="form-image">
        <img
          src={deliverypic}
          alt="Delivery Order Price Calculator"
          title="Delivery Order Price Calculator"
        />
      </picture>

      <div className="form-fields">
        {isLoading && <Loading aria-label="Loading..." role="status" />}

        <h1 className="form-header column-span" id="form-title">
          Delivery Order Price Calculator
        </h1>

        <FormInputs
          userInputs={userInputs}
          handleInput={handleInput}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          errors={errors}
        />
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            role="alert"
            aria-live="polite"
            extraClass="column-span"
          />
        )}
        <FormButtons
          userInputs={userInputs}
          getBrowserLocation={getBrowserLocation}
        />
      </div>
    </form>
  );
};
