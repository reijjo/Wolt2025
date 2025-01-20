export const fetchSpecsMock = {
  noSurcharge: 1000,
  pricing: {
    basePrice: 190,
    distanceRanges: [
      { min: 0, max: 500, a: 0, b: 0, flag: null },
      { min: 500, max: 1000, a: 100, b: 0, flag: null },
      { min: 1000, max: 1500, a: 200, b: 0, flag: null },
      { min: 1500, max: 2000, a: 200, b: 1, flag: null },
      { min: 2000, max: 0, a: 0, b: 0, flag: null },
    ],
  },
};

export const fetchVenueLocationMock = {
  lat: 60.17012143,
  lon: 24.92813512,
};
