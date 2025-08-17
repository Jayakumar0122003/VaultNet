import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { BiSolidBank } from "react-icons/bi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function AdminAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.search]);

  const [loginData, setLoginData] = useState({ email: "", password: "" , expectedRole: "ADMIN"});
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    toast.loading("Logging in...");

    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      loginData,
      { withCredentials: true }
    );

    toast.dismiss();

    if (response.status === 200) {
      toast.success("Login successful!", { autoClose: 3000 });

      login({
        accessToken: response.data.accessToken,
        role: response.data.role
      });

      setLoginData({ email: "", password: "" });
      setIsCompleted(true);
      navigate("/");
    }

  } catch (error) {
    toast.dismiss();
    setIsSubmitting(false);
    // Extract message from backend or fallback
    const message = error.response?.data?.error || "Login failed. Please try again.";

    // Show based on status code
    if (error.response?.status === 403) {
      toast.error("You are not authorized to log in here.");
    } else if (error.response?.status === 401) {
      toast.error("Invalid email or password.");
    } else if (error.response?.status === 404) {
      toast.error("User not found.");
    } else {
      toast.error(message);
    }

    console.error("Login Error:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(signupData.password)) {
      toast.error(
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.",
        { position: "top-right", autoClose: 3000 }
      );
      setIsSubmitting(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right", autoClose: 3000 });
      setIsSubmitting(false);
      return;
    }

    try {
      toast.loading("Registering...");
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          username: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
          role: "ADMIN", // ✅ Admin role
        }
      );
      toast.dismiss();
      toast.success("Admin signup successful!", { position: "top-right", autoClose: 3000 });
      setIsCompleted(true);
      console.log("Admin Signup Response:", response.data);
      setSignupData({ fullName: "", email: "", password: "", confirmPassword: "" });
      navigate("/vaultnet-authenticate-admin?mode=login"); // redirect to login page
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Signup failed.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Admin Signup Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full md:h-screen lg:h-[92vh] flex flex-col lg:flex-row border-b-1 border-sec">
      {/* Left Illustration */}
      
      <div className="lg:w-full flex justify-center items-center bg-gray-100 p-6 h-full lg:h-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white backdrop-blur-lg p-8 shadow-lg w-full max-w-sm ${
            isLogin ? `lg:max-w-2xl` : `lg:max-w-5/6`
          }`}
        >
          <div className="flex justify-center gap-8 mb-6 border-b border-gray-200 pb-2">
            <button
              onClick={() => setIsLogin(true)}
              className={`text-lg font-semibold uppercase tracking-wide ${
                isLogin ? "text-main border-b-2 border-main" : "text-gray-500 hover:text-main"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`text-lg font-semibold uppercase tracking-wide ${
                !isLogin ? "text-main border-b-2 border-main" : "text-gray-500 hover:text-main"
              }`}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-main mb-2 flex gap-2 justify-center uppercase lg:gap-3">
                <BiSolidBank className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                Admin Login
              </h2>
              <p className="text-center text-gray-600 mb-4 text-sm italic lg:mb-5">
                Secure admin access to VaultNet.
              </p>

              <label htmlFor="loginEmail" className="block text-gray-700 font-medium mb-1 lg:text-sm">
                Email Address
              </label>
              <input
                id="loginEmail"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-main px-1 py-2 placeholder:text-sm placeholder:uppercase"
                required
              />

              <label htmlFor="loginPassword" className="block text-gray-700 font-medium mb-1 lg:text-sm">
                Password
              </label>
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-main px-1 py-2 placeholder:text-sm placeholder:uppercase"
                required
              />

              <div className="flex justify-between">
              <div className="flex items-center">
            <input
              id="showPasswordLogin"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPasswordLogin" className="text-gray-700 text-sm">
              Show Password
            </label>
          </div>
          {/* Forgot Password link */}
          <div className="text-right">
            <Link
              href="/vaultnet-authenticate-forgot-password"
              className="text-sm text-main hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          </div>

              <div className="flex justify-center">
               <button
                  disabled={isSubmitting || isCompleted}
                  type="submit"
                  className={`w-full bg-main text-white py-2 duration-300 transition lg:w-[50%]
                    ${isSubmitting || isCompleted ? "cursor-not-allowed bg-main opacity-50" : "hover:opacity-80 cursor-pointer"}
                  `}
                >
                  {isCompleted ? "Completed" : isSubmitting ? "Logging..." : "Login Now"}
                </button>

              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-center text-main mb-2 flex gap-0 md:gap-2 lg:gap-3 justify-center uppercase lg:text-3xl">
                <BiSolidBank className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 pt-1 md:pt-0" />
                Admin Signup
              </h2>
              <p className="text-center text-gray-600 mb-4 text-sm italic">
                Create your admin account.
              </p>

              <div className="lg:grid lg:grid-cols-2 lg:space-x-10 lg:gap-3 lg:p-5 space-y-3">
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 font-medium lg:text-sm mb-0">
                    Username
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your username"
                    value={signupData.fullName}
                    onChange={handleSignupChange}
                    className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-main px-1 py-2 placeholder:text-sm placeholder:uppercase"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="signupEmail" className="block text-gray-700 font-medium mb-0 lg:text-sm">
                    Email Address
                  </label>
                  <input
                    id="signupEmail"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-main px-1 py-2 placeholder:text-sm placeholder:uppercase"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="signupPassword" className="block text-gray-700 font-medium mb-0 lg:text-sm">
                    Password
                  </label>
                  <input
                    id="signupPassword"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-main px-1 py-2 placeholder:text-sm placeholder:uppercase"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 italic px-1">
                    Password should be at least 8 characters, include an uppercase letter, number, and special character.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-0 lg:text-sm">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-main px-1 py-2 placeholder:text-sm placeholder:uppercase"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="showPasswordSignup"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2"
                  />
                  <label htmlFor="showPasswordSignup" className="text-gray-700 text-sm">
                    Show Password
                  </label>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  disabled={isSubmitting || isCompleted}
                  type="submit"
                  className={`w-full bg-main text-white py-2 duration-300 transition lg:w-[40%]
                    ${isSubmitting || isCompleted ? "cursor-not-allowed bg-main opacity-50" : "hover:opacity-80 cursor-pointer"}
                  `}
                >
                  {isCompleted ? "Completed" : isSubmitting ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <p className="text-sm text-center text-gray-600 mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-main cursor-pointer hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </span>
          </p>
        </motion.div>
      </div>
      {/* Right Form Section */}
      <div className="lg:w-1/2 bg-main flex justify-center items-center p-8 py-14 lg:py-0 border-r-1 border-gray-200">
        <div className="text-center text-white flex flex-col justify-between items-center">
         <div>
           <h1 className="text-5xl font-bold mb-4 uppercase">Admin Portal</h1>
          <p className="text-base opacity-90">
            Manage VaultNet securely and efficiently.
          </p>
         </div>
          <RiMoneyRupeeCircleFill className="w-52 h-52 md:w-64 md:h-64" />
        </div>
      </div>
    </div>
  );
}
