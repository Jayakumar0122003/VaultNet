import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-main text-gray-300 pt-12 pb-6 px-4 md:px-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
        >
          <h2 className="text-white text-xl font-semibold mb-4">VaultNet Bank</h2>
          <p className="text-sm leading-6">
            VaultNet is your trusted partner for secure banking and financial growth.
            We offer world-class online banking, credit solutions, and investment plans 
            to help you achieve your financial goals.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaYoutube /></a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
        >
          <h2 className="text-white text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-3 text-sm">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/services" className="hover:text-white">Banking Services</a></li>
            <li><a href="/loans" className="hover:text-white">Loans</a></li>
            <li><a href="/investment" className="hover:text-white">Investments</a></li>
            <li><a href="/careers" className="hover:text-white">Careers</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul>
        </motion.div>

        {/* Customer Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
        >
          <h2 className="text-white text-lg font-semibold mb-4">Customer Support</h2>
          <ul className="space-y-3 text-sm">
            <li><a href="/faq" className="hover:text-white">FAQs</a></li>
            <li><a href="/help" className="hover:text-white">Help Center</a></li>
            <li><a href="/report-fraud" className="hover:text-white">Report Fraud</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="/security" className="hover:text-white">Security Tips</a></li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
        >
          <h2 className="text-white text-lg font-semibold mb-4">Contact Us</h2>
          <p className="text-sm">📍 123 Marine Drive, Mumbai, India</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm">✉️ support@vaultnetbank.com</p>
          <p className="text-sm mt-4">
            <strong>Working Hours:</strong> Mon - Sat: 9:00 AM - 7:00 PM
          </p>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        className="border-t border-gray-500 mt-10 pt-6 text-center text-sm text-gray-300"
        initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.0 }}
      >
        <p>© {new Date().getFullYear()} VaultNet Bank. All Rights Reserved.</p>
        <p>Regulated by the Reserve Bank of India | IFSC: VNTB0000123</p>
      </motion.div>
    </footer>
  );
}
