import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ModalProvider } from "../../context";
import { Modal } from "./Modal";

describe("Modal", () => {
  test("renders Modal component", () => {
    render(
      <ModalProvider>
        <Modal
          header="header here"
          children="I'm modal content"
          okBtn="All Good"
          cancelBtn="Cancel"
          action={() => console.log("Modal action")}
        />
      </ModalProvider>,
    );

    const okBtn = screen.getByRole("button", { name: "All Good" });
    const CancelBtn = screen.getByRole("button", { name: "Cancel" });

    expect(document.querySelector("h6")).toHaveTextContent("header here");
    expect(document.querySelector("p")).toHaveTextContent("I'm modal content");

    expect(okBtn).toBeInTheDocument();
    expect(okBtn).toHaveTextContent("All Good");
    expect(CancelBtn).toBeInTheDocument();
    expect(CancelBtn).not.toHaveTextContent("All Bad");
  });
});
