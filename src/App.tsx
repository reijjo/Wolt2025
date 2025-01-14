import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { Home } from "./components/homepage/Home"

function App() {

  return (
    <Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="*" element={<Navigate to='/' replace />} />
			</Routes>
		</Router>
  )
}

export default App
