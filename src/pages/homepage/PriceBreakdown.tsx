import "./PriceBreakdown.css";

// import { usePriceCalculations } from "../../hooks/usePriceCalculations";
import { formatValue, parseName } from "../../utils/helperFunctions";

export const PriceBreakdown = () => {
  // const { priceData } = usePriceCalculations();

  const sampleData = {
    cartValue: 1000,
    smallOrderSurcharge: 0,
    deliveryFee: 190,
    deliveryDistance: 1050,
    totalPrice: 1190,
  };

  // console.log("pricedata", priceData);
  console.log("dampleData", sampleData);

  return (
    <div className="price-breakdown">
      <h5>Price breakdown</h5>
      <div className="breakdown-details">
        {Object.entries(sampleData)
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
