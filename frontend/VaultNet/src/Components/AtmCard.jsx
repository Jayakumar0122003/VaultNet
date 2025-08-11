import React, { useState } from "react";
import { FiLock } from "react-icons/fi";
import axiosInstance from "../axiosInstance";

export default function AtmCard() {
  const [showInput, setShowInput] = useState(false);
  const [inputDigits, setInputDigits] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState(null);

  const handleViewClick = () => {
    setShowInput(true);
  };

  const handleVerify = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (inputDigits.length !== 4) {
      setError("Please enter exactly 4 digits.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // API call: send last 4 digits as query or payload as required
      const response = await axiosInstance.post("/customer/get-card-details", {
        lastFourDigitsPhone: inputDigits ,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Example: assuming response.data has card details without cvv
      const data = response.data;

      // Add masked CVV
      data.cvv = "***";

      setCardData(data);
      setIsVerified(true);
      setShowInput(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch card details. Please check your digits and try again."
      );
      setIsVerified(false);
      setCardData(null);
    } finally {
      setLoading(false);
      setInputDigits("");
    }
  };

  return (
    <div className="font-sans w-full md:w-[400px] mx-auto mt-5 text-[#0A5840]">
      <h2 className="text-center mb-5 font-bold text-xl">Your ATM Card</h2>

      {!isVerified ? (
        <div
          className="
            relative w-full h-60 rounded-lg
            bg-main shadow-lg
            text-white
            flex flex-col justify-center items-center
            p-5 cursor-default select-none
          "
          aria-label="Locked ATM Card"
        >
          {/* Lock Icon */}
          <FiLock size={60} className="opacity-70" aria-label="Locked card" />

          <p className="mt-4 text-lg font-semibold text-center">
            Card information is hidden for security
          </p>

          {!showInput ? (
            <button
              onClick={handleViewClick}
              className="
                mt-5 px-6 py-2 rounded-full bg-green-600
                font-bold text-white
                shadow-md
                hover:bg-green-700
                transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-green-400
              "
              aria-label="View ATM card"
            >
              View Card
            </button>
          ) : (
            <div className="mt-5 flex flex-col items-center w-full">
              <label
                htmlFor="phoneDigits"
                className="mb-1 font-semibold text-sm text-green-200"
              >
                Enter last 4 digits of your phone number:
              </label>
              <input
                id="phoneDigits"
                type="password"
                maxLength={4}
                value={inputDigits}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setInputDigits(e.target.value);
                    setError("");
                  }
                }}
                autoFocus
                aria-label="Phone number last 4 digits input"
                className="
                  p-2.5 text-lg rounded-md border-none
                  w-4/5 text-center tracking-widest
                  outline-none
                "
              />
              <button
                onClick={handleVerify}
                disabled={inputDigits.length !== 4 || loading}
                className={`
                  mt-4 px-6 py-2 rounded-full
                  font-bold text-white
                  shadow-md
                  transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-green-400
                  ${
                    inputDigits.length === 4 && !loading
                      ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                      : "bg-gray-500 cursor-not-allowed"
                  }
                `}
                aria-label="Verify phone digits"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
              {error && (
                <p className="mt-3 text-red-500 font-semibold" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        cardData && (
          <div
            className="
              w-full h-60 rounded-lg
              bg-gradient-to-br from-main via-green-900 to-green-800
              text-green-200
              p-8
              shadow-2xl
              font-mono font-semibold
              relative
              select-none
            "
            aria-label="ATM Card details"
          >
            {/* Card chip */}
            <div
              className="
                w-15 h-10 rounded-sm
                bg-gradient-to-br from-yellow-500 to-yellow-700
                shadow-inner
              "
            ></div>

            {/* Card Network */}
            <div
              className="
                absolute top-9 right-6
                font-extrabold text-2xl tracking-widest
                text-yellow-400
                drop-shadow-md
              "
            >
              VISA
            </div>

            {/* Card Number */}
            <div className="mt-5 text-lg md:text-2xl tracking-widest font-bold select-text text-center">
              {cardData.cardNumber}
            </div>

            {/* Card Holder & Expiry */}
            <div className="mt-6 flex  justify-between items-center text-base tracking-wide">
              <div>
                <div className="text-xs opacity-70">Card Holder</div>
                <div>{cardData.cardHolderName}</div>
              </div>

              <div>
                <div className="text-xs opacity-70">Expires</div>
                <div>{cardData.expiryDate}</div>
              </div>
            </div>

            {/* CVV */}
            <div className="absolute bottom-6 right-8 text-sm opacity-70">
              CVV: {cardData.cvv}
            </div>
          </div>
        )
      )}
    </div>
  );
}
