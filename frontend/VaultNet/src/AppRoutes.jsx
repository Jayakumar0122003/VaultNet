// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Components/Context/AuthContext";

// Pages
import Home from "./Components/Home";
import AuthPages from "./Components/AuthPages";
import ForgotPasswordPage from "./Components/ForgotPassword";
import CreateAccountPage from "./Components/CreateAccountPage";
import Payments from "./Components/Pages/MakePayment";
import Account from "./Components/Pages/AccountDetails";
import Support from "./Components/Pages/Support";
import VerifyEmailPage from "./Components/VerifyEmailPage";
import SetAtmPinPage from "./Components/SetAtmPinPage";

// Routes
import PrivateRoute from "./Components/PrivateRoutes/PrivateRoute";
import OneTimeRoute from "./Components/PrivateRoutes/OneTimeRoute";

export default function AppRoutes() {
  const { user, account } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/vaultnet-authenticate" element={<AuthPages />} />
      <Route
        path="/vaultnet-authenticate-forgot-password"
        element={<ForgotPasswordPage />}
      />

      {/* Private */}
      <Route
        path="/vaultnet-bank-account"
        element={
          <PrivateRoute>
            <CreateAccountPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/vaultnet-make-payments"
        element={
          <PrivateRoute>
            <Payments />
          </PrivateRoute>
        }
      />
      <Route
        path="/vaultnet-account-details-config"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="/vaultnet-customer-support-care"
        element={
          <PrivateRoute>
            <Support />
          </PrivateRoute>
        }
      />

      {/* One-time use routes */}
      <Route
        path="/vaultnet-set-atm-pin"
        element={
          <OneTimeRoute condition={account?.pinSet} redirectTo="/">
            <SetAtmPinPage />
          </OneTimeRoute>
        }
      />
      <Route
        path="/vaultnet-verify-email"
        element={
          <OneTimeRoute condition={user?.emailVerified} redirectTo="/">
            <VerifyEmailPage />
          </OneTimeRoute>
        }
      />
    </Routes>
  );
}
