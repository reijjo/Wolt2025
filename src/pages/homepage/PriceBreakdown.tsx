import "./PriceBreakdown.css";

import pricepic from "../../assets/paperbag.jpeg";
import { Button } from "../../components";
import { usePriceContext } from "../../context";
import { useValidInputs } from "../../hooks/useValidInputs";
import { formatValue, initialPriceData, parseName } from "../../utils";

export const PriceBreakdown = () => {
  const { priceData, setPriceData } = usePriceContext();
  const { isPriceData } = useValidInputs();

  const data = isPriceData(priceData) ? priceData : initialPriceData;

  const handleOrderAgain = () => {
    setPriceData(null);
  };

  return (
    <div
      className="price-breakdown"
      role="region"
      aria-label="Price breakdown details"
    >
      <picture className="price-image">
        <img src={pricepic} alt="Price breakdown" title="Price breakdown" />
      </picture>

      <div className="breakdown-container">
        <h1 id="thank-you">Thanks for your order!</h1>
        <div
          className="breakdown-details"
          aria-labelledby="breakdown-title"
          role="list"
        >
          <h2 id="breakdown-title">Price breakdown</h2>
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
        <Button
          className="btn btn-filled"
          type="button"
          children="Order again"
          onClick={handleOrderAgain}
        />
      </div>
    </div>
  );
};
