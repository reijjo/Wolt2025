import { SyntheticEvent, useState } from "react";

import { fetchIpLocation } from "../api/api";
import { Modal } from "../components";
import { useModalContext } from "../context";
import { UserInputs, initialUserInputs } from "../utils";

export const useGetLocation = () => {
  const [useIp, setUseIp] = useState(false);
  const [userInputs, setUserInputs] = useState<UserInputs>(initialUserInputs);

  const { closeModal, openModal } = useModalContext();

  const updateLocation = (latitude: number, longitude: number) => {
    setUserInputs((prev) => ({
      ...prev,
      userLatitude: latitude,
      userLongitude: longitude,
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
      throw new Error("Error getting location by ip");
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
