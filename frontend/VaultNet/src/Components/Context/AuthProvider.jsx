import { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import {toast} from "react-toastify"

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync axios headers with accessToken
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  // Fetch user details when logged in
  useEffect(() => {
    if (accessToken) {
      fetchUserDetails();
    } else {
      setUser(null);
      setAccount(null);
      setLoading(false);
    }
  }, [accessToken]);

  // Fetch account details when user is verified
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
      toast.loading("Exiting...")
      await axios.post("/auth/logout", {}, { withCredentials: true });
      toast.dismiss();
      toast.success("Exit Successfull! ")
    } catch (err) {
      toast.dismiss();
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
      setUser(res.data.data);
      console.log(res);
    } catch (err) {
      logout();
      console.error("User fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountDetails = async () => {
    try {
      const res = await axios.get("/customer/account");
      setAccount(res.data.data);
      console.log(res);
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
