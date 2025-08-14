/* eslint-disable no-unused-vars */
import React, { useState,useContext } from "react";
import axios from "../../axiosInstance";
import { IndianRupee } from "lucide-react";
import { FaStarOfLife, FaUniversity } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import MiniAtmService from "../Pages/Payments/MiniAtmService"
import TransactionsPage from "../Pages/Payments/TransactionsPage";
import SupportStrip from "./Support/SupportStrip";
import { AuthContext } from "../Context/AuthContext";
import SetAtmPinPage from "./AccountCreation/SetAtmPinPage";
import Footer from "../Home/Footer";
import { toast } from "react-toastify";

export default function MakePaymentForm() {
  const [activeTab, setActiveTab] = useState("account");
  const [accountForm, setAccountForm] = useState({
    senderAccountNumber: "",
    receiverAccountNumber: "",
    amount: "",
    pin: "",
  });
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
    pin: "",
    receiverAccountNumber: "",
    amount: "",
  });

  const {loading,account} = useContext(AuthContext);
  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e, type) => {
    if (type === "account") {
      setAccountForm({ ...accountForm, [e.target.name]: e.target.value });
    } else {
      setCardForm({ ...cardForm, [e.target.name]: e.target.value });
    }
  };



const handleSubmit = async (type) => {
  // Show loading toast
  const toastId = toast.loading("Processing your payment...");

  try {
    const url =
      type === "account"
        ? "/customer/transfer-account"
        : "/customer/transfer-card";

    const payload = type === "account" ? accountForm : cardForm;

    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Update loading toast to success
    toast.update(toastId, {
      render: `Transaction Successful!`,
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    if (type === "account") {
      setAccountForm({ senderAccountNumber: "", receiverAccountNumber: "", amount: "", pin: "" });
    } else {
      setCardForm({
        cardNumber: "",
        cardHolderName: "",
        expiryDate: "",
        cvv: "",
        pin: "",
        receiverAccountNumber: "",
        amount: "",
      });
    }
    
    setTimeout(() => {
        window.location.reload();
        }, 1000);

  } catch (err) {
    // Update loading toast to error
    toast.update(toastId, {
      render: `Payment Failed: ${err.response?.data?.message || err.message}`,
      type: "error",
      isLoading: false,
      autoClose: 4000,
    });
  }
};


  if (loading || !account) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <>
   {account?.pinSet ?
   <>
    <div className="h-full flex-1 pt-0 lg:pt-10 p-0 w-full">
      <h1 className="text-xl font-semibold  py-5 px-5 md:px-20 text-white bg-main uppercase">Make Payment</h1>

      <h1 className=" text-xl font-bold px-5 md:px-20 py-5 pt-5 md:pt-10  text-gray-800 flex gap-0">{<IndianRupee className="w-7 h-7 pt-1 font-bold"/>}Money Transfer</h1>
      {/* Tabs */}
      <p className="px-5 md:px-24 pb-10 text-xs italic text-gray-500">
  ***Transferring money allows you to securely send funds to other accounts within 
  the same bank or to different banks. Always verify the recipient’s account details 
  before confirming the transfer, and avoid sharing your banking credentials or OTP 
  with anyone. Ensure you are using a secure network to protect your transaction.***
</p>

      <div className="flex mb-6 mx-5 md:mx-20">
        <button
          className={`px-4 py-2 font-medium transition uppercase text-xs ${
            activeTab === "account"
              ? "border-b-2 border-main text-main"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("account")}
        >
          Account To Account
        </button>
        <button
          className={`px-4 py-2 font-medium transition uppercase text-xs ${
            activeTab === "card"
              ? "border-b-2 border-main text-main"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("card")}
        >
          Card To Account
        </button>
      </div>

      {/* Form Box */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm w-[90%] md:w-[80%] mx-5 md:mx-24 ">
        {activeTab === "account" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("account");
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-20 gap-3 md:gap-5">
              <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}Sender Account Number
              </label>
              <input
                type="text"
                name="senderAccountNumber"
                value={accountForm.senderAccountNumber}
                onChange={(e) => handleChange(e, "account")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main "
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}Receiver Account Number
              </label>
              <input
                type="text"
                name="receiverAccountNumber"
                value={accountForm.receiverAccountNumber}
                onChange={(e) => handleChange(e, "account")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}Amount
              </label>
              <input
                type="number"
                name="amount"
                value={accountForm.amount}
                onChange={(e) => handleChange(e, "account")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}PIN
              </label>
              <input
                type="password"
                name="pin"
                value={accountForm.pin}
                onChange={(e) => handleChange(e, "account")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div></div>
            </div>
            <div className="flex justify-center">
              <button
              type="submit"
              className=" w-full md:w-[40%] lg:w-[20%] bg-main text-white py-2 cursor-pointer hover:bg-green-900 uppercase"
            >
              Proceed Payment
            </button>
            </div>
          </form>
        )}

        {activeTab === "card" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("card");
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-10 gap-3 md:gap-5">
              <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={cardForm.cardNumber}
                onChange={(e) => handleChange(e, "card")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}Card Holder Name
              </label>
              <input
                type="text"
                name="cardHolderName"
                value={cardForm.cardHolderName}
                onChange={(e) => handleChange(e, "card")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardForm.expiryDate}
                onChange={(e) => handleChange(e, "card")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">{<FaStarOfLife className="w-2 h-2"/>}CVV</label>
              <input
                type="text"
                name="cvv"
                value={cardForm.cvv}
                onChange={(e) => handleChange(e, "card")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main" >{<FaStarOfLife className="w-2 h-2 "/>}PIN</label>
              <input
                type="password"
                name="pin"
                value={cardForm.pin}
                onChange={(e) => handleChange(e, "card")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}Receiver Account Number
              </label>
              <input
                type="text"
                name="receiverAccountNumber"
                value={cardForm.receiverAccountNumber}
                onChange={(e) => handleChange(e, "card")}
                className="w-full border border-gray-200 rounded-xs p-2 focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                {<FaStarOfLife className="w-2 h-2"/>}Amount
              </label>
              <input
                type="number"
                name="amount"
                value={cardForm.amount}
                onChange={(e) => handleChange(e, "card")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div></div>
            </div>
            <div className="flex justify-center md:mt-2">
              <button
              type="submit"
              className="w-full md:w-[40%] lg:w-[20%] bg-main text-white py-2 hover:bg-green-900 cursor-pointer md:mt-4 uppercase"
            >
              Proceed Payment
            </button>
            </div>
          </form>
        )}
      </div>
    </div>
    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sec  lg:pb-10 mt-14">
              <div className="bg-main py-5 text-xl font-semibold px-5 md:px-20 text-white uppercase ">
                <h1>Mini ATM Service</h1>
              </div>
              <p className="px-5 md:px-24 text-xs italic text-gray-700 py-5">
                ***Managing your finances is easy and secure with our withdrawal and deposit services. Whether you need cash for everyday expenses or want to add funds to your account, our platform ensures fast and reliable transactions. Always double-check your account details before confirming a withdrawal or deposit to avoid errors. For your safety, keep your banking credentials confidential and report any unauthorized transactions immediately. Our goal is to provide you with convenient access to your money anytime, anywhere.***
              </p>
              <div className="flex flex-col lg:flex-row justify-between gap-10 items-center py-10 md:py-20 lg:py-10 lg:pt-0 lg:px-64" >
                <h1 className="flex flex-col justify-center items-center text-3xl lg:text-5xl font-bold text-main uppercase">{<FaUniversity className="text-center text-5xl md:text-8xl"/>}VaultNet Bank</h1>
                <MiniAtmService/>
              </div>
    </motion.div>
    <SupportStrip/>
    <TransactionsPage/>
    <Footer/>
   </>:<>
   <SetAtmPinPage/>
   <Footer/>
   </>
  }
    </>
  );
}
