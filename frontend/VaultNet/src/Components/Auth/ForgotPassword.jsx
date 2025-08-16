import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {Link,useNavigate} from "react-router-dom"


const ForgotPasswordPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputsRef = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate =useNavigate();


  const validatePassword = (pwd) => {
  const errors = [];

  if (pwd.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(pwd)) errors.push("An uppercase letter (A-Z)");
  if (!/[a-z]/.test(pwd)) errors.push("A lowercase letter (a-z)");
  if (!/[0-9]/.test(pwd)) errors.push("A number (0-9)");
  if (!/[@$!%*?&]/.test(pwd)) errors.push("A special character (@$!%*?&)");

  return errors;
};

  const handleSendCode = async () => {
  if (!email.trim()) {
    toast.warning("Please enter your email");
    return;
  }

  const loadingToastId = toast.loading("Sending reset code...");

  try {
    const response = await axios.post(
      `${API_URL}/api/auth/forgot-password`,
      { email: email.trim() }
    );

    toast.dismiss(loadingToastId);

    // Extract message safely
    const success = response.data?.success;
    const message = response.data?.data?.message || "Reset code sent to your email";

    if (success) {
      toast.success(message);
      setStep(2); // move to next step only on success
    } else {
      toast.error(message || "Failed to send reset code");
    }
  } catch (error) {
    toast.dismiss(loadingToastId);

    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    toast.error(errorMsg);
  }
};


 const handleVerifyCode = async () => {
  const fullCode = code.join('');

  if (fullCode.length !== 6 || code.includes("")) {
    toast.error("Please enter all 6 digits");
    return;
  }

  const loadingToastId = toast.loading("Verifying OTP...");

  try {
    const response = await axios.post(
      `${API_URL}/api/auth/verify-otp`,
      { email, otp: fullCode }
    );

    toast.dismiss(loadingToastId);

    const { success, message } = response.data;

    if (success) {
      toast.success(message || "OTP verified successfully!");
      setStep(3); // Move to next step only on success
    } else {
      toast.error(message || "Invalid or expired code");
    }
  } catch (error) {
    toast.dismiss(loadingToastId);

    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while verifying OTP";
    toast.error(errorMsg);
  }
};


  const handleCodeChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleResetPassword = async () => {
  if (!password || !confirmPassword) {
    toast.warning("Please enter both password fields");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  // Password strength validation
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    toast.warning(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    );
    return;
  }

  const loadingToastId = toast.loading("Resetting password...");

  try {
    const response = await axios.post(
        `${API_URL}/api/auth/reset-password`,
      {
        email,
        newPassword: password,
      }
    );

    toast.dismiss(loadingToastId);

    const { success, message } = response.data;

    if (success) {
      toast.success(message || "Password reset successful!");
      navigate("/vaultnet-authenticate"); // redirect to login
    } else {
      toast.error(message || "Failed to reset password");
    }
  } catch (error) {
    toast.dismiss(loadingToastId);

    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while resetting password";
    toast.error(errorMsg);
  }
};



  return (
    <div className="h-[90vh]  md:h-[90vh] flex items-center justify-center bg-gray-100">
      <div className="w-[80%] md:w-full max-w-md bg-white p-8 rounded-sm ">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-main dark:text-white mb-2">
            {step === 1 && 'Forgot your password?'}
            {step === 2 && 'Check your inbox'}
            {step === 3 && 'Reset password'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {step === 1 && 'Enter your email address to get a reset code.'}
            {step === 2 && 'We sent a 6-digit code to your email. Enter it below.'}
            {step === 3 && 'Set a new password for your account.'}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-4 h-4 rounded-full ${step === s ? 'bg-main dark:bg-gray-900' : 'bg-gray-300 dark:bg-gray-600'}`}
            ></div>
          ))}
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-main px-1 py-2"
            />
            <div className='flex justify-center pt-5'>
              <button
              onClick={handleSendCode}
              className="w-full  bg-main dark:bg-gray-900 hover:bg-sec hover:text-gray-700 text-white font-medium py-2 rounded-sm duration-300 text-xs md:text-sm"
            >
              Send Reset Code
            </button>
            </div>
          </>
        )}

        {/* Step 2: Enter Code */}
        {step === 2 && (
          <>
            <div className="flex justify-between space-x-2 mb-6">
              {code.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, index)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        if (digit === "") {
                          if (index > 0) {
                            inputsRef.current[index - 1].focus();
                          }
                        }
                      } else if (e.key >= "0" && e.key <= "9") {
                        // Optional: allow typing over without selecting
                        setTimeout(() => {
                          if (index < code.length - 1) {
                            inputsRef.current[index + 1].focus();
                          }
                        }, 10);
                      }
                    }}
                    className="w-7 h-9 md:w-10 md:h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />

              ))}
            </div>
            <div className='flex justify-center'>
              <button
              onClick={handleVerifyCode}
              className="w-full bg-main  hover:bg-sec hover:text-gray-700 dark:bg-gray-900 text-white font-medium py-2 duration-300 rounded-sm text-xs md:text-sm"
            >
              Verify Code
            </button>
            </div>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
         <>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => {const pwd = e.target.value;
                      setPassword(pwd);
                      setPasswordErrors(validatePassword(pwd));}}
              className="w-full border-0 mb-3 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-main px-1 py-2"
            />
            {password && passwordErrors.length > 0 && (
              <ul className="text-xs text-gray-600 mb-4 ml-1 list-disc pl-4">
                {passwordErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}


            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-0 border-b-2  dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-main px-1 py-2"
            />
            {confirmPassword && (
                  <p
                    className={`text-xs mt-1 ${
                      confirmPassword === password
                        ? 'text-gray-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {confirmPassword === password
                      ? 'Passwords match'
                      : 'Passwords do not match'}
                  </p>
                )}


            <div className="flex items-center space-x-2 mt-3 mb-4">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="accent-main"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600 dark:text-gray-50">
                Show Password
              </label>
            </div>

            <div className='flex justify-center pt-1'>
              <button
                  onClick={handleResetPassword}
                  disabled={passwordErrors.length > 0 || confirmPassword !== password}
                  className={`w-full bg-main dark:bg-gray-900 hover:bg-sec hover:text-gray-700 text-white font-medium py-2 rounded-sm duration-300 text-xs md:text-sm ${
                    passwordErrors.length > 0 || confirmPassword !== password ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Reset Password
                </button>


            </div>
          </>

        )}

        {/* Footer Section */}
<div className="text-center mt-6">
  {step === 1 && (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Remember your password?{" "}
      <span
        className="text-gray-800 hover:underline cursor-pointer"
        onClick={() => {
          // TODO: replace this with navigate("/login") or a prop-based handler
          toast.info("Navigate back to login page.");
        }}
      >
        <Link to="/vaultnet-authenticate">Back to Login</Link>
      </span>
    </p>
  )}

  {step === 2 && (
    <p className="text-xs text-gray-400 dark:text-gray-500">
      If you didn’t receive the code, check your spam folder.
    </p>
  )}
</div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;