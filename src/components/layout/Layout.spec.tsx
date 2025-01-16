import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { Layout } from "./Layout";

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  Outlet: () => <div>Mock Outlet Content</div>,
}));

describe("Layout", async () => {
  test("renders Layout with mock stuff in it", () => {
    render(<Layout />);
    expect(screen.getByText("Mock Outlet Content")).toBeInTheDocument();
  });
});
