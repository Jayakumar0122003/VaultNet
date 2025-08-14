// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import { AuthProvider } from "./Components/Context/AuthProvider";

// Layout
import Navbar from "./Components/Navbar";

// Routes
import AppRoutes from "./AppRoutes";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
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
      </AuthProvider>
    </Router>
  );
}
