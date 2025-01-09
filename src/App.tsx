import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import DividendBoard from "./pages/DividendBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dividend-board" element={<DividendBoard />} />
      </Routes>
    </Router>
  );
}

export default App;