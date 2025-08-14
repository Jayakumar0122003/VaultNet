// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Components/Context/AuthContext";

// Pages
import Home from "./Components/Home";
import AuthPages from "./Components/Auth/AuthPages";
import ForgotPasswordPage from "./Components/Auth/ForgotPassword";
import CreateAccountPage from "./Components/Pages/CreateAccountPage";
import Payments from "./Components/Pages/MakePayment";
import Account from "./Components/Pages/AccountDetails";
import Support from "./Components/Pages/Support";
import VerifyEmailPage from "./Components/Pages/AccountCreation/VerifyEmailPage";
import SetAtmPinPage from "./Components/Pages/AccountCreation/SetAtmPinPage";
import ForgotPin from "./Components/Pages/AccountDetails/ForgotPin"


// Routes
import PrivateRoute from "./Components/PrivateRoutes/PrivateRoute";
import OneTimeRoute from "./Components/PrivateRoutes/OneTimeRoute";
import PublicRoute from "./Components/PrivateRoutes/PublicRoute";
import AccountRoute from "./Components/PrivateRoutes/AccountRoute";
import NotFoundPage from "./Components/Auth/NotFoundPage";
import AdminAuthPage from "./Components/Auth/AdminAuthPage";

export default function AppRoutes() {
  const { user, account } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
       <Route path="*" element={<NotFoundPage/>} />
      <Route 
    path="/vaultnet-authenticate" 
    element={
      <PublicRoute>
        <AuthPages />
      </PublicRoute>
    } 
  />
      <Route
        path="/vaultnet-authenticate-forgot-password"
        element={<ForgotPasswordPage />}
      />

      {/* Private */}
      <Route
        path="/vaultnet-bank-account"
        element={
          <AccountRoute>
            <CreateAccountPage />
          </AccountRoute>
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

      <Route
        path="/vaultnet-forgot-atm-pin"
        element={
          <PrivateRoute>
            <ForgotPin/>
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
        path="/vaultnet-verify-account"
        element={
          <OneTimeRoute condition={user?.emailVerified} redirectTo="/">
            <VerifyEmailPage />
          </OneTimeRoute>
        }
      />
      {/* -------------------------------------------------------------------------------------------- */}

      <Route 
    path="/vaultnet-authenticate-admin" 
    element={
      <PublicRoute>
        <AdminAuthPage/>
      </PublicRoute>
    } 
  />

    </Routes>
  );
}
