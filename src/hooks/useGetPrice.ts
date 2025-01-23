import { SyntheticEvent } from "react";

import { usePriceContext } from "../context";
import { DeliverySpecs, UserInputs, initialUserInputs } from "../utils";
import { useApi } from "./useApi";
import { NotificationType } from "./useDetailsForm";
import { usePriceCalculations } from "./usePriceCalculations";
import { useValidInputs } from "./useValidInputs";

interface UseGetPriceProps {
  setIsLoading: (value: boolean) => void;
  setErrors: (value: { [key: string]: string }) => void;
  showNotification: (
    message: string,
    type: NotificationType,
    time: number,
  ) => void;
  clearNotification: () => void;
  userInputs: UserInputs;
  setUserInputs: (value: UserInputs) => void;
}

export const useGetPrice = ({
  setIsLoading,
  setErrors,
  showNotification,
  clearNotification,
  userInputs,
  setUserInputs,
}: UseGetPriceProps) => {
  const { validateUserInputs } = useValidInputs();
  const { getOrderInfo, getPrice } = usePriceCalculations();
  const { handleApiErrors } = useApi();
  const { setPriceData } = usePriceContext();

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
      const price = getPrice(userInputs, distance, specs as DeliverySpecs);
      if (price) {
        setUserInputs(initialUserInputs);
      }
    } catch (error: unknown) {
      setPriceData(null);
      showNotification(handleApiErrors(error), "error", 5);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    calculatePrice,
  };
};
