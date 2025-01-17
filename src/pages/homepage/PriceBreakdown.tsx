import "./PriceBreakdown.css";

import { Divider } from "../../components";
import { usePriceContext } from "../../context";
import { formatValue, parseName } from "../../utils";

export const PriceBreakdown = () => {
  const { priceData } = usePriceContext();

  if (!priceData) {
    return null;
  }

  console.log("pricedata", priceData);

  return (
    <>
      <Divider />

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
    </>
  );
};
