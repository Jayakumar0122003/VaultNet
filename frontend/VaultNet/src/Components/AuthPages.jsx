import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AuthPageCreative() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loginArray, setLoginArray] = useState([]);
  const [signupArray, setSignupArray] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const loginData = { email: formData.email, password: formData.password };
      setLoginArray((prev) => [...prev, loginData]);
      console.log("Login Array:", [...loginArray, loginData]);
    } else {
      const signupData = { ...formData };
      setSignupArray((prev) => [...prev, signupData]);
      console.log("Signup Array:", [...signupArray, signupData]);
    }
    setFormData({ fullName: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Illustration */}
      <div className="md:w-1/2 bg-main flex justify-center items-center p-8">
        <div className="text-center text-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to MyBank</h1>
          <p className="text-lg opacity-90">
            Your trusted partner for secure and smart banking solutions.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Bank Illustration"
            className="w-64 mx-auto mt-6 drop-shadow-lg"
          />
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-sm shadow-lg w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-center text-main mb-6">
            {isLogin ? "Login to MyBank" : "Create Your MyBank Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-main text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          {/* Toggle Auth Mode */}
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
