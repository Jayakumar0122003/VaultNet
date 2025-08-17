// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
export default function Banner() {
  const {user,loading} = useContext(AuthContext);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }
  return (
    <section className="w-full bg-white pt-10 md:pt-6 px-4 md:px-10 lg:px-14">
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
            {user ? 
            <>
            {user.role === "ADMIN" ?
            <Link
              to="/vaultnet-admin-profile-details"
              className="bg-main text-white px-20 py-3 md:px-6 md:py-3 rounded-full font-semibold hover:bg-sec transition hover:text-black"
            >
              View Profile
            </Link>:<Link
              href="/vaultnet-bank-account"
              className="bg-main text-white px-20 py-3 md:px-6 md:py-3 rounded-full font-semibold hover:bg-sec transition hover:text-black"
            >
              Bank Account
            </Link>}
            </>
            :
            <Link
              href="/vaultnet-authenticate?mode=signup"
              className="bg-main text-white px-20 py-3 md:px-6 md:py-3 rounded-full font-semibold hover:bg-sec transition hover:text-black"
            >
              Get Started
            </Link>}
            <p
              className="text-main font-semibold hover:underline hover:text-black"
            >
              See Features →
            </p>
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
