import { ReactNode, useState } from "react";

import { PriceData } from "../../utils/types";
import { PriceContext } from "./PriceContext";

interface PriceProviderProps {
  children: ReactNode;
}

export const PriceProvider = ({ children }: PriceProviderProps) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);

  return (
    <PriceContext.Provider value={{ priceData, setPriceData }}>
      {children}
    </PriceContext.Provider>
  );
};
