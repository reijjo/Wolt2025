import "./DetailsForm.css";

import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import { fetchIpLocation } from "../../api/api";
import { useModal } from "../../context/modal";
import { UserInputs } from "../../utils/types";
import { Modal } from "../Modal";
import { Button } from "../common/Button";
import { TextInput } from "../common/TextInput";

export const DetailsForm = () => {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    venue: "home-assignment-venue-helsinki",
    cart: 0,
    latitude: 0,
    longitude: 0,
  });
  const [useIp, setUseIp] = useState(false);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (useIp) {
      const getIpLocation = async () => {
        const data = await fetchIpLocation();
        if (data) {
          setUserInputs((prev) => ({
            ...prev,
            latitude: data.lat,
            longitude: data.lon,
          }));
        }
        setUseIp(false);
        closeModal();
      };
      getIpLocation();
    }
  }, [useIp, closeModal]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: value }));
  };

  const getLocation = (e: SyntheticEvent) => {
    e.preventDefault();

    const naviSuccess = (position: GeolocationPosition) => {
      console.log("position", position);
      setUserInputs((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
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

      // if (useIp) {
      //   try {
      //     const { data } = await axios.get("https://ipapi.co/json/");
      //     setUserInputs((prev) => ({
      //       ...prev,
      //       latitude: data.latitude,
      //       longitude: data.longitude,
      //     }));
      //   } catch (error: unknown) {
      //     console.error("Error getting location by ip", error);
      //   } finally {
      //     setUseIp(false);
      //     closeModal();
      //   }
      // }
    };
    console.log("useIP", useIp);

    navigator.geolocation.getCurrentPosition(naviSuccess, naviError);
  };

  const calculatePrice = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("Calculating price...");
  };

  return (
    <form className="form-details" onSubmit={getLocation}>
      <TextInput
        label="Venue slug"
        name="venue"
        id="venue"
        dataTestId="venuSlug"
        placeholder="Venue..."
        value={userInputs.venue}
        onChange={handleInput}
      />
      <TextInput
        label="Cart value (EUR)"
        name="cart"
        id="cart"
        dataTestId="cartValue"
        placeholder="Value..."
        value={userInputs.cart || ""}
        onChange={handleInput}
      />
      <TextInput
        label="User latitude"
        name="latitude"
        id="latitude"
        dataTestId="userLatitude"
        placeholder="Latitude..."
        value={userInputs.latitude || ""}
        onChange={handleInput}
      />
      <TextInput
        label="User longitude"
        name="longitude"
        id="longitude"
        dataTestId="userLongitude"
        placeholder="Longitude..."
        value={userInputs.longitude || ""}
        onChange={handleInput}
      />
      <div className="button-group">
        <Button
          className="btn btn-filled"
          type="submit"
          children="Get Location"
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
