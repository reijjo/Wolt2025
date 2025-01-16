import "./Button.css";

import { ButtonHTMLAttributes, CSSProperties } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  margin?: string;
  className?: string;
  height?: string;
  style?: CSSProperties;
}

export const Button = ({
  width = "auto",
  margin,
  className,
  style,
  height = "2.5rem",
  ...props
}: ButtonProps) => {
  const mergedStyles = {
    width,
    height,
    margin,
    ...style,
  };

  return <button className={className} {...props} style={mergedStyles} />;
};
