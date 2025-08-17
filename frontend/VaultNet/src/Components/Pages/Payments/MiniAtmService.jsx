import React, { useState } from "react";
import { FaUniversity, FaMoneyBillWave, FaLock } from "react-icons/fa";
import axiosInstance from "../../../axiosInstance"; // your axios with token
import {toast} from "react-toastify"
import { Link } from "react-router-dom";

export default function ProfessionalAtmForm() {
  const [mode, setMode] = useState("deposit"); // "deposit" or "withdraw"
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

const handleAccountInput = (e) => {
  // Remove existing spaces
  let value = e.target.value.replace(/\s+/g, "");

  // Add space every 4 digits
  value = value.replace(/(\d{4})/g, "$1 ").trim();

  // Store formatted value in state (with spaces)
  setAccountNumber(value);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!accountNumber.trim()) {
    toast.error("Account Number is required.");
    return;
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    toast.error("Enter a valid positive amount.");
    return;
  }
  if (mode === "withdraw" && !pin.trim()) {
    toast.error("PIN is required for withdrawal.");
    return;
  }

  setLoading(true);

  const accessToken = localStorage.getItem("accessToken");

  const payload =
    mode === "deposit"
      ? { accountNumber, amount: Number(amount) }
      : { accountNumber, pin, amount: Number(amount) };

  const endpoint = mode === "deposit" ? "/customer/deposit-money" : "/customer/withdraw-money";

  // Show loading toast and keep its ID so we can update/close it later
  const toastId = toast.loading(mode === "deposit" ? "Depositing..." : "Withdrawing...");

  try {
    await axiosInstance.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    toast.dismiss();
    toast.success(
      mode === "deposit"
        ? `₹${Number(amount).toFixed(2)} deposited successfully!`
        : `₹${Number(amount).toFixed(2)} withdrawn successfully!`,
      { id: toastId }
    );

    setAccountNumber("");
    setPin("");
    setAmount("");

    // navigate("/create-bank-account"); // Redirect on success
    setTimeout(() => {
        window.location.reload();
      }, 1000);
  } catch (err) {
    toast.dismiss();
    toast.error(
      err.response?.data?.message || err.message || "Transaction failed. Please try again.",
      { id: toastId }
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className=" w-[90%] md:w-[400px] mt-10 p-8 bg-main text-white shadow-sm">
      <h1 className="text-2xl font-extrabold text-white mb-4 text-center">
        ATM
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8 bg-gray-100 rounded-lg shadow-inner">
        <button
          onClick={() => {
            setMode("deposit");
          }}
          className={`flex items-center cursor-pointer gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            mode === "deposit"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-200"
          }`}
          aria-selected={mode === "deposit"}
          role="tab"
          type="button"
        >
          <FaMoneyBillWave className="text-xl" />
          Deposit
        </button>
        <button
          onClick={() => {
            setMode("withdraw");
          }}
          className={`flex items-center cursor-pointer gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            mode === "withdraw"
              ? "bg-yellow-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-200"
          }`}
          aria-selected={mode === "withdraw"}
          role="tab"
          type="button"
        >
          <FaLock className="text-xl" />
          Withdraw
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6" role="tabpanel">
        {/* Account Number */}
        <div>
          <label
            htmlFor="accountNumber"
            className="block text-white font-semibold mb-2"
          >
            Account Number
          </label>
          <div className="relative">
            <FaUniversity className="absolute left-3 top-3 text-gray-400" />
            <input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={handleAccountInput}
              disabled={loading}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="ENTER YOUR ACCOUNT NUMBER"
              aria-describedby="accountNumberHelp"
            />
          </div>
        </div>

        {/* PIN (only withdraw) */}
        {mode === "withdraw" && (
          <div>
            <label
              htmlFor="pin"
              className="block text-white font-semibold mb-2"
            >
              PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={loading}
              required={mode === "withdraw"}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              placeholder="ENTER YOUR PIN"
              aria-describedby="pinHelp"
            />
            <Link to={"/vaultnet-forgot-atm-pin"} className="p-2 md:p-4 pb-0 text-xs hover:underline">Forgot ATM Card Pin?</Link>
          </div>
        )}

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-white font-semibold mb-2"
          >
            Amount (₹)
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="ENTER AMOUNT"
            aria-describedby="amountHelp"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-sm font-bold cursor-pointer text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? mode === "deposit"
              ? "Depositing..."
              : "Withdrawing..."
            : mode === "deposit"
            ? "Deposit Money"
            : "Withdraw Money"}
        </button>
      </form>
    </div>
  );
}
