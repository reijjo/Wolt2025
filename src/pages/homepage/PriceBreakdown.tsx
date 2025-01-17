import "./PriceBreakdown.css";

import { usePriceContext } from "../../context/price";
import { formatValue, parseName } from "../../utils/helperFunctions";

export const PriceBreakdown = () => {
  const { priceData } = usePriceContext();

  if (!priceData) {
    return null;
  }

  console.log("pricedata", priceData);

  return (
    <div className="price-breakdown">
      <h5>Price breakdown</h5>
      <div className="breakdown-details">
        {Object.entries(priceData)
          .sort()
          .map(([key, value]) => (
            <div className={`breakdown-item`} key={key}>
              <p>{parseName(key)}</p>{" "}
              <span data-raw-value={value}>{formatValue(key, value)}</span>
            </div>
          ))}
      </div>
    </div>
  );
};
