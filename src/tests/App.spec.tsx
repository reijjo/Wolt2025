import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { App } from "../App";

describe("App", () => {
  test("renders App component", () => {
    render(<App />);

    expect(
      screen.getByText("Delivery Order Price Calculator"),
    ).toBeInTheDocument();
  });
});
