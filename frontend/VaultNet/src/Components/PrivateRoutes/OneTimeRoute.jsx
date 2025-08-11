import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function OneTimeRoute({ children, condition, redirectTo }) {
  const { loading } = useContext(AuthContext);

  // While loading user/account data
  if (loading) return <p className="text-center py-10">Loading...</p>;

  // If condition is already true (e.g., PIN set or email verified), redirect
  if (condition) {
    return <Navigate to={redirectTo} replace />;
  }

  // Otherwise show the page
  return children;
}
