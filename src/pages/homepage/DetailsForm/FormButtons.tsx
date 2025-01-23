import { SyntheticEvent } from "react";

import pin from "../../../assets/pin.png";
import { Button, IconButton } from "../../../components";
import { useScreenWidth } from "../../../hooks/useScreenWidth";
import { UserInputs } from "../../../utils";

interface FormButtonsProps {
  userInputs: UserInputs;
  getBrowserLocation: (e: SyntheticEvent) => Promise<void>;
}

export const FormButtons = ({
  userInputs,
  getBrowserLocation,
}: FormButtonsProps) => {
  const isMobile = useScreenWidth();

  const isDisabled =
    !userInputs.userLatitude ||
    !userInputs.userLongitude ||
    !userInputs.cartValue ||
    !userInputs.venueSlug;

  return (
    <div
      className="button-group column-span"
      role="group"
      aria-label="Form actions"
    >
      {isMobile ? (
        <IconButton
          className="btn-icon"
          type="button"
          onClick={getBrowserLocation}
          icon={pin}
          title="Get Location"
          data-test-id="getLocation"
          aria-label="Get current location"
          tabIndex={0}
        />
      ) : (
        <Button
          className="btn btn-outlined"
          type="button"
          onClick={getBrowserLocation}
          children="Get Location"
          data-test-id="getLocation"
          aria-label="Get current location"
          tabIndex={0}
          title="Get Location"
        />
      )}
      <Button
        className="btn btn-filled"
        type="submit"
        children="Calculate delivery price"
        disabled={isDisabled}
        aria-label="Calculate delivery price"
        aria-disabled={isDisabled}
        tabIndex={0}
        title={
          isDisabled ? "Please fill in all fields" : "Calculate delivery price"
        }
      />
    </div>
  );
};
