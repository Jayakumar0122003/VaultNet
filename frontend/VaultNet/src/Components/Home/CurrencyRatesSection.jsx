// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { IndianRupee } from "lucide-react";

export default function CurrencyRatesSection() {
  const rates = [
    { currency: "USD", rate: "83.21" },
    { currency: "EUR", rate: "91.45" },
    { currency: "GBP", rate: "107.33" },
    { currency: "JPY", rate: "0.58" },
  ];

  return (
    <section className="py-16 bg-sec font-poppins px-2 md:px-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center py-5">
            <h2 className="text-4xl font-bold mb-8 flex md:gap-2 px-5"><IndianRupee className="w-10 h-10 font-extrabold"/>Live Currency Rates</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {rates.map((item, index) => (
            <motion.div
              key={item.currency}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white shadow-lg rounded-sm"
            >
              <h3 className="text-2xl font-semibold">{item.currency}</h3>
              <motion.p
                key={item.rate}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-main text-xl font-bold"
              >
                ₹{item.rate}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
