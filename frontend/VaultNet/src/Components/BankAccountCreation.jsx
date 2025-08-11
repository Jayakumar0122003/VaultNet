import { useState } from "react";
import axiosInstance from "../axiosInstance"; // adjust path
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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
    toast.loading("Creating...")
    try {
      const accessToken = localStorage.getItem("accessToken");
      setLoading(true);
      const response = await axiosInstance.post("/customer/account-creation", formData,{
         headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      });
      console.log(response)
      toast.dismiss()
      toast.success("Account created successfully!");
    } catch (err) {
      toast.dismiss()
      setError(err.response?.data?.message || err.message || "Failed to create account.");
      toast.error(error || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="bg-sec p-6 rounded-sm shadow-sm w-[800px]">
      <h1 className="text-center text-3xl text-main font-bold py-2 uppercase">Create Bank Account</h1>
        <form onSubmit={handleSubmit} className="space-y-0 text-left pt-10">
          <div className="grid grid-cols-2 gap-5 space-x-5 px-5">
            <div>
            <label className="block font-semibold mb-1 text-xs" htmlFor="email">
              *Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm"
              required
            />
            {<p className="text-xs text-gray-500 my-1">
            ⚠️ Please use the registered email address.
          </p>}
          </div>
          <div>
            <div>
              <label className="block font-semibold mb-1 text-xs" htmlFor="firstName">
                *First Name:
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm"
                required
              />
            </div>
          </div>
          <div>
            <div>
              <label className="block font-semibold mb-1 text-xs" htmlFor="lastName">
                *Last Name:
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-xs" htmlFor="phone">
              *Phone Number:
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-xs"  htmlFor="dob">
              *Date of Birth:
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
             className="w-full border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-xs" htmlFor="addressLine">
              *Address Line:
            </label>
            <input
              id="addressLine"
              name="addressLine"
              type="text"
              value={formData.addressLine}
              onChange={handleChange}
              className="w-full border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <div>
              <label className="block font-semibold mb-1 text-xs" htmlFor="city">
                *City:
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm"
                required
              />
            </div>
          </div>
          <div>
            <div>
              <label className="block font-semibold mb-1 text-xs" htmlFor="state">
                *State:
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm"
                required
              />
            </div>
          </div>
          <div>
            <div>
              <label className="block font-semibold mb-1 text-xs" htmlFor="postalCode">
                *Postal Code:
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
               className=" border border-main bg-white px-3 py-1 focus:ring-main focus:ring-1 focus:outline-none text-sm w-[95%]"
                required
              />
            </div>
          </div>
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
  );

}
