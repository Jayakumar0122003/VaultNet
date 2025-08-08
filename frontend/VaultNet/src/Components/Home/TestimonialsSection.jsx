// TestimonialsSection.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ravi Kumar",
    role: "Small Business Owner",
    feedback:
      "VaultNet made managing my business finances effortless. The online banking is smooth and secure.",
  },
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    feedback:
      "I love how fast transactions are. The mobile app experience is top-notch.",
  },
  {
    name: "Arjun Mehta",
    role: "Freelancer",
    feedback:
      "Opening my account took minutes, and customer support was very helpful. Highly recommend VaultNet.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-sec py-16 px-6 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Hear from Our Customers
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Our customers trust VaultNet for secure, reliable, and fast banking
          solutions. Here’s what they say.
        </motion.p>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-6 rounded-sm shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-gray-700 mb-4 italic">
                “{testimonial.feedback}”
              </p>
              <h4 className="font-semibold text-gray-900">
                {testimonial.name}
              </h4>
              <span className="text-sm text-gray-500">
                {testimonial.role}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
