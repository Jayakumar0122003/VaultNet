import { useState } from "react";
import axiosInstance from "../../../axiosInstance"; // adjust path
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaPhone } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { FaCity } from "react-icons/fa";
import { BsSignpostSplitFill } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";



export default function BankAccountCreation() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const validate = () => {
    for (const key in formData) {
      if (!formData[key]) {
        setError("Please fill in all fields.");
        return false;
      }
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    toast.loading("Opening Vaultnet Account...")
    try {
      const accessToken = localStorage.getItem("accessToken");
      setLoading(true);
      const response = await axiosInstance.post("/customer/account-creation", formData,{
         headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      });
      console.log(response)
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        dob: "",
        addressLine: "",
        city: "",
        state: "",
        postalCode: "",
      })
      toast.dismiss()
      toast.success("Account created successfully!");
      setTimeout(() => {
        window.location.reload();
        }, 1000);
    } catch (err) {
      toast.dismiss()
      setError(err.response?.data?.message || err.message || "Failed to create account.");
      toast.error(error || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div>
      <h1 className="text-xl font-bold px-5 md:px-20 py-5 pt-5 md:pt-10 text-gray-800 flex gap-2 items-center">
               <MdAccountBalanceWallet className="text-4xl pt-1"/>Create Bank Account
            </h1>
      
            {/* Info Paragraph */}
            <p className="px-5 md:px-24 pb-10 text-xs italic text-gray-500">
              ***Secure your financial future with VaultNet by creating your own bank account today. Enjoy seamless online banking with advanced security, instant payments, and easy fund management — all at your fingertips. Whether you're saving for your dreams or managing daily transactions, our platform ensures a safe, fast, and user-friendly banking experience. Fill in the details below to open your account and take the first step towards smarter banking***
            </p>
      <div className="bg-white border border-gray-200 p-6 py-3 shadow-sm w-[90%] md:w-[75%] lg:w-[70%] mx-5 md:mx-24">
        <form onSubmit={handleSubmit} className="space-y-0 text-left pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:space-x-5 md:px-5">
            <div>
            <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main" htmlFor="email">
              <MdEmail className="w-4 h-4"/>Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
              required
            />
            {<p className="text-xs text-gray-500 my-1">
            ⚠️ Please use the registered email address.
          </p>}
          </div>
          <div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main" htmlFor="firstName">
                <FaUser className="w-4 h-4"/>First Name:
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
          </div>
          <div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main" htmlFor="lastName">
                <FaUser className="w-4 h-4"/>Last Name:
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main" htmlFor="phone">
              <FaPhone className="w-4 h-4"/>Phone Number:
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
              required
            />
          </div>

          <div>
            <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main"  htmlFor="dob">
              <BsFillCalendarDateFill className="w-4 h-4"/>Date of Birth:
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
             className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main uppercase"
              required
            />
          </div>

          <div>
            <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main" htmlFor="addressLine">
              <FaAddressCard className="w-4 h-4"/>Address Line:
            </label>
            <input
              id="addressLine"
              name="addressLine"
              type="text"
              value={formData.addressLine}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
              required
            />
          </div>

          <div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main" htmlFor="city">
                <FaCity className="w-4 h-4"/>City:
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
          </div>
          <div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main" htmlFor="state">
                <FaCity className="w-4 h-4"/>State:
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
          </div>
          <div>
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-2 text-main" htmlFor="postalCode">
                <BsSignpostSplitFill className="w-4 h-4"/>Postal Code:
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
               className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
          </div>
          <div className="hidden md:block"></div>
          </div>

          <div className="flex gap-10 justify-end mt-10">
            <button
              type="submit"
              disabled={loading}
              className="bg-main hover:bg-green-900 duration-300 text-white px-6 py-2"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
    </div>
    </div>
  );

}
