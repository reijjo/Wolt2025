import { TextInput } from "../../../components";
import { UserInputs } from "../../../utils";

interface FormInputsProps {
  userInputs: UserInputs;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

export const FormInputs = ({
  userInputs,
  handleInput,
  handleFocus,
  handleBlur,
  errors,
}: FormInputsProps) => {
  return (
    <>
      <TextInput
        label="Venue"
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
        extraClass="column-span"
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
        extraClass="column-span"
      />
      <div className="location-inputs column-span">
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
      </div>
    </>
  );
};
