import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { Layout } from "./components";
import { PriceProvider } from "./context";
import { Home } from "./pages/homepage/Home";

export const App = () => {
  return (
    <PriceProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </PriceProvider>
  );
};
