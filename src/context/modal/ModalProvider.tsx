import { ReactNode, useState } from "react";

import { ModalContext } from "./ModalContext";

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, modalContent, isModalOpen }}
    >
      {children}
      {isModalOpen && modalContent}
    </ModalContext.Provider>
  );
};
