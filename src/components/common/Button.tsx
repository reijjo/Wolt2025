import { ButtonHTMLAttributes } from "react";
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	width?: string;
	margin?: string;
}

export const Button = ({ width = 'auto', margin, ...props }: ButtonProps) => {
	return (
		<button className="btn btn-filled" {...props} style={{ width: width , margin: margin}} />
	);
}