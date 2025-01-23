import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  test("renders IconButton component", () => {
    render(<IconButton icon="icon" title="title" />);
    const button = screen.getByRole("button");
    const image = screen.getByRole("img");

    expect(button).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });
});
