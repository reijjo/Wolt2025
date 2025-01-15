import "./Button.css";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  margin?: string;
  className?: string;
  height?: string;
}

export const Button = ({
  width = "auto",
  margin,
  className,
  height = "2.5rem",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={className}
      {...props}
      style={{ width: width, margin: margin, height: height }}
    />
  );
};
