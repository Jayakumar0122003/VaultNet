import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext"; // adjust path as needed
import { FaUser, FaEnvelope, FaPhone, FaHome, FaIdCard } from "react-icons/fa";

export default function AdminUserDetails() {
  const { user } = useContext(AuthContext); // user object should contain details

  return (
    <div className="h-full flex-1 pt-0 lg:pt-10 pb-10  w-full">
      {/* Heading */}
      <h1 className="text-xl font-semibold py-5 px-5 md:px-20 text-white bg-main uppercase">
        My Account Details
      </h1>

      {/* Subheading */}
      <h1 className="text-xl font-bold px-5 md:px-20 py-5 pt-5 md:pt-10 text-gray-800 flex gap-2 items-center">
        <FaUser className="text-2xl" /> Account Information
      </h1>

      {/* Info Paragraph */}
      <p className="px-5 md:px-24 pb-10 text-xs italic text-gray-500">
        ***Below are your registered account details. Please review them regularly 
        to ensure they are accurate. If any information is incorrect or outdated, 
        use the available update options to make changes.***
      </p>

      {/* Details Box */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm w-[90%] md:w-[70%] mx-5 md:mx-24">
        <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-5 lg:space-x-14 gap-3 md:gap-5">
          
          {/* Full Name */}
          <div>
            <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
              <FaUser /> First Name
            </label>
            <p className="border border-gray-200 rounded-xs p-2 text-sm bg-gray-50">
              {user?.firstName || "—"}
            </p>
          </div>

          <div>
            <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
              <FaUser /> Last Name
            </label>
            <p className="border border-gray-200 rounded-xs p-2 text-sm bg-gray-50">
              {user?.lastName || "—"}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
              <FaEnvelope /> Email
            </label>
            <p className="border border-gray-200 rounded-xs p-2 text-sm bg-gray-50">
              {user?.email || "—"}
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
              <FaPhone /> Phone Number
            </label>
            <p className="border border-gray-200 rounded-xs p-2 text-sm bg-gray-50">
              +91 {user?.phone || "—"}
            </p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
  <label className="text-xs px-1 font-medium mb-1 flex items-center gap-1 text-main">
    <FaHome /> Address
  </label>
  <p className="border border-gray-200 rounded-xs p-2 text-sm bg-gray-50">
    {user?.address?.addressLine && user?.address?.city && user?.address?.state && user?.address?.postalCode
      ? `${user.address.addressLine}, ${user.address.city}, ${user.address.state} - ${user.address.postalCode}, ${user.address.country}`
      : "—"}
  </p>
</div>


        </div>
      </div>
    </div>
  );
}
