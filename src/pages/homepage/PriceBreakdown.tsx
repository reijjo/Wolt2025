import "./PriceBreakdown.css";

import { usePriceContext } from "../../context";
import { useValidInputs } from "../../hooks/useValidInputs";
import { formatValue, initialPriceData, parseName } from "../../utils";

export const PriceBreakdown = () => {
  const { priceData } = usePriceContext();
  const { isPriceData } = useValidInputs();

  const data = isPriceData(priceData) ? priceData : initialPriceData;

  return (
    <div
      className="price-breakdown"
      role="region"
      aria-label="Price breakdown details"
    >
      <h2 id="breakdown-title">Price breakdown</h2>
      <div
        className="breakdown-details"
        aria-labelledby="breakdown-title"
        role="list"
      >
        {Object.entries(data)
          .sort()
          .map(([key, value]) => (
            <div
              className={`breakdown-item`}
              key={key}
              data-test-id={`${key}-result`}
              role="listitem"
              tabIndex={0}
            >
              <p className="breakdown-label">{parseName(key)}</p>{" "}
              <span
                data-raw-value={value}
                aria-label={`${parseName(key)}: ${formatValue(key, value)}`}
              >
                {formatValue(key, value)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
