import { useState, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";


const faqData = [
  {
    question: "How can I check the status of my raised support ticket?",
    answer:
      "After submitting a support ticket, you will receive a confirmation email with a ticket ID. You can check the status of your ticket by logging into your support dashboard or contacting customer service with your ticket ID.",
  },
  {
    question: "Can I raise multiple support tickets at the same time?",
    answer:
      "Yes, you can raise multiple support tickets for different issues. However, please ensure each ticket clearly describes the separate issue to avoid confusion.",
  },
  {
    question: "What documents are required to verify my identity during account changes?",
    answer:
      "Typically, a valid government-issued photo ID such as a passport, driver’s license, or Aadhaar card is required. Additional documents may be requested depending on the type of change.",
  },
  {
    question: "How do I unsubscribe from marketing emails?",
    answer:
      "You can unsubscribe from marketing emails by clicking the 'unsubscribe' link at the bottom of any marketing email or adjusting your communication preferences in your account settings.",
  },
  {
    question: "Is online banking safe to use on public Wi-Fi?",
    answer:
      "It is recommended to avoid using online banking on public or unsecured Wi-Fi networks. If necessary, use a trusted VPN to secure your connection.",
  },
  {
    question: "How can I update my mailing address?",
    answer:
      "You can update your mailing address by logging into your online banking profile and editing your address details, or by submitting a request through customer support.",
  },
  {
    question: "What do I do if my ATM card is lost or stolen?",
    answer:
      "Immediately report the loss or theft to customer support or use the online banking portal to block your card. Request a replacement card as soon as possible.",
  },
  {
    question: "Are there limits on daily withdrawals or transfers?",
    answer:
      "Yes, daily limits apply to ATM withdrawals, online transfers, and purchases for security purposes. Please refer to our limits policy or contact support for specific limits on your account.",
  },
  {
    question: "How can I enable two-factor authentication (2FA) for my account?",
    answer:
      "Two-factor authentication can be enabled via your account security settings. It provides an extra layer of protection by requiring a verification code sent to your mobile device.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-10">
      <h1 className="px-5 md:px-20 bg-main py-5 text-2xl md:text-3xl text-white font-semibold flex gap-1">
        <FaQuestionCircle className="pt-1 text-4xl"/>Frequently Asked Questions
      </h1>
      <p className="px-5 md:px-24 text-xs italic text-gray-700 py-10 pb-0">
        ***Welcome to our Frequently Asked Questions (FAQ) section. Here you’ll
        find answers to the most common queries about our services, account
        management, security, and support. We designed this section to help you
        quickly find the information you need and resolve any concerns you may
        have. If your question is not listed, please don’t hesitate to reach
        out to our customer support team for personalized assistance.***
      </p>
      <div className="px-5 md:px-20">
        <div className="p-6 bg-white">
          <h2 className="text-2xl font-bold text-main mb-6 uppercase">Questions</h2>
          <div
            className="space-y-4 md:px-10"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="border border-gray-300 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center p-4">
                    <h3 className="text-md font-semibold text-gray-800">{faq.question}</h3>
                    {isOpen ? (
                      <FaChevronUp className="text-main" />
                    ) : (
                      <FaChevronDown className="text-main" />
                    )}
                  </div>
                  <div
                    ref={(el) => (contentRefs.current[index] = el)}
                    style={{
                      maxHeight: isOpen ? `${contentRefs.current[index]?.scrollHeight}px` : "0px",
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, opacity 0.3s ease",
                      padding: isOpen ? "0 16px 16px 16px" : "0 16px",
                    }}
                  >
                    <p className="text-gray-600 text-sm pb-5">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
