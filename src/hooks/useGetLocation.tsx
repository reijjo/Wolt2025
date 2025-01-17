import { SyntheticEvent, useState } from "react";

import { fetchIpLocation } from "../api/api";
import { Modal } from "../components";
import { useModalContext } from "../context";
// import { useDetailsForm } from "./useDetailsForm";
import { UserInputs, initialUserInputs } from "../utils";

export const useGetLocation = () => {
  const [useIp, setUseIp] = useState(false);
  const [userInputs, setUserInputs] = useState<UserInputs>(initialUserInputs);

  // const { setUserInputs } = useDetailsForm();
  const { closeModal, openModal } = useModalContext();

  const updateLocation = (latitude: number, longitude: number) => {
    setUserInputs((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const getIpLocation = async () => {
    console.log("WHAT IS THIS");
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

  return {
    useIp,
    setUseIp,
    getBrowserLocation,
    getIpLocation,
    userInputs,
    setUserInputs,
  };
};
