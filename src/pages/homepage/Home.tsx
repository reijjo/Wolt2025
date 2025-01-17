import "./Home.css";

import { DetailsForm } from "./DetailsForm";
import { PriceBreakdown } from "./PriceBreakdown";

export const Home = () => {
  return (
    <main className="wrapper">
      <h1 className="main-header">Delivery Order Price Calculator</h1>
      <div className="container">
        <DetailsForm />
        <PriceBreakdown />
      </div>
    </main>
  );
};
