import { useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import axios from "../../../axiosInstance";
import { toast } from "react-toastify";
import { HiHome } from "react-icons/hi2";

export default function AddressChangeUpdate() {
  const [step, setStep] = useState(1);
  const [emailForm, setEmailForm] = useState({ email: "" });
  const [addressForm, setAddressForm] = useState({
    otp: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "email") {
      setEmailForm({ ...emailForm, [name]: value });
    } else {
      setAddressForm({ ...addressForm, [name]: value });
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
  e.preventDefault();
  const loadingToast = toast.loading("Sending OTP...");

  try {
    const res = await axios.put(
      "/customer/change-address",
      { email: emailForm.email },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // ✅ Check success flag before toasting success
    if (!res.data?.success) {
      toast.update(loadingToast, {
        render: res.data?.message || "Failed to send OTP",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    toast.update(loadingToast, {
      render: res.data?.message || "OTP sent successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
    setStep(2);

  } catch (err) {
    toast.update(loadingToast, {
      render: err.response?.data?.message || "Failed to send OTP",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};


  // Step 2: Verify OTP & Update Address
  const handleVerifyAddress = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating address...");
    try {
      const res = await axios.post("/customer/verify-otp-address", addressForm, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.data?.success) {
          // OTP wrong — show error toast
          toast.update(loadingToast, {
            render: res.data?.message || "Invalid OTP",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          return; // Stop here
        }

        // If we reach here, OTP was correct
        toast.update(loadingToast, {
          render: res.data?.message || "Address updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

      setStep(1);
      setEmailForm({ email: "" });
      setAddressForm({
        otp: "",
        addressLine: "",
        city: "",
        state: "",
        postalCode: "",
      });
      setTimeout(() => {
        window.location.reload();
        }, 1000);
    } catch (err) {
      toast.update(loadingToast, {
        render: err.response?.data?.message || "Failed to update address",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="h-full flex-1 pt-0 lg:py-10 lg:pt-5 pb-10  w-full">
      {/* Heading */}
      {/* <h1 className="text-xl font-semibold py-5 px-5 md:px-20 text-white bg-main uppercase">
        Address Change
      </h1> */}

      {/* Subheading */}
      <h1 className="text-xl font-bold px-5 md:px-20 py-5 pt-0 md:pt-0 text-gray-800 flex gap-2 items-center">
        <HiHome className="text-3xl" /> Update Address
      </h1>
      <p className="px-5 md:px-24 pb-10 text-xs italic text-gray-500">
        ***Updating your address ensures that all important banking correspondence, 
        account statements, and notifications reach you on time. 
        Always provide accurate and up-to-date details to avoid disruptions in service. 
        For security, make sure you’re submitting this change through trusted banking channels only.***
        </p>


      {/* Form Box */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm w-[90%] md:w-[70%] mx-5 md:mx-24">
        {/* Step 1: Send OTP */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  Registered Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={emailForm.email}
                  onChange={(e) => handleChange(e, "email")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div></div>
            </div>
            <div className="flex justify-end px-10">
              <button
                type="submit"
                className="w-full md:w-[40%] lg:w-[20%] bg-main text-white py-2 cursor-pointer hover:bg-green-900 uppercase"
              >
                Send OTP
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Verify & Update */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleVerifyAddress}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-14 gap-3 md:gap-5">
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={addressForm.otp}
                  onChange={(e) => handleChange(e, "address")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  Address Line
                </label>
                <input
                  type="text"
                  name="addressLine"
                  value={addressForm.addressLine}
                  onChange={(e) => handleChange(e, "address")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={(e) => handleChange(e, "address")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={(e) => handleChange(e, "address")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={(e) => handleChange(e, "address")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div></div>
            </div>
            <div className="flex justify-end px-14">
              <button
                type="submit"
                className="w-full md:w-[40%] lg:w-[30%] bg-main text-white py-2 cursor-pointer hover:bg-green-900 uppercase"
              >
                Verify & Update Address
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
