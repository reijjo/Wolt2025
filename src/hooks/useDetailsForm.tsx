import { useState } from "react";

import { UserInputs } from "../utils";
// import { useGetLocation } from "./useGetLocation";
import { useValidInputs } from "./useValidInputs";

export type NotificationType = "error" | "success";
interface Notification {
  message: string;
  type: NotificationType;
}

interface UseDetailsFormProps {
  userInputs: UserInputs;
}

export const useDetailsForm = ({ userInputs }: UseDetailsFormProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<Notification | null>(null);

  const { validateUserInputs } = useValidInputs();
  // const { userInputs } = useGetLocation();

  const showNotification = (
    message: string,
    type: NotificationType,
    time: number,
  ) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, time * 1000);
  };

  const clearNotification = () => {
    showNotification("", "error", 0);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    invalidInput(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Shows input errors on the go
  const invalidInput = (name: string, value: string | number) => {
    const validation = validateUserInputs({ ...userInputs, [name]: value });
    if (!validation.isValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validation.errors[name] || "",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  return {
    errors,
    setErrors,
    notification,
    showNotification,
    clearNotification,
    handleFocus,
    handleBlur,
    invalidInput,
  };
};
