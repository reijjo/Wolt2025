import { Button } from '../common/Button'
import { TextInput } from '../common/TextInput'
import './Home.css'

export const Home = () => {
	return (
		<main className="wrapper">
			<h1 className='main-header'>Delivery Order Price Calculator</h1>
				<form className='form-details'>
					<TextInput label='Venue slug' name='venue' id='venue' dataTestId='venuSlug' placeholder='Venue...'/>
					<TextInput label='Cart value (EUR)' name='cart' id='cart' dataTestId='cartValue' placeholder='Value...'/>
					<TextInput label='User latitude' name='latitude' id='latitude' dataTestId='userLatitude' placeholder='Latitude...'/>
					<TextInput label='User longitude' name='longitude' id='longitude' dataTestId='userLongitude' placeholder='Longitude...'/>
					<Button type='submit' children='Get Location' margin='1rem 0 0' />
				</form>
				<div className='price-breakdown'>
					<h5>Price breakdown</h5>
					<div className='breakdown-details'>
						<div className='breakdown-item'>
							<p>Cart Value</p> <span data-raw-value='1000'>10.00 &euro;</span>
							</div>
							<div className='breakdown-item'>
							<p>Delivery fee</p> <span data-raw-value='190'>1.90 &euro;</span>
							</div>
							<div className='breakdown-item'>

							<p>Delivery distance</p> <span data-raw-value='177'>177 m</span>
							</div>
							<div className='breakdown-item'>

							<p>Small order surcharge</p> <span data-raw-value='000'>0.00 &euro;</span>
							</div>
							<div className='breakdown-item'>

							<p>Total price</p> <span data-raw-value='1190'>11.90 &euro;</span>
						</div>
					</div>
				</div>
		</main>
	)
}