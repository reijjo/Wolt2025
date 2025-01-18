import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Notification } from "./Notification";

describe("Notification", () => {
  test("renders Notification component", () => {
    render(<Notification message="notification" type="error" />);
    expect(screen.getByText("notification")).toBeInTheDocument();
  });

  test("ERROR notification", () => {
    render(<Notification message="ERROR message" type="error" />);
    const message = screen.getByText("ERROR message").parentElement;

    expect(message).toBeInTheDocument();
    expect(message).toHaveClass("notification-error");
  });

  test("OK notification", () => {
    render(<Notification message="OK message" type="success" />);
    const message = screen.getByText("OK message").parentElement;

    expect(message).toBeInTheDocument();
    expect(message).toHaveClass("notification-success");
  });
});
