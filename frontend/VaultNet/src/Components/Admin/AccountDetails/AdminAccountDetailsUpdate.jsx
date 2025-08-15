import { useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import axios from "../../../axiosInstance";
import { toast } from "react-toastify";
import { IoMdPhonePortrait } from "react-icons/io";
import { MdEmail } from "react-icons/md";



export default function AdminAccountDetailsUpdate() {
  const [activeTab, setActiveTab] = useState("email");
  const [emailForm, setEmailForm] = useState({ lastFourDigits: "", email: "" });
  const [phoneStep, setPhoneStep] = useState(1);
  const [phoneForm, setPhoneForm] = useState({ email: "" });
  const [verifyForm, setVerifyForm] = useState({ newPhoneNumber: "", otp: "" });
  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "email") {
      setEmailForm({ ...emailForm, [name]: value });
    } else if (formType === "phone") {
      setPhoneForm({ ...phoneForm, [name]: value });
    } else if (formType === "verify") {
      setVerifyForm({ ...verifyForm, [name]: value });
    }
  };

const handleSubmitEmail = async (e) => {
  e.preventDefault();

  const loadingToast = toast.loading("Updating email...");
  try {
    const res = await axios.put(
      "/admin/change-email",
      {
        lastFourDigits: emailForm.lastFourDigits,
        email: emailForm.email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Check backend's success flag
    if (!res.data?.success) {
      toast.update(loadingToast, {
        render: res.data?.message || "Failed to update email",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    toast.update(loadingToast, {
      render: res.data.message || "Email updated successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    setEmailForm({ lastFourDigits: "", email: "" });

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (err) {
    toast.update(loadingToast, {
      render: err.response?.data?.message || "Failed to update email",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};


function isValidPhoneNumber(phone) {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
}


const handleSendOtp = async (e) => {
  e.preventDefault();

  const loadingToast = toast.loading("Sending OTP...");
  try {
    const res = await axios.put(
      "/admin/change-phone",
      { email: phoneForm.email },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    toast.update(loadingToast, {
      render: res.data?.message || "OTP sent successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
    setPhoneStep(2);
  } catch (err) {
    toast.update(loadingToast, {
      render: err.response?.data?.message || "Failed to send OTP",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};


const handleVerifyPhone = async (e) => {
  e.preventDefault();

  if (!isValidPhoneNumber(verifyForm.newPhoneNumber)) {
  toast.error("Enter a valid 10-digit phone number starting with 6-9");
  return;
}

  const loadingToast = toast.loading("Verifying phone number...");
  try {
  const res = await axios.post(
    "/admin/verify-otp-phone",
    {
      newPhoneNumber: verifyForm.newPhoneNumber,
      otp: verifyForm.otp,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.data?.success) {
      // ❌ OTP or validation failed
      toast.update(loadingToast, {
        render: res.data?.message || "Failed to verify phone number",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
  toast.update(loadingToast, {
    render: res.data?.message || "Phone number updated successfully!",
    type: "success",
    isLoading: false,
    autoClose: 3000,
  });

  setPhoneStep(1);
  setPhoneForm({ email: "" });
  setVerifyForm({ newPhoneNumber: "", otp: "" });
  setTimeout(() => { window.location.reload(); }, 1000);

} catch (err) {
  toast.update(loadingToast, {
    render: err.response?.data?.message || "Failed to verify phone number",
    type: "error",
    isLoading: false,
    autoClose: 3000,
  });
}

}
  return (
    <div className="h-full flex-1 pt-0 lg:py-10 pb-10  w-full">
      {/* Heading */}
      <h1 className="text-xl font-semibold py-5 px-5 md:px-20 text-white bg-main uppercase">
        Account Details Update
      </h1>

      {/* Subheading */}
      <h1 className="text-xl font-bold px-5 md:px-20 py-5 pt-5 md:pt-10 text-gray-800 flex gap-0">
        {activeTab === "email" ? <><MdEmail className=" text-3xl pr-1"/>Email Address Change</>:<><IoMdPhonePortrait className=" text-3xl"/>Phone Number Change</>}
      </h1>

      <p className="px-5 md:px-24 pb-10 text-xs italic text-gray-500">
        {activeTab === "email" ? `***Updating your email address ensures you continue receiving important account alerts, 
        security notifications, and banking updates. Use an active and secure email account, 
        and avoid using shared or public addresses to protect your financial information.***` :
         `***Keeping your phone number updated helps you receive timely transaction alerts, 
        OTPs, and important banking communications. Use a valid and active mobile number 
        that only you can access to maintain the security of your account.***`}
      </p>


      {/* Tabs */}
      <div className="flex mb-6 mx-5 md:mx-20">
        <button
          className={`px-4 py-2 font-medium transition uppercase text-xs ${
            activeTab === "email"
              ? "border-b-2 border-main text-main"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => {
            setActiveTab("email");
            setPhoneStep(1);
          }}
        >
          Change Email
        </button>
        <button
          className={`px-4 py-2 font-medium transition uppercase text-xs ${
            activeTab === "phone"
              ? "border-b-2 border-main text-main"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("phone")}
        >
          Change Phone
        </button>
      </div>

      {/* Form Box */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm w-[90%] md:w-[70%] mx-5 md:mx-24">
        {/* Change Email Form */}
        {activeTab === "email" && (
          <form className="space-y-4" onSubmit={handleSubmitEmail}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-14 gap-3 md:gap-5">
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  Last 4 Digits of Account/Phone
                </label>
                <input
                  type="text"
                  name="lastFourDigits"
                  value={emailForm.lastFourDigits}
                  onChange={(e) => handleChange(e, "email")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  New Email
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
            <div className="flex justify-end px-14">
              <button
                type="submit"
                className="w-full md:w-[40%] lg:w-[20%] bg-main text-white py-2 cursor-pointer hover:bg-green-900 uppercase"
              >
                Update Email
              </button>
            </div>
          </form>
        )}

        {/* Change Phone Form */}
        {activeTab === "phone" && phoneStep === 1 && (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-5 gap-3 md:gap-5">
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" />
                Registered Email
              </label>
              <input
                type="email"
                name="email"
                value={phoneForm.email}
                onChange={(e) => handleChange(e, "phone")}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div></div>
            </div>
            <div className="flex justify-end px-14">
              <button
                type="submit"
                className="w-full md:w-[40%] lg:w-[20%] bg-main text-white py-2 cursor-pointer hover:bg-green-900 uppercase"
              >
                Send OTP
              </button>
            </div>
          </form>
        )}

        {activeTab === "phone" && phoneStep === 2 && (
          <form className="space-y-4" onSubmit={handleVerifyPhone}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-14 gap-3 md:gap-5">
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  New Phone Number
                </label>
                <input
                  type="text"
                  name="newPhoneNumber"
                  value={verifyForm.newPhoneNumber}
                  onChange={(e) => handleChange(e, "verify")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div>
                <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                  <FaStarOfLife className="w-2 h-2" />
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={verifyForm.otp}
                  onChange={(e) => handleChange(e, "verify")}
                  className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                  required
                />
              </div>
              <div></div>
            </div>
             <div className="flex justify-end px-14 gap-4">
              <button
                type="button"
                onClick={() => {
                 setPhoneStep(1);
                  setPhoneForm({ email: "" });
                  setVerifyForm({ newPhoneNumber: "", otp: "" });
                }}
                className="w-full md:w-[40%] lg:w-[30%] bg-gray-200 text-gray-800 py-2 cursor-pointer hover:bg-gray-300 duration-300 uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full md:w-[40%] lg:w-[30%] bg-main text-white py-2 cursor-pointer hover:bg-green-900 uppercase"
              >
                Verify & Update Phone Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
