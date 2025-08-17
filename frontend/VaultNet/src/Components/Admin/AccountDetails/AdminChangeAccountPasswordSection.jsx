import { useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import axios from "../../../axiosInstance";
import { toast } from "react-toastify";
import { PiPasswordFill } from "react-icons/pi";

export default function AdminChangeAccountPasswordUpdate() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    // Validate password match
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New Password and Confirm Password do not match!");
      return;
    }

    // Validate strong password (at least 8 chars, uppercase, lowercase, number, symbol)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(form.newPassword)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
      );
      return;
    }

    const loadingToast = toast.loading("Updating password...");
    try {
      setLoading(true)
      const res = await axios.post(
        "/admin/change-account-password",
        {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.update(loadingToast, {
        render: res.data?.message || "Password updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        window.location.reload();
        }, 1000);
    } catch (err) {
      toast.update(loadingToast, {
        render: err.response?.data?.message || "Failed to update password",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }finally{setLoading(false)}
  };

  return (
    <div className="h-full flex-1 pt-0 lg:pt-10 pb-20 w-full">
      {/* Heading */}
      <h1 className="text-xl font-semibold py-5 px-5 md:px-20 text-white bg-main uppercase">
        Change Account Password
      </h1>

      {/* Subheading */}
      <h1 className="text-xl font-bold px-5 md:px-20 py-5 pt-5 md:pt-10 text-gray-800 flex gap-2 items-center">
        <PiPasswordFill className="text-3xl" /> Update Your Account Password
      </h1>

      <p className="px-5 md:px-24 pb-10 text-xs italic text-gray-500">
        ***Changing your account password helps protect your banking information and prevents unauthorized access. For security, you’ll need to enter your current password before creating a new one. Choose a strong password that combines letters, numbers, and symbols, and avoid using easily guessable details like your name or birthdate.***
      </p>

      {/* Form Box */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm w-[90%] md:w-[70%] mx-5 md:mx-24">
        <form className="space-y-4" onSubmit={handleSubmitPassword}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-14 gap-3 md:gap-5">
            {/* Old Password */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" />
                Old Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                name="oldPassword"
                placeholder="ENTER YOUR OLD PASSWORD"
                value={form.oldPassword}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" />
                New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                name="newPassword"
                placeholder="ENTER YOUR NEW PASSWORD"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
              {/* Strong password recommendation */}
              <p className="text-[11px] text-gray-500 mt-1 px-2">
                *Use at least 8 characters with uppercase, lowercase, number, and symbol.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
                <FaStarOfLife className="w-2 h-2" />
                Confirm New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                placeholder="CONFIRM YOUR NEW PASSWORD"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xs p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
                required
              />
            </div>
            <div></div>
          </div>

          {/* Show password toggle */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="showPasswords"
              checked={showPasswords}
              onChange={() => setShowPasswords(!showPasswords)}
              className="cursor-pointer "
            />
            <label htmlFor="showPasswords" className="text-sm text-gray-700 cursor-pointer">
              Show Passwords
            </label>
          </div>

          <div className="flex justify-end px-14">
            <button
              type="submit"
              className={`w-full md:w-[40%] lg:w-[25%] bg-main text-white py-2 cursor-pointer hover:opacity-80 duration-300 uppercase ${loading ? "cursor-not-allowed bg-main opacity-50" : "hover:opacity-80 cursor-pointer"}`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
