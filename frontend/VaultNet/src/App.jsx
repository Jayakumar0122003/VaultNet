import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPages from "./Components/AuthPages";
import Home from "./Components/Home";
import Footer from "./Components/Home/Footer";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <Router>
      {/* Navbar stays on all pages */}
      <Navbar />

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPages />} />
      </Routes>

      {/* Footer stays on all pages */}
      <Footer />
    </Router>
  );
}

export default App;
