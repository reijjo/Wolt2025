import { InputHTMLAttributes } from 'react';
import './TextInput.css';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	name: string;
	id: string;
	dataTestId: string;
	width?: string;
}

export const TextInput = ({ label, name, id, dataTestId, width = '100%', ...props}: TextInputProps) => {
	return (
		<div className='text-input'>
			<label htmlFor={id}>{label}</label>
			<input type='text' name={name} id={id} data-test-id={dataTestId}  {...props} style={{ width: width}} />
		</div>
	)
}