import { createContext, useState, useEffect } from "react";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅ start with true

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchUserDetails();
    } else {
      setUser(null);
      setAccount(null);
      setLoading(false); // ⬅ finish loading if no token
    }
  }, [accessToken]);

  useEffect(() => {
    if (user?.emailVerified) {
      fetchAccountDetails();
    } else {
      setAccount(null);
    }
  }, [user]);

  const login = (token, userRole) => {
    setAccessToken(token);
    setRole(userRole);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", userRole);
    navigate("/");
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setAccessToken(null);
      setRole(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      navigate("/vaultnet-authenticate");
    }
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/customer/get-account");
      setUser(res.data);
    } catch (err) {
      console.error("User fetch failed", err);
      logout();
    } finally {
      setLoading(false); // ⬅ only here when API call ends
    }
  };

  const fetchAccountDetails = async () => {
    try {
      const res = await axios.get("/customer/account");
      setAccount(res.data);
      console.log(res)
    } catch (err) {
      console.error("Account fetch failed", err);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        role,
        user,
        account,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
