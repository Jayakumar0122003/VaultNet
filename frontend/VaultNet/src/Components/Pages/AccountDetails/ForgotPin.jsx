import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "../../../axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputsRef = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

const handleSendCode = async () => {
  if (!email.trim()) {
    toast.warning("Please enter your email");
    return;
  }

  const loadingToastId = toast.loading("Sending reset code...");

  try {
    const { data } = await axios.post(
      "/customer/forgot-pin",
      { email: email.trim() },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    toast.dismiss(loadingToastId);

    if (data.status) {  // check 'status' from backend
      toast.success(data.message || "Reset code sent to your email");
      setStep(2); // proceed to OTP input
    } else {
      toast.error(data.message || "Failed to send reset code");
    }

  } catch (error) {
    toast.dismiss(loadingToastId);

    // Use server error message if returned
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

  const loadingToastId = toast.loading("Verifying...");

  try {
    const { data } = await axios.post(
      "/customer/verify-pin-otp",
      { otp: fullCode }, // body only
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // proper headers
        },
      }
    );

    toast.dismiss(loadingToastId);

    if (data.status) {
      toast.success(data.message || "Code verified!");
      setStep(3); // only move if OTP is correct
    } else {
      toast.error(data.message || "Invalid or expired code");
      return; // do not move next
    }


  } catch (error) {
    toast.dismiss(loadingToastId);
    toast.error(
      error.response?.data?.message || "Something went wrong"
    );
  }
};


  const handleCodeChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits or empty
    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  // Limit PIN inputs to digits and max length 4
  const handlePinChange = (setter) => (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Remove non-digit chars
    if (val.length <= 4) {
      setter(val);
    }
  };

 const handleResetPassword = async () => {
  if (!password || !confirmPassword) {
    toast.warning("Please enter both PIN fields");
    return;
  }

  if (password.length !== 4 || confirmPassword.length !== 4) {
    toast.error("PIN must be exactly 4 digits");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("PINs do not match");
    return;
  }

  const loadingToast = toast.loading("Resetting PIN...");

  try {
    const response = await axios.post(
      `/customer/reset-pin`,
      { newPin: password }, // body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    toast.dismiss(loadingToast);
    if (response.data?.success) {
      toast.success(response.data.message || "ATM PIN reset successful!");
      navigate("/"); // redirect after success
    } else {
      toast.error(response.data?.message || "Failed to reset ATM PIN");
    }
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(error.response?.data?.message || "Failed to reset ATM PIN");
  }
};


  return (
    <div className="h-[90vh] md:h-[90vh] flex items-center justify-center bg-gray-100">
      <div className="w-[80%] md:w-full max-w-md bg-white p-8 rounded-sm ">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-main dark:text-white mb-2">
            {step === 1 && 'Forgot your ATM pin?'}
            {step === 2 && 'Check your inbox'}
            {step === 3 && 'Reset ATM Pin'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {step === 1 && 'Enter your email address to get a reset code.'}
            {step === 2 && 'We sent a 6-digit code to your email. Enter it below.'}
            {step === 3 && 'Set a new 4-digit PIN for your account.'}
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
                className="w-full bg-main dark:bg-gray-900 hover:bg-sec hover:text-gray-700 text-white font-medium py-2 rounded-sm duration-300 text-xs md:text-sm"
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
                className="w-full bg-main hover:bg-sec hover:text-gray-700 dark:bg-gray-900 text-white font-medium py-2 duration-300 rounded-sm text-xs md:text-sm"
              >
                Verify Code
              </button>
            </div>
          </>
        )}

        {/* Step 3: New PIN */}
        {step === 3 && (
          <>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New ATM Pin (4 digits)"
              value={password}
              onChange={handlePinChange(setPassword)}
              maxLength={4}
              inputMode="numeric"
              pattern="\d*"
              className="w-full border-0 mb-3 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-main px-1 py-2"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm ATM Pin"
              value={confirmPassword}
              onChange={handlePinChange(setConfirmPassword)}
              maxLength={4}
              inputMode="numeric"
              pattern="\d*"
              className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-main px-1 py-2"
            />

            {confirmPassword && (
              <p
                className={`text-xs mt-1 ${
                  confirmPassword === password
                    ? 'text-gray-600'
                    : 'text-red-600'
                }`}
              >
                {confirmPassword === password
                  ? 'ATM Pin match'
                  : 'ATM Pin do not match'}
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
                Show Pin
              </label>
            </div>

            <div className='flex justify-center pt-1'>
              <button
                onClick={handleResetPassword}
                disabled={confirmPassword !== password || password.length !== 4}
                className={`w-full bg-main dark:bg-gray-900 hover:bg-sec hover:text-gray-700 text-white font-medium py-2 rounded-sm duration-300 text-xs md:text-sm ${
                  confirmPassword !== password || password.length !== 4 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Reset ATM Pin
              </button>
            </div>
          </>
        )}

        {/* Footer Section */}
        <div className="text-center mt-6">
          {step === 1 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Remember your ATM Pin?{" "}
              <span className="text-gray-800 hover:underline cursor-pointer">
                <Link to="/">Back to Home</Link>
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
