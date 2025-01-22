import "./Home.css";

import { usePriceContext } from "../../context";
import { DetailsForm } from "./DetailsForm";
import { PriceBreakdown } from "./PriceBreakdown";

export const Home = () => {
  const { priceData } = usePriceContext();
  const isRealData = priceData !== null;

  return (
    <main className="wrapper" role="main">
      <div className="container">
        <div style={{ display: isRealData ? "none" : "block" }}>
          <DetailsForm />
        </div>
        <div style={{ display: isRealData ? "block" : "none" }}>
          <PriceBreakdown />
        </div>
      </div>
    </main>
  );
};
