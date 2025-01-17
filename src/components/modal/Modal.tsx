import "./Modal.css";

import { Dispatch, ReactNode, SetStateAction } from "react";

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
  return (
    <div className="overlay">
      <div className="modal-container">
        <h6 className="modal-header">{header}</h6>
        <p className="modal-content">{children}</p>
        <div className="modal-buttons">
          <Button
            onClick={() => action(true)}
            className="btn btn-filled"
            children={okBtn}
            height="2rem"
            width="100%"
            margin="0 0 0.5rem 0"
          />
          <Button
            onClick={closeModal}
            className="btn btn-outlined"
            children={cancelBtn}
            height="2rem"
            width="100%"
            margin="0 0 0.5rem 0"
          />
        </div>
      </div>
    </div>
  );
};
