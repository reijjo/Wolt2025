import { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  title: string;
}

export const IconButton = ({ icon, title, ...props }: IconButtonProps) => {
  return (
    <button {...props}>
      <img src={icon} alt={title} title={title} />
    </button>
  );
};
