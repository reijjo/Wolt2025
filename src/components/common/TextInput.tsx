import "./TextInput.css";

import { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  id: string;
  dataTestId: string;
  width?: string;
  errors?: { [key: string]: string };
}

export const TextInput = ({
  label,
  name,
  id,
  dataTestId,
  width = "100%",
  errors,
  ...props
}: TextInputProps) => {
  console.log("INPUTERRORS", errors);

  return (
    <div className="text-input">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        name={name}
        id={id}
        data-test-id={dataTestId}
        {...props}
        style={{ width: width }}
      />
      {errors && <div className="error">{errors[name]}</div>}
    </div>
  );
};
