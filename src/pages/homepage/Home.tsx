import "./Home.css";

import { Divider } from "../../components";
import { DetailsForm } from "./DetailsForm";
import { PriceBreakdown } from "./PriceBreakdown";

export const Home = () => {
  return (
    <main className="wrapper" role="main">
      <div className="container">
        <DetailsForm />
        <Divider />
        <PriceBreakdown />
      </div>
    </main>
  );
};
