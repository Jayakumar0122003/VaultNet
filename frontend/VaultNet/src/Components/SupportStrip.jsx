import React from "react";
import { Phone, Mail, MessageSquare } from "lucide-react";

export default function SupportBanner() {
  return (
    <div className="bg-main text-white py-10 px-6 mb-10">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Need Help? We’re Here 24/7
        </h2>
        <p className="text-base text-gray-300 mb-8">
          Our customer care team is ready to assist you with any questions or concerns.
        </p>

        {/* Contact options */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {/* Call */}
          <a
            href="tel:+9118001234567"
            className="flex items-center justify-center gap-3 bg-white text-main font-semibold px-6 py-2 text-sm shadow-lg hover:bg-blue-50 transition"
          >
            <Phone className="w-5 h-5" />
            <span>Call Us: +91-1800-123-4567</span>
          </a>

          {/* Email */}
          <a
            href="mailto:support@vaultnet.com"
            className="flex items-center justify-center gap-3 bg-white text-main font-semibold px-6 py-2 text-sm shadow-lg hover:bg-blue-50 transition"
          >
            <Mail className="w-5 h-5" />
            <span>Email: support@vaultnet.com</span>
          </a>

          {/* Chat */}
          <button
            className="flex items-center justify-center gap-3 bg-white text-main font-semibold px-6 py-2 text-sm shadow-lg hover:bg-blue-50 transition"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Live Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
