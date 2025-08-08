// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Banner() {
  return (
    <section className="w-full bg-white pt-24 px-4 md:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left content */}
        <div className="flex-1 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            className="text-4xl md:text-3xl lg:text-6xl font-bold text-gray-900 leading-tight"
          >
            VaultNet – The Next-Gen{" "}
            <span className="text-main">Banking</span> Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            className="mt-6 text-gray-600 text-lg"
          >
            Secure, fast, and user-friendly banking made for everyone.
            Manage your finances with confidence and clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          >
            <a
              href="/get-started"
              className="bg-main text-white px-20 py-3 md:px-6 md:py-3 rounded-full font-semibold hover:bg-sec transition hover:text-black"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="text-main font-semibold hover:underline hover:text-black"
            >
              See Features →
            </a>
          </motion.div>
        </div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
          className="flex-1"
        >
          <img
            src="https://cdn.prod.website-files.com/67932b2685d8376c0174e7a0/67989d12ca6188efcb5b97cc_hero%20images%20(2).png"
            alt="VaultNet Banner"
            className="w-full max-w-md mx-auto "
          />
        </motion.div>
      </div>
    </section>
  );
}
