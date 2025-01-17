import "./PriceBreakdown.css";

import { usePriceContext } from "../../context";
import { formatValue, initialPricaData, parseName } from "../../utils";

export const PriceBreakdown = () => {
  const { priceData } = usePriceContext();

  const data = priceData ?? initialPricaData;
  // if (!priceData) {
  //   return null;
  // }

  console.log("pricedata", priceData);

  return (
    <>
      <div className="price-breakdown">
        <h5>Price breakdown</h5>
        <div className="breakdown-details">
          {Object.entries(data)
            .sort()
            .map(([key, value]) => (
              <div className={`breakdown-item`} key={key}>
                <p>{parseName(key)}</p>{" "}
                <span data-raw-value={value}>{formatValue(key, value)}</span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
