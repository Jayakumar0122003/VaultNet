// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Headphones, TrendingUp,Globe,  Wallet, Percent, Brain } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-main" />,
      title: "Secure Banking",
      description: "Advanced encryption & fraud detection to keep your money safe."
    },
    {
      icon: <CreditCard className="w-10 h-10 text-main" />,
      title: "Smart Payments",
      description: "Seamless card & UPI transactions with instant notifications."
    },
    {
      icon: <Headphones className="w-10 h-10 text-main" />,
      title: "24/7 Support",
      description: "Round-the-clock customer care to assist you anytime."
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-main" />,
      title: "High Returns",
      description: "Maximize your savings with competitive interest rates."
    },
    {
    icon: <Brain  className="w-10 h-10 text-main" />,
    title: "AI-Powered Insights",
    description: "Get smart spending analytics and savings recommendations powered by AI to help you reach your goals faster.",
    },
    {
    icon: <Globe  className="w-10 h-10 text-main" />,
    title: "Global Transfers",
    description: "Send and receive money worldwide with competitive exchange rates and no hidden fees.",
    },
    {
      icon: <Percent className="w-10 h-10 text-main" />,
      title: "Low Loan Rates",
      description:
        "Personal loans starting at just 8.5% p.a. with easy approval.",
    },
    {
    icon: <Wallet className="w-10 h-10 text-main" />,
    title: "All-in-One Wallet",
    description: "Store your cards, manage multiple currencies, and track expenses all in one secure wallet.",
    }

  ];

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-900"
        >
          Why Choose <span className="text-main">VaultNet</span>?
        </motion.h2>
        <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay:  0.3 }}
          className="mt-4 text-gray-600 max-w-2xl mx-auto"
        >
          Your trusted partner in financial growth and security.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-sm shadow hover:shadow-lg transition"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
