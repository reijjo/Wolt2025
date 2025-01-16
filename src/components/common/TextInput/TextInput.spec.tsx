import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import { customTestId } from "../../../tests/utils";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
  beforeEach(() => {
    render(
      <TextInput
        label="Test field"
        name="teemu"
        id="teemu"
        dataTestId="idTestData"
      />,
    );
  });

  test("renders TextInput component", () => {
    const input = customTestId("idTestData");
    const label = document.querySelector("label");

    expect(input).toBeInTheDocument();
    expect(label).toHaveTextContent("Test field");
  });

  test("you can type into the input", async () => {
    const user = userEvent.setup();

    const input = customTestId("idTestData");
    await user.type(input, "Haloo");

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Haloo");

    await user.clear(input);
    expect(input).not.toHaveValue("Haloo");
    expect(input).toHaveValue("");
  });

  test("handles blur/focus events", async () => {
    const user = userEvent.setup();
    const input = customTestId("idTestData");

    expect(input).not.toHaveFocus();
    await user.click(input);
    expect(input).toHaveFocus();

    (input as HTMLElement).blur();
    expect(input).not.toHaveFocus();
  });
});
