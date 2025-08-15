// PrivateRoutes/RoleRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import UnauthorizedPage from "../Auth/UnauthorizedPage";

export default function RoleRoute({ allowedRoles, children }) {
  const { user, loading, role } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // replace with loader component
  }

  console.log({ role, allowedRoles });

  if (!user || !allowedRoles.includes(role)) {
    return <UnauthorizedPage />;
  }

  return children;
}
