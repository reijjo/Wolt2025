import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { customTestId, exampleInputs } from "../../../tests/utils";
import { FormButtons } from "./FormButtons";

describe("FormButtons", () => {
  const mockGetLocation = vi.fn();

  test("renders Icon button", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 480,
    });
    window.dispatchEvent(new Event("resize"));

    render(
      <FormButtons
        userInputs={exampleInputs}
        getBrowserLocation={mockGetLocation}
      />,
    );

    const iconButton = customTestId("getLocation");
    expect(iconButton).toBeInTheDocument();
    expect(iconButton).toHaveClass("btn-icon");
  });
});
