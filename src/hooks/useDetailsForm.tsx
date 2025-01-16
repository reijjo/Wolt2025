import { SyntheticEvent, useState } from "react";

import { fetchIpLocation } from "../api/api";
// import { fetchIpLocation } from "../api/api";
import { Modal } from "../components/modal/Modal";
import { useModalContext } from "../context/modal";
import { initialUserInputs } from "../utils/defaults";
import { UserInputs } from "../utils/types";
import { useParsers } from "./useParsers";

export const useDetailsForm = () => {
  const [userInputs, setUserInputs] = useState<UserInputs>(initialUserInputs);
  const [useIp, setUseIp] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { validateUserInputs } = useParsers();
  const { openModal, closeModal } = useModalContext();

  const updateLocation = (latitude: number, longitude: number) => {
    setUserInputs((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const getIpLocation = async () => {
    try {
      const data = await fetchIpLocation();
      if (data) {
        updateLocation(data.lat, data.lon);
      }
    } catch (error: unknown) {
      console.error("Error getting location by ip", error);
    } finally {
      setUseIp(false);
      closeModal();
    }
  };

  const getBrowserLocation = async (e: SyntheticEvent) => {
    e.preventDefault();

    const naviSuccess = (position: GeolocationPosition) => {
      updateLocation(position.coords.latitude, position.coords.longitude);
    };

    const naviError = async (error: GeolocationPositionError) => {
      if (error.code === 1) {
        openModal(
          <Modal
            header="No location access!"
            children="Please enable location or get your location with IP address, which may be less accurate."
            okBtn="Use IP"
            cancelBtn="Go back"
            action={() => setUseIp(true)}
          />,
        );
      }
    };

    navigator.geolocation.getCurrentPosition(naviSuccess, naviError);
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
    userInputs,
    setUserInputs,
    useIp,
    setUseIp,
    errors,
    setErrors,
    updateLocation,
    getBrowserLocation,
    handleFocus,
    handleBlur,
    getIpLocation,
    invalidInput,
  };
};
