import { SyntheticEvent } from 'react'
import { Button } from '../common/Button'
import { TextInput } from '../common/TextInput'
import './Home.css'
import { formatValue, parseName } from '../../utils/helperFunctions'

export const Home = () => {
	const sampleData = {
		"cartValue": 1000,
		"smallOrderSurcharge": 0,
		"deliveryFee": 190,
		"deliveryDistance": 1050,
		"totalPrice": 1190
	}



	const calculatePrice = (e: SyntheticEvent) => {
		e.preventDefault()
		console.log('Calculating price...', sampleData)
	}

	console.log('SAMPLE DATA', Object.values(sampleData).map(item => item))

	return (
		<main className="wrapper">
			<h1 className='main-header'>Delivery Order Price Calculator</h1>
				<form className='form-details' onSubmit={calculatePrice}>
					<TextInput label='Venue slug' name='venue' id='venue' dataTestId='venuSlug' placeholder='Venue...'/>
					<TextInput label='Cart value (EUR)' name='cart' id='cart' dataTestId='cartValue' placeholder='Value...'/>
					<TextInput label='User latitude' name='latitude' id='latitude' dataTestId='userLatitude' placeholder='Latitude...'/>
					<TextInput label='User longitude' name='longitude' id='longitude' dataTestId='userLongitude' placeholder='Longitude...'/>
					<Button type='submit' children='Get Location' margin='1rem 0 0' />
				</form>
				<div className='price-breakdown'>
					<h5>Price breakdown</h5>
					<div className='breakdown-details'>
						{Object.entries(sampleData).sort().map(([key, value]) => (
							<div className={`breakdown-item`} key={key}>
								<p>{parseName(key)}</p> <span data-raw-value={value}>{formatValue(key, value)}</span>
							</div>
						))}
					</div>

				</div>
		</main>
	)
}