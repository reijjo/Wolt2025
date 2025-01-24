export interface UserInputs {
  venueSlug: string;
  cartValue: number;
  userLatitude: number;
  userLongitude: number;
}

export interface LonLat {
  lon: number;
  lat: number;
}

export interface LonLatWithStatus {
  venue: LonLat;
  status: number;
}

export interface PriceData {
  cartValue: number | null;
  smallOrderSurcharge: number | null;
  deliveryFee: number | null;
  deliveryDistance: number | null;
  totalPrice: number | null;
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
  status: number;
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
