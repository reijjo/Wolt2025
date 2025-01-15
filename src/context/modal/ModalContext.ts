import { ReactNode, createContext, useContext } from "react";

interface ModalContextType {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode | null;
  isModalOpen: boolean;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must have a ModalProvider");
  }
  return context;
};
