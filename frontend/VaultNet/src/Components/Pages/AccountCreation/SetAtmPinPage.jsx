import { useState } from "react";
import axios from "../../../axiosInstance"; // adjust path
import { toast } from "react-toastify";
import { FaStarOfLife } from "react-icons/fa";

export default function SetAtmPinPage() {
  const [formData, setFormData] = useState({
    lastFourDigits: "",
    pin: "",
    confirmPin: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.pin !== formData.confirmPin) {
    toast.error("PIN and Confirm PIN do not match!");
    return;
  }

  const loadingToastId = toast.loading("Setting your ATM PIN...");

  try {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.post(
      "/customer/set-pin",
      {
        lastFourDigits: formData.lastFourDigits,
        pin: formData.pin
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.data?.success) {
      toast.update(loadingToastId, {
        render: res.data?.message || "Failed to set PIN.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    toast.update(loadingToastId, {
      render: res.data?.message || "PIN set successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    setFormData({ lastFourDigits: "", pin: "", confirmPin: "" });
    setTimeout(() => {
        window.location.reload();
        }, 1000);

  } catch (err) {
    toast.update(loadingToastId, {
      render: err.response?.data?.message || "Failed to set PIN.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }finally{
    setLoading(false);
  }
};


  return (
    <div className="h-full md:h-[60vh] lg:h-full flex-1 pb-10 lg:py-10 p-0 w-full">
      {/* Page Header */}
      <h1 className="text-xl font-semibold py-5 px-5 md:px-20 text-white bg-main uppercase">
        ATM Services
      </h1>

      {/* Section Heading */}
      <h1 className="text-xl font-bold px-5 md:px-20 py-5 pt-5 md:pt-10 text-gray-800">
        Set ATM PIN
      </h1>

      {/* Form Box */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm w-[90%] md:w-[60%] mx-5 md:mx-20">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 gap-3 md:gap-5">
            {/* Last 4 Digits */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" /> Last 4 Digits of Phone Number
              </label>
              <input
                type="text"
                name="lastFourDigits"
                maxLength={4}
                value={formData.lastFourDigits}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>

            {/* New PIN */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" /> New PIN
              </label>
              <input
                type="password"
                name="pin"
                maxLength={4}
                value={formData.pin}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>

            {/* Confirm PIN */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" /> Confirm PIN
              </label>
              <input
                type="password"
                name="confirmPin"
                maxLength={4}
                value={formData.confirmPin}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div></div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end lg:px-5">
            <button
            disabled={loading}
              type="submit"
              className={`px-10 bg-main text-white py-2 duration-300 transition
                    ${loading ? "cursor-not-allowed bg-main opacity-50" : "hover:opacity-80 cursor-pointer"}
                  `}
            >
              {loading ? "Pin Setting..." : "Set PIN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
