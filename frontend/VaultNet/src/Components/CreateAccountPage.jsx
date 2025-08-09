import React, { useState } from "react";
import { FaUserCircle, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function CreateAccountPage({ userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Account Created Successfully! 🎉");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      {!showForm ? (
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
          <div className="text-6xl text-blue-600 mb-4">🏦</div>
          <h1 className="text-2xl font-bold text-gray-800">No Bank Account Found</h1>
          <p className="text-gray-500 mt-2">
            You don't have a bank account yet. Create one to start using our services.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 px-6 py-3 w-full bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Create Bank Account
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Open Your Bank Account
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="text-gray-600 font-semibold flex items-center gap-2">
              <MdEmail /> Email
            </label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 bg-gray-100 focus:outline-none"
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-600 font-semibold flex items-center gap-2">
                <FaUserCircle /> First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 font-semibold flex items-center gap-2">
                <FaUserCircle /> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="text-gray-600 font-semibold flex items-center gap-2">
              <FaPhoneAlt /> Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="text-gray-600 font-semibold flex items-center gap-2">
              <FaMapMarkerAlt /> Street
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP"
              value={formData.zip}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* DOB */}
          <div className="mb-6">
            <label className="text-gray-600 font-semibold flex items-center gap-2">
              <FaCalendarAlt /> Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 shadow-lg transition"
          >
            Create Account
          </button>
        </form>
      )}
    </div>
  );
}
