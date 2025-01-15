import { Outlet } from "react-router-dom";

import { ModalProvider } from "../context/modal";

export const Layout = () => (
  <main className="layout-main">
    <ModalProvider>
      <Outlet />
    </ModalProvider>
  </main>
);
