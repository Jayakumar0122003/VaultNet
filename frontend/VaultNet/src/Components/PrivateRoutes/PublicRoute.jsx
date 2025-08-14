import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken"); // Or from context
  return accessToken ? <Navigate to="/" /> : children;
}
