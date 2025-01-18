import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import { ModalProvider, PriceProvider } from "../../context";
import { Home } from "./Home";

describe("Home", () => {
  beforeEach(() => {
    render(
      <ModalProvider>
        <PriceProvider>
          <Home />
        </PriceProvider>
      </ModalProvider>,
    );
  });
  test("renders Home component", () => {
    const main = document.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main?.childElementCount).toBe(2);

    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();
    expect(container?.childElementCount).toBe(3);

    expect(document.querySelector("h1")?.textContent).toBe(
      "Delivery Order Price Calculator",
    );
  });
});
