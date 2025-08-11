import React, { useState } from "react";
import { Phone, Mail, MessageSquare, AlertTriangle, Lock, FileText, Shield } from "lucide-react";

export default function CustomerCare() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    { q: "How do I reset my password?", a: "Go to Settings > Security > Reset Password and follow the steps." },
    { q: "How can I block my card?", a: "Use the 'Block Card' option in Self-Service or call our 24/7 helpline." },
    { q: "Where can I download my transaction statement?", a: "Navigate to Transactions > Download PDF." }
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Customer Care & Support</h1>

      {/* Quick Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
          <MessageSquare className="w-8 h-8 text-blue-600 mb-3" />
          <h2 className="font-semibold">Live Chat</h2>
          <p className="text-sm text-gray-600">Chat with our support team instantly</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
          <Phone className="w-8 h-8 text-green-600 mb-3" />
          <h2 className="font-semibold">Call Support</h2>
          <p className="text-sm text-gray-600">Reach us at +91-1800-123-4567</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
          <Mail className="w-8 h-8 text-yellow-600 mb-3" />
          <h2 className="font-semibold">Email Support</h2>
          <p className="text-sm text-gray-600">support@vaultnet.com</p>
        </div>
      </div>

      {/* Self Service Tools */}
      <h2 className="text-lg font-bold mb-3">Self-Service Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
          <Lock className="w-8 h-8 text-red-600 mb-2" />
          <span className="font-medium">Block Card</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
          <Shield className="w-8 h-8 text-orange-600 mb-2" />
          <span className="font-medium">Report Fraud</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
          <FileText className="w-8 h-8 text-blue-600 mb-2" />
          <span className="font-medium">Request Statement</span>
        </div>
      </div>

      {/* FAQs */}
      <h2 className="text-lg font-bold mb-3">Help & FAQs</h2>
      <div className="bg-white rounded-xl shadow-sm border divide-y">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-4">
            <button
              onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              className="w-full text-left font-medium text-gray-800 flex justify-between items-center"
            >
              {faq.q}
              <span>{openFAQ === idx ? "-" : "+"}</span>
            </button>
            {openFAQ === idx && (
              <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Contact */}
      <div className="mt-8 bg-red-50 border border-red-200 p-6 rounded-xl flex items-center gap-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-700">Emergency? Need Immediate Help?</h3>
          <p className="text-sm text-red-600">
            Call our 24/7 helpline at <strong>+91-1800-999-000</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
