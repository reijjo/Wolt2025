import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Loading } from "./Loading";

describe("Loading", async () => {
  test("renders Loading component", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
