import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";

// Layout
import Navbar from "./Components/Navbar";
import Footer from "./Components/Home/Footer";


// Pages
import Home from "./Components/Home";
import AuthPages from "./Components/AuthPages";
import ForgotPasswordPage from "./Components/ForgotPassword";
import CreateAccountPage from "./Components/CreateAccountPage";
import Bank from "./Components/Pages/BankAccount"
import Payments from "./Components/Pages/MakePayment"
import Account from "./Components/Pages/AccountDetails"
import Support from "./Components/Pages/Support"
import PrivateRoute from "./Components/PrivateRoutes/PrivateRoute.jsx"

// Context
import { AuthProvider } from "./Components/Context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Persistent Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/create-bank-account" element={<CreateAccountPage />} />
          {/* Protected Routes */}
      <Route
        path="/bank"
        element={
          <PrivateRoute>
            <Bank />
          </PrivateRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <PrivateRoute>
            <Payments />
          </PrivateRoute>
        }
      />
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="/support"
        element={
          <PrivateRoute>
            <Support />
          </PrivateRoute>
        }
      />
        </Routes>

        {/* Persistent Footer */}
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
      </AuthProvider>
    </Router>
  );
}

export default App;
