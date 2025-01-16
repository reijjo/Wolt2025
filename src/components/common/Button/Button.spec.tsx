import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  test("renders Button component", () => {
    render(<Button children="Hi, I am a button." />);
    expect(screen.getByText("Hi, I am a button.")).toBeInTheDocument();
  });

  test("with red background", () => {
    render(<Button style={{ backgroundColor: "red" }}>Click</Button>);
    const button = screen.getByRole("button", { name: "Click" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle("background-color: rgb(255, 0, 0)");
  });
});
