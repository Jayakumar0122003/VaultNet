import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";
import { BiSolidBank } from "react-icons/bi";
import {TbWorldDollar} from "react-icons/tb"
import {CiBadgeDollar} from 'react-icons/ci'
import { GiReceiveMoney } from "react-icons/gi";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

export default function AuthPageCreative() {
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", loginData);
    setLoginData({ email: "", password: "" });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Strong password validation
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(signupData.password)) {
      alert(
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
      );
      return;
    }

    // Confirm password check
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signup Data:", signupData);
    setSignupData({ fullName: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row border-b-1 border-sec">
      {/* Left Illustration */}
      <div className="lg:w-1/2 bg-main flex justify-center items-center p-8">
        <div className="text-center text-white ">
          <h1 className="text-5xl font-bold mb-4">Welcome to VaultNet</h1>
          <p className="text-base opacity-90">
            Your trusted partner for secure and smart banking solutions.
          </p>
          <RiMoneyRupeeCircleFill className="w-72 h-72 md:w-80 md:h-80 mt-0 ml-3 md:ml-16" />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="lg:w-1/2 flex justify-center items-center bg-gray-100 p-6 h-screen lg:h-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-sm shadow-lg w-full max-w-sm"
        >
          {/* Conditional Forms */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-main mb-2 flex gap-2 justify-center">
            <BiSolidBank className="w-8 h-8"/>Login to VaultNet
          </h2>
          <p className="text-center text-gray-600 mb-4 text-sm italic">
            "Secure, smart, and seamless banking — just for you."
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
            className="w-full border-0 border-b-2 border-gray-200  focus:outline-none focus:border-main px-1 py-2 placeholder:text-sm placeholder:uppercase"
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
            <a
              href="#"
              className="text-sm text-main hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          </div>


          <button
            type="submit"
            className="w-full bg-main text-white py-2 rounded-sm hover:opacity-90 transition"
          >
            Login Now
          </button>
        </form>
      ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <h2 className="text-2xl lg:text-xl font-bold text-center text-main mb-2 flex gap-1 md:gap-2 justify-center">
                <BiSolidBank className="w-7 h-7 md:w-8 md:h-8 lg:w-7 lg:h-7 pt-1 md:pt-0"/>Create Your Account
              </h2>
              <p className="text-center text-gray-600 mb-4 text-sm lg:text-xs italic">
                "Your journey to smart and secure banking starts here."
              </p>

              <label htmlFor="fullName" className="block text-gray-700 font-medium lg:text-sm mb-0">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={signupData.fullName}
                onChange={handleSignupChange}
                className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-main px-1 py-2 placeholder:text-sm placeholder:uppercase"
                required
              />

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
              <p className="text-xs text-gray-500 -mt-2">
                Password should be at least 8 characters, include an uppercase letter, number, and special character.
              </p>

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

              <button
                type="submit"
                className="w-full bg-main text-white py-2 rounded-sm hover:opacity-90 transition"
              >
                Sign Up
              </button>
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
    </div>
  );
}
