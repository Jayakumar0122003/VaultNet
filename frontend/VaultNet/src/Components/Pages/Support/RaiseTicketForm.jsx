import { useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import axios from "../../../axiosInstance";
import { toast } from "react-toastify";
import { IoTicket } from "react-icons/io5";

export default function RaiseTicketForm({fetchTickets}) {
  const [form, setForm] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, subject, message } = form;
    if (!email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/customer/raise-ticket", form, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Support ticket raised successfully!");
        setForm({ email: "", subject: "", message: "" });
        await fetchTickets(); // ✅ this now works
      } else {
        toast.error(res.data?.message || "Failed to raise ticket.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10  lg:py-20">
      <h1 className="px-5 md:px-20 bg-main py-5 text-3xl text-white font-semibold flex gap-1"><IoTicket className="pt-1 text-4xl"/>Raise Ticket!</h1>
      <p className="px-5 md:px-24 text-xs italic text-gray-700 py-10 mb-2">
                ***If you’re experiencing any issues or have questions, our support team is here to help. Please fill out the form below to raise a support ticket. Provide a clear and concise subject along with detailed information about your problem or request. Our team will review your ticket promptly and get back to you with a solution or further assistance. For faster resolution, please ensure your contact email is accurate and check your inbox regularly for updates.***
              </p>
      <div className=" bg-white p-6 shadow-md border border-gray-200  mx-5 md:mx-30 lg:mx-40">
      <h2 className="text-2xl font-semibold mb-6 text-main uppercase">Raise Support Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="text-xs font-medium mb-1 flex items-center gap-1 text-main">
            <FaStarOfLife className="w-2 h-2" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="text-xs font-medium mb-1 flex items-center gap-1 text-main">
            <FaStarOfLife className="w-2 h-2" /> Subject
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main"
            placeholder="Briefly describe your issue"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-xs font-medium mb-1 flex items-center gap-1 text-main">
            <FaStarOfLife className="w-2 h-2" /> Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-main resize-none"
            placeholder="Provide detailed information about your issue"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-main text-white py-2 px-6 uppercase font-semibold hover:bg-green-900 transition duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
