import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = ["Bank", "Make Payments", "Account Details", "Customer Care"];

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-main">
          VaultNet
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-10">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-gray-700 hover:text-main font-medium transition">
              {link}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</a>
          <a href="/get-started" className="bg-blue-main text-white bg-main px-4 py-2 rounded-full hover:bg-sec hover:text-black transition">
            Get Started
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden h-[92vh] bg-sec shadow-md px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="block text-gray-700 font-medium hover:text-main">
              {link}
            </a>
          ))}
          <a href="/login" className="block text-gray-700 font-medium hover:text-main">Login</a>
          <a href="/get-started" className="block bg-main text-white text-center py-2 rounded-full hover:bg-sec">
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
