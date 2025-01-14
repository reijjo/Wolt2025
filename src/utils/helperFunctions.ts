export const parseMoney = (value: number): string => {
  return `${(value / 100).toFixed(2)} €`;
};

export const parseDistance = (distance: number): string => {
  return distance >= 1000
    ? `${(distance / 1000).toFixed(2)} km`
    : `${distance} m`;
};

export const formatValue = (key: string, value: number) => {
  if (key === "deliveryDistance") {
    return parseDistance(value);
  }
  return parseMoney(value);
};

export const parseName = (name: string) => {
  const addSpace = name.replace(/([A-Z])/g, " $1").trim();
  return addSpace.charAt(0).toUpperCase() + addSpace.slice(1).toLowerCase();
};
