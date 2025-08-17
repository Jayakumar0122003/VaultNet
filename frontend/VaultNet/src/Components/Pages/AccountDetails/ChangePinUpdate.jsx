import { useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import axios from "../../../axiosInstance";
import { toast } from "react-toastify";
import { MdPassword } from "react-icons/md";

export default function ChangePinUpdate() {
  const [form, setForm] = useState({
    email: "",
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If it's a PIN field, allow only numbers and limit to 4 digits
    if (["oldPin", "newPin", "confirmPin"].includes(name)) {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 4) {
        setForm({ ...form, [name]: numericValue });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmitPin = async (e) => {
    e.preventDefault();

    // Validate PIN length
    if (form.newPin.length !== 4 || form.confirmPin.length !== 4) {
      toast.error("PIN must be exactly 4 digits!");
      return;
    }

    // Validate PIN match
    if (form.newPin !== form.confirmPin) {
      toast.error("New PIN and Confirm PIN do not match!");
      return;
    }

    const loadingToast = toast.loading("Updating PIN...");
    try {
      setLoading(true)
      const res = await axios.post(
        "/customer/change-pin",
        {
          email: form.email,
          oldPin: form.oldPin,
          newPin: form.newPin,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.data?.success) {
        toast.update(loadingToast, {
          render: res.data?.message || "Failed to update PIN",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      toast.update(loadingToast, {
        render: res.data?.message || "PIN updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });


      setForm({ email: "", oldPin: "", newPin: "", confirmPin: "" });
      setTimeout(() => {
        window.location.reload();
        }, 1000);
    } catch (err) {
      toast.update(loadingToast, {
        render: err.response?.data?.message || "Failed to update PIN",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="h-full flex-1 pt-0 lg:pt-10 pb-10 w-full">
      {/* Heading */}
      <h1 className="text-xl font-semibold py-5 px-5 md:px-20 text-white bg-main uppercase">
        Change ATM PIN
      </h1>

      {/* Subheading */}
      <h1 className="text-xl font-bold px-5 md:px-20 py-5 pt-5 md:pt-10 text-gray-800 flex gap-2 items-center">
        <MdPassword className="text-3xl" /> Update Your ATM PIN
      </h1>

        <p className="px-5 md:px-24 pb-10 text-xs italic text-gray-500">
        ***Changing your ATM PIN helps secure your card against unauthorized use. 
        You’ll need to enter your current PIN before setting a new one. 
        For your safety, choose a unique 4-digit PIN that’s not easily guessable, 
        such as birthdays or repeated numbers. Keep your new PIN confidential at all times.***
        </p>


      {/* Form Box */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm w-[90%] md:w-[70%] mx-5 md:mx-24">
        <form className="space-y-4" onSubmit={handleSubmitPin}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-14 gap-3 md:gap-5">
            {/* Email */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" />
                Registered Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="ENTER YOUR REGISTER EMAIL ADDRESS"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>

            {/* Old PIN */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" />
                Old PIN
              </label>
              <input
                type="password"
                name="oldPin"
                placeholder="ENTER YOUR OLD ATM PIN"
                maxLength={4}
                inputMode="numeric"
                pattern="\d*"
                value={form.oldPin}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>

            {/* New PIN */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" />
                New PIN
              </label>
              <input
                type="password"
                name="newPin"
                placeholder="ENTER YOUR NEW ATM PIN"
                maxLength={4}
                inputMode="numeric"
                pattern="\d*"
                value={form.newPin}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>

            {/* Confirm PIN */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" />
                Confirm PIN
              </label>
              <input
                type="password"
                name="confirmPin"
                placeholder="CONFIRM YOUR NEW ATM PIN"
                maxLength={4}
                inputMode="numeric"
                pattern="\d*"
                value={form.confirmPin}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div></div>
          </div>

          <div className="flex justify-end px-14">
            <button
              type="submit"
              className={`w-full md:w-[40%] lg:w-[25%] bg-main text-white py-2 cursor-pointer hover:opacity-80 duration-300 uppercase ${loading ? "cursor-not-allowed bg-main opacity-50" : "hover:opacity-80 cursor-pointer"}`}
            >
              {loading ? "Updating..." : "Update PIN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
