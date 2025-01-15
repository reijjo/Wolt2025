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
      {errors && errors[name] && (
        <ul className="text-input-error">
          <li>{errors[name]}</li>
        </ul>
      )}
    </div>
  );
};
