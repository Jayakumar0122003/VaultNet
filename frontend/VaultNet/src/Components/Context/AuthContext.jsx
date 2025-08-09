import { createContext, useState, useEffect } from "react";
import axios from "../../axiosInstance"; // Adjusted path
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add Authorization header globally
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  // Fetch user details on token change
  useEffect(() => {
    if (accessToken) {
      fetchUserDetails();
    }
  }, [accessToken]);

  const login = (token, userRole) => {
    setAccessToken(token);
    setRole(userRole);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", userRole);
    navigate("/"); // Redirect after login
  };

const logout = async () => {
  try {
    await axios.post("/auth/logout", {}, { withCredentials: true }); 
    // ^ withCredentials is important if refresh token is in cookies
  } catch (err) {
    console.error("Error logging out:", err);
  } finally {
    setAccessToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    navigate("/auth");
  }
};

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/customer/get-account", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Attach token
      },});
      setUser(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("User fetch failed", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        role,
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
