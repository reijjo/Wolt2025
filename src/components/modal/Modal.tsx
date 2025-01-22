import "./Modal.css";

import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";

import { Button } from "../";
import { useModalContext } from "../../context";

interface ModalProps {
  header: string;
  children: ReactNode;
  okBtn: string;
  cancelBtn: string;
  action: Dispatch<SetStateAction<boolean>>;
}

export const Modal = ({
  header,
  children,
  okBtn,
  cancelBtn,
  action,
}: ModalProps) => {
  const { closeModal } = useModalContext();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstButton = modalRef.current?.querySelector("button");
    firstButton?.focus();
  }, []);

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-header"
    >
      <div className="modal-container" ref={modalRef}>
        <h6 className="modal-header" id="modal-header">
          {header}
        </h6>
        <p className="modal-content" role="document">
          {children}
        </p>
        <div className="modal-buttons" role="group" aria-label="Modal actions">
          <Button
            onClick={() => action(true)}
            className="btn btn-filled"
            children={okBtn}
            height="2rem"
            width="100%"
            margin="0 0 0.5rem 0"
            aria-label={okBtn}
            tabIndex={0}
          />
          <Button
            onClick={closeModal}
            className="btn btn-outlined"
            children={cancelBtn}
            height="2rem"
            width="100%"
            margin="0 0 0.5rem 0"
            aria-label={cancelBtn}
            tabIndex={0}
          />
        </div>
      </div>
    </div>
  );
};
