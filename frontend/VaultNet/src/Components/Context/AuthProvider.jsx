import { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Initial state: get from localStorage if available
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken") || null
  );
  const [role, setRole] = useState(() =>
    localStorage.getItem("role") || null
  );
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

  // Fetch user/admin data
  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setRole(null);
      setAccount(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (role === "CUSTOMER") {
          const resUser = await axios.get("/customer/get-account");
          setUser(resUser.data.data);
          setRole(resUser.data.data.role); // ensure role comes from API
          if (resUser.data.data.emailVerified) {
            const resAccount = await axios.get("/customer/account");
            setAccount(resAccount.data.data);
          }
        } else if (role === "ADMIN") {
          const resAdmin = await axios.get("/admin/get-user");
          setUser(resAdmin.data);
          setRole(resAdmin.data.role); // ensure role comes from API
          setAccount(null);
        }
      } catch (err) {
        console.error("Fetch failed", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken, role]);

  // Login: receive accessToken + role from server
  const login = ({ accessToken, role }) => {
    if (!accessToken || !role) {
      console.error("Login: accessToken or role missing!");
      return;
    }

    setAccessToken(accessToken);
    setRole(role);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("role", role);

    navigate("/"); // redirect after login
  };

  // Logout
  const logout = async () => {
    const r =role;
    try {
      toast.loading("Exiting...");
      await axios.post("/auth/logout", {}, { withCredentials: true });
      toast.dismiss();
      toast.success("Exit Successful!");
    } catch (err) {
      toast.dismiss();
      console.error("Error logging out:", err);
    } finally {
      setAccessToken(null);
      setRole(null);
      setUser(null);
      setAccount(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      if(r=== "ADMIN"){
        navigate("/vaultnet-authenticate-admin");
      }else{
        navigate("/vaultnet-authenticate");
      }
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
