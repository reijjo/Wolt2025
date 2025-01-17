import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { Layout } from "./components/layout/Layout";
import { PriceProvider } from "./context/price";
import { Home } from "./pages/homepage/Home";

function App() {
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
}

export default App;
