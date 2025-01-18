import "./PriceBreakdown.css";

import { usePriceContext } from "../../context";
import { useValidInputs } from "../../hooks/useValidInputs";
import { formatValue, initialPriceData, parseName } from "../../utils";

export const PriceBreakdown = () => {
  const { priceData } = usePriceContext();
  const { isPriceData } = useValidInputs();

  const data = isPriceData(priceData) ? priceData : initialPriceData;

  console.log("pricedata", priceData);

  return (
    <div className="price-breakdown">
      <h5>Price breakdown</h5>
      <div className="breakdown-details">
        {Object.entries(data)
          .sort()
          .map(([key, value]) => (
            <div className={`breakdown-item`} key={key} data-test-id={key}>
              <p className="breakdown-label">{parseName(key)}</p>{" "}
              <span data-raw-value={value}>{formatValue(key, value)}</span>
            </div>
          ))}
      </div>
    </div>
  );
};
