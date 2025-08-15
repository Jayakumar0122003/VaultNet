import { useState, useContext } from "react";
import {  Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import {FaUniversity} from "react-icons/fa"
import { MdLogout } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { IoTicketSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";




export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading, role } = useContext(AuthContext);
  const [change, setChange] = useState(false);

   const location = useLocation();
  if (location.pathname === "/vaultnet-verify-account") {
    return null; // don't render navbar
  }

  const navLinks = [
    { name: "Bank Account", path: "/vaultnet-bank-account", icon: <FaBookOpen className="text-lg"/> },
    { name: "Make Payments", path: "/vaultnet-make-payments", icon: <MdPayment className="text-xl"/> },
    { name: "Account Details", path: "/vaultnet-account-details-config", icon: <TbListDetails className="text-lg"/> },
    { name: "Customer Care", path: "/vaultnet-customer-support-care", icon: <BiSupport className="text-lg"/>},

  ];

  const adminLinks =[
    {name: "Card Requests", path: "/vaultnet-admin-unblock-card", icon: <MdPayment className="text-xl"/> },
    {name: "Tickets", path: "/vaultnet-admin-tickets-view", icon: <IoTicketSharp className="text-xl"/> },
    {name: "Profile", path: "/vaultnet-admin-profile-details", icon: <ImProfile className="text-xl"/> }
  ]

  const navLinkClass = ({ isActive }) =>
    `relative font-medium transition duration-300 flex gap-2 items-center justify-center ${
      isActive
        ? "text-main after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-main "
        : "text-gray-700 hover:text-main"
    }`;

  if(loading){
    return <div className="navbar"></div>;
  }  

  return (
    <nav className="w-full bg-gray-50 top-0 left-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl font-bold uppercase text-main tracking-tight hover:scale-105 transition-transform flex gap-1"
        >
         <FaUniversity className="text-4xl pb-2"/> VaultNet
        </NavLink>

        {/* Desktop Nav */}
        <>
          {role === "CUSTOMER" ? (
            user ? (
              <div className="hidden lg:flex items-center gap-6 lg:gap-14 text-sm">
                {navLinks.map((link) => (
                  <NavLink key={link.name} to={link.path} className={navLinkClass}>
                    {link.icon}
                    {link.name}
                  </NavLink>
                ))}
              </div>
            ) : (
              <></>
            )
          ) : user ? (
            <div className="hidden lg:flex items-center gap-6 lg:gap-14 text-sm">
              {adminLinks.map((link) => (
                <NavLink key={link.name} to={link.path} className={navLinkClass}>
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </div>
          ) : (
            <></>
          )}
        </>


        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-7">
          {user ? (
            <>
              <span className="text-gray-700 font-medium text-sm flex gap-1 items-center">
                <FaUserCircle className="text-xl"/>Welcome,   { user.firstName || "user"}
              </span>
              <button
                onClick={logout}
                className="flex gap-1 uppercase font-semibold justify-center items-center text-red-700 hover:text-red-900 duration-200 cursor-pointer text-sm"
              >
              Exit< MdLogout className="text-base"/>
              </button>
            </>
          ) : (
            <>
            {change ? (
              <>
                <NavLink to="/vaultnet-authenticate?mode=login" className={navLinkClass}>
                  Login
                </NavLink>

                <NavLink
                  to="/vaultnet-authenticate?mode=signup"
                  className="bg-main text-white px-5 py-2 rounded-full shadow-md transition hover:opacity-80 duration-300"
                >
                  Get Started
                </NavLink>

                <NavLink to="/vaultnet-authenticate-admin" className={navLinkClass} onClick={()=> setChange(!change)}>
                  <FaUserCircle className="text-xl" /> Admin Portal
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/vaultnet-authenticate-admin?mode=login" className={navLinkClass}>
                  Login
                </NavLink>

                <NavLink
                  to="/vaultnet-authenticate-admin?mode=signup"
                  className="bg-main text-white px-5 py-2 rounded-full shadow-md transition hover:opacity-80 duration-300"
                >
                  Get Started
                </NavLink>

                <NavLink to="/vaultnet-authenticate" className={navLinkClass} onClick={()=>setChange(!change)}> 
                  <FaUserCircle className="text-xl" /> User Portal
                </NavLink>
              </>
            )}
          </>

          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
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
        className={`fixed lg:hidden z-50 top-0 right-0 h-full w-full bg-white shadow-lg border-l border-gray-100 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-300">
          <span className="text-xl font-bold text-main flex gap-1 uppercase"><FaUniversity className="text-4xl pb-2"/> VaultNet</span>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          {user ? <>
          {role === "CUSTOMER"
            ? navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className="text-gray-700 font-medium hover:text-main transition flex gap-2 items-center"
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))
            : adminLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className="text-gray-700 font-medium hover:text-main transition flex gap-2 items-center"
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
          <hr className="my-4 text-gray-300" />
          </>:<></>}
          {user ? (
            <>
              <span className="text-gray-700 font-medium mb-3 text-base flex gap-2 items-center">
                <FaUserCircle className="text-lg"/>Welcome, {user.firstName || "User"}
              </span>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex gap-1 uppercase font-semibold justify-center items-center text-red-700 hover:text-red-900 duration-200 cursor-pointer text-base"
              >
                Exit< MdLogout className="text-xl"/>
              </button>
            </>
          ) : (
            <>
                <NavLink
                  to="/"
                  className="text-gray-700 font-medium hover:text-main transition text-center uppercase flex items-center gap-2 justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  <AiFillHome className="text-xl" /> Home
                </NavLink>

                  <NavLink
                    to={change ? "/vaultnet-authenticate": "/vaultnet-authenticate-admin"}
                    className={navLinkClass}
                    onClick={() => {
                      setChange(!change);
                      setIsOpen(false);
                    }}
                  >
                    <FaUserCircle className="text-xl" />  {change ? "User Portal" : "Admin Portal"}
                  </NavLink>
            </>
          )}
        </div>
      </div>

    </nav>
  );
}
