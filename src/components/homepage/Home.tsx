import "./Home.css";

import { ChangeEvent, SyntheticEvent, useState } from "react";

import { formatValue, parseName } from "../../utils/helperFunctions";
import { UserInputs } from "../../utils/types";
import { Button } from "../common/Button";
import { Divider } from "../common/Divider";
import { TextInput } from "../common/TextInput";

export const Home = () => {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    venue: "home-assignment-venue-helsinki",
    cart: 0,
    latitude: 0,
    longitude: 0,
  });

  const sampleData = {
    cartValue: 1000,
    smallOrderSurcharge: 0,
    deliveryFee: 190,
    deliveryDistance: 1050,
    totalPrice: 1190,
  };

  const calculatePrice = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("Calculating price...", sampleData);
  };

  console.log(
    "SAMPLE DATA",
    Object.values(sampleData).map((item) => item),
  );

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

    const naviError = (error: GeolocationPositionError) => {
      console.log("error", error);
    };

    navigator.geolocation.getCurrentPosition(naviSuccess, naviError);
  };

  return (
    <main className="wrapper">
      <h1 className="main-header">Delivery Order Price Calculator</h1>
      <div className="container">
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
            />
          </div>
        </form>
        <Divider />
        <div className="price-breakdown">
          <h5>Price breakdown</h5>
          <div className="breakdown-details">
            {Object.entries(sampleData)
              .sort()
              .map(([key, value]) => (
                <div className={`breakdown-item`} key={key}>
                  <p>{parseName(key)}</p>{" "}
                  <span data-raw-value={value}>{formatValue(key, value)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};
