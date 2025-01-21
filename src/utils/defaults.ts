export const initialUserInputs = {
  venueSlug: "home-assignment-venue-helsinki",
  cartValue: 0,
  userLatitude: 0,
  userLongitude: 0,
};

export const initialPriceData = {
  cartValue: null,
  smallOrderSurcharge: null,
  deliveryFee: null,
  deliveryDistance: null,
  totalPrice: null,
};

export const inputErrors = {
  venueEmpty: "Venue is required",
  venueInvalid: `Venue must be either "home-assignment-venue-helsinki" or "home-assignment-venue-tallinn"`,
  cartComma: "Change ',' to '.'",
  cartEmpty: "Cart value is required",
  cartInvalid: "Cart minimum value is 0.01",
  cartRequired: "Cart minimum value is 0.01",
  cartError: "Invalid cart value",
  latitudeNotNumber: "Latitude must be a number",
  latitudeInvalid: "Latitude must be between -90 and 90",
  longitudeNotNumber: "Longitude must be a number",
  longitudeInvalid: "Longitude must be between -180 and 180",
};
