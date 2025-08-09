import { useState, useContext } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const navLinks = [
    { name: "Bank Account", path: "/bank" },
    { name: "Make Payments", path: "/payments" },
    { name: "Account Details", path: "/account" },
    { name: "Customer Care", path: "/support" },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative font-medium transition duration-300 ${
      isActive
        ? "text-main after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-main"
        : "text-gray-700 hover:text-main"
    }`;

  return (
    <nav className="w-full bg-white shadow-lg top-0 left-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold text-main tracking-tight hover:scale-105 transition-transform"
        >
          VaultNet
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-14 text-sm">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={navLinkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-7">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">
                Welcome, {user.firstName || "User"}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-8 py-2 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/auth" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/auth"
                className="bg-main text-white px-5 py-2 rounded-full hover:bg-sec hover:text-black shadow-md transition"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-main transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      <div
        className={`fixed md:hidden top-0 right-0 h-full w-full bg-white shadow-lg border-l border-gray-100 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-300">
          <span className="text-xl font-bold text-main">VaultNet</span>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className="block text-gray-700 font-medium hover:text-main transition"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          <hr className="my-4 text-gray-300" />
          {user ? (
            <>
              <span className="block text-gray-700 font-medium mb-2">
                Welcome, {user.firstName || "User"}
              </span>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/auth"
                className="block text-gray-700 font-medium hover:text-main transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/auth"
                className="block bg-main text-white text-center py-2 rounded-full hover:bg-sec hover:text-black shadow-md transition"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>

    </nav>
  );
}
