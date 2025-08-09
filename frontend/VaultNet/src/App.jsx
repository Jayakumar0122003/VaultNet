import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import AuthPages from "./Components/AuthPages";
import Home from "./Components/Home";
import Footer from "./Components/Home/Footer";
import Navbar from "./Components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import ForgotPasswordPage from "./Components/Home/forgotPassword";

function App() {
  return (
    <Router>
      {/* Navbar stays on all pages */}
      <Navbar />

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>

      {/* Footer stays on all pages */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Router>
  );
}

export default App;
