import { createContext, useContext } from "react";

import { PriceData } from "../../utils/types";

interface PriceContextType {
  priceData: PriceData | null;
  setPriceData: (data: PriceData | null) => void;
}
export const PriceContext = createContext<PriceContextType | undefined>(
  undefined,
);

export const usePriceContext = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error("usePriceContext must have a PriceProvider");
  }
  return context;
};
