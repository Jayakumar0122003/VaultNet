// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function BranchLocatorSection() {
  const branches = [
    { name: "Mumbai Central", address: "123 Marine Drive, Mumbai" },
    { name: "Delhi Connaught", address: "45 Janpath Road, Delhi" },
    { name: "Hyderabad City", address: "22 Banjara Hills, Hyderabad" },
    { name: "Chennai Downtown", address: "18 Marina Beach Road, Chennai" },
    { name: "Bengaluru Tech Park", address: "77 MG Road, Bengaluru" },
    { name: "Kolkata Heritage", address: "5 Park Street, Kolkata" },
    { name: "Pune Central", address: "39 FC Road, Pune" },
    { name: "Ahmedabad Plaza", address: "91 CG Road, Ahmedabad" },
  ];

  return (
    <section className="py-16 bg-gray-50 px-4 md:px-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">Most Popular Branches</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.09 }}
              className="p-6 bg-white rounded-sm shadow-md text-left"
            >
              <MapPin className="text-main mb-2" size={32} />
              <h3 className="font-semibold text-lg">{branch.name}</h3>
              <p className="text-gray-600">{branch.address}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
