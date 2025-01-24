import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { ModalProvider, useModalContext } from "../../context";
import { Modal } from "./Modal";

const TestModalWrapper = () => {
  const { isModalOpen, openModal } = useModalContext();

  return (
    <>
      <button
        onClick={() =>
          openModal(
            <Modal
              header="Test Modal"
              children="Modal content"
              okBtn="Confirm"
              cancelBtn="Cancel"
              action={() => console.log("Modal action")}
            />,
          )
        }
      >
        Open Modal
      </button>
      {isModalOpen && <div data-testid="modal-content">Test Modal</div>}
    </>
  );
};

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

  test("ESC closes modal", async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestModalWrapper />
      </ModalProvider>,
    );

    const openModalButton = screen.getByText("Open Modal");
    await user.click(openModalButton);

    expect(screen.getByTestId("modal-content")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
  });

  test("no context error", () => {
    const TestComponent = () => {
      useModalContext();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "useModal must have a ModalProvider",
    );
  });
});
