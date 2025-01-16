export interface UserInputs {
  venue: string;
  cart: number;
  latitude: number;
  longitude: number;
}

export interface LonLat {
  lon: number;
  lat: number;
}

export interface DeliveryPricing {
  basePrice: number;
  distanceRanges: {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: string;
  }[];
}
export interface DeliverySpecs {
  noSurcharge: number;
  pricing: DeliveryPricing;
}

export interface DeliverySpecsApiResponse {
  order_minimum_no_surcharge: number;
  delivery_pricing: {
    base_price: number;
    distance_ranges: {
      min: number;
      max: number;
      a: number;
      b: number;
      flag: string;
    }[];
  };
}
