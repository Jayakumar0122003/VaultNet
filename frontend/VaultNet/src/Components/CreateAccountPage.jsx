import { useContext, useState } from "react";
import { AuthContext } from "../Components/Context/AuthContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaUniversity,
  FaPlusCircle,
  FaMoneyCheckAlt,
  FaCreditCard,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaDownload,
} from "react-icons/fa";
import { MdBlock,MdChangeCircle } from "react-icons/md";
import { SquarePen } from "lucide-react";
import AtmCard from "./AtmCard";
import MiniAtmService from "./MiniAtmService";
import BankAccountCreation from "./BankAccountCreation";
import SetAtmPinPage from "./SetAtmPinPage";
import Footer from "./Home/Footer";

export default function BankAccountPage() {
  const { user,loading } = useContext(AuthContext);
  const { account } = useContext(AuthContext);
  const [loadings, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  // const [cardViewed, setCardViewed] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const handleCreateAccount = () => {
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <>
    <div className=" px-5 md:px-10 lg:px-20 pt-5 lg:pt-5 pb-20 space-y-8">
      {/* HEADER */}
      {account?.pinSet?
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-main text-white p-4 rounded-sm shadow-md"
      >
        <div className="flex items-center gap-3">
          <FaUniversity className="text-xl md:text-4xl" />
          <h1 className="text-lg mdtext-2xl font-bold">VaultNet Bank</h1>
        </div>
        {user.accountCreated ? (
          <span className="bg-sec text-xs md:text-base px-3 md:px-4 py-1 rounded-sm text-main font-semibold">
            ACCOUNT ACTIVE
          </span>
        ) : (
          <span className="bg-red-500 px-4 py-1 rounded-lg font-semibold">
            NO ACCOUNT YET
          </span>
        )}
      </motion.div>:<></>}

      {user.accountCreated && account ? (
        account.pinSet ?
        <>
          {/* Account Details & Personal Info */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* ACCOUNT DETAILS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-sec p-6 rounded-sm shadow-lg space-y-5"
            >
              <h2 className="text-xl font-bold uppercase text-main mb-4">Account Details </h2>
              <p className="text-xs lg:text-base">
                <strong>Account Number:</strong>{" "}
                {showAccountNumber ? (
                  account.accountNumber
                ) : (
                  // Mask all but last 4 digits, grouping X's in 4 with spaces
                  <>
                    {account.accountNumber
                      .slice(0, -4) // all but last 4 digits
                      .replace(/\d/g, "X") // replace digits with X
                      .replace(/(.{4})/g, "$1 ")}{" "}
                    {account.accountNumber.slice(-4)} {/* last 4 digits */}
                  </>
                )}
                <button
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                  className="ml-1 text-main hover:text-black"
                >
                  {showAccountNumber ? <FaEyeSlash className="pt-1 text-lg"/> : <FaEye className="pt-1 text-lg"/>}
                </button>
              </p>

              <p className="text-xs lg:text-base"><strong>Account Holder Name:</strong> {account.cardHolderName}</p>
              <p className="text-xs lg:text-base"><strong>Account Type:</strong> Savings Account</p>
              <p className="text-xs lg:text-base">
                <strong>Issued At:</strong>{" "}
                {new Date(account.issuedAt).toLocaleDateString()}
              </p>
              <hr className="text-main mt-4 md:mt-7"/>
              <div className="flex flex-col lg:flex-row justify-between py-2">
                 <p className=" text-base md:text-lg ">
                  <strong className="text-main text-lg">Check Balance:</strong>{" "}
                  {showBalance ? (
                    <>₹{account.balance.toLocaleString()}</>
                  ) : (
                    <span className="italic text-sm md:text-lg text-gray-500">
                      ₹
                      {account.balance
                        .toLocaleString()
                        .split("")
                        .map((char) => (char === "," ? "," : "X"))
                        .join("")}
                    </span>
                  )}
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="ml-2 text-main hover:text-black"
                  >
                    {showBalance ? <FaEyeSlash className="pt-1" /> : <FaEye className="pt-1"/>}
                  </button>
                </p>

              <div className="font-bold text-main py-1">{user.emailVerified? <p className="flex gap-2 text-lg">Account Verified  <FaCheckCircle className="text-green-500 pt-1 text-xl" title="Verified" /></p> :<button>Get Verify</button>}</div>
              </div>
            </motion.div>

            {/* PERSONAL INFO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-200 p-6 rounded-sm shadow-lg"
            >
              <div className="flex flex-row md:flex-col lg:flex-row justify-between">
                <h2 className="text-sm  md:text-xl uppercase font-bold text-gray-800 mb-4 flex items-center gap-2">
                Personal Information{" "}
              </h2>
              <button className="text-sm  md:text-xs lg:text-sm font-semibold text-sec px-2 py-2 md:px-3 rounded-xs hover:bg-sec hover:text-gray-800 duration-300 cursor-pointer bg-main mb-4 flex items-center gap-1 lg:gap-2">
                {<SquarePen className="w-3 h-3 lg:w-5 lg:h-5"/>}Edit Details
              </button>
              </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 space-x-0 space-y-4 md:space-y-2 lg:space-y-4 text-sm">
               <p><strong>First Name:</strong>  {user.firstName}</p>
               <p><strong>Last Name:</strong>  {user.lastName}</p>
              <p><strong>Date Of Birth:</strong>  {user.dob}</p>
              <p><strong>Email:</strong>  {user.email}</p>
              <p><strong>Phone Number:</strong> +91 {user.phone}</p>
             </div>
             <hr className="text-sec my-4"/>
             <p className="my-4 text-sm"><strong>Address:</strong></p>
             <div className="grid grid-cols-1 lg:grid-cols-2 space-x-0 space-y-4 md:space-y-2 lg:space-y-4 text-sm">
              <p><strong>Street:</strong>  {user.address?.addressLine}</p>
              <p><strong>City:</strong>  {user.address?.city}</p>
              <p><strong>State:</strong>  {user.address?.state} - {user.address?.postalCode}</p>
              <p><strong>Country:</strong>  {user.address?.country}</p>
             </div>
            </motion.div>
          </div>

          {/* CARD DETAILS */}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-sm py-0 mt-20"
          >
            <div className="flex justify-between items-center p-4 mb-4 bg-main">
              <h2 className="text-xl px-10 font-bold text-white uppercase">Card Details</h2>
            </div>
            <div>
              <p className="px-5 md:px-20 text-gray-600 italic text-sm">*** For your security, your full card details are hidden by default. To view your ATM card information, please verify your identity by entering the last 4 digits of your registered phone number. ***</p>
              <AtmCard/>
            </div>
            {/* DOWNLOAD CARD BUTTON */}
          <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-10 py-10">
            <button className="bg-sec text-gray-800 hover:bg-gray-100 duration-300 px-4 py-2 rounded-sm flex items-center gap-2 justify-center" >
              <FaDownload /> Download Virtual Card (via Email)
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-sm flex items-center gap-2 justify-center">
              <FaDownload /> ATM Card Services
            </button>
          </div>
          </motion.div>

           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sec  lg:pb-10 mt-20">
              <div className="bg-main py-5 text-xl font-semibold px-5 md:px-20 text-white uppercase ">
                <h1>Mini ATM Service</h1>
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-10 items-center py-10 md:py-20 lg:py-0 lg:px-40" >
                <h1 className="flex flex-col justify-center items-center text-3xl lg:text-5xl font-bold text-main uppercase">{<FaUniversity className="text-center text-5xl md:text-8xl"/>}VaultNet Bank</h1>
                <MiniAtmService/>
              </div>
            </motion.div>
        </>:
        <SetAtmPinPage/>
      ) : user.accountCreated ? (
          // 2️⃣ Account created but no account object yet
          <p className="font-bold text-main text-center">
            {user.emailVerified ? (
              <span className="flex gap-2">
                Account Verified
                <FaCheckCircle className="text-green-500 pt-1 text-xl" title="Verified" />
              </span>
            ) : (
              <button className="py-2 px-6 bg-main text-white">Get Verify</button>
            )}
          </p>
        ) : (
          // 3️⃣ Create Account Prompt
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-sm text-center"
          >
            {loadings ? (
              <div className="flex justify-between items-center px-0">
                <BankAccountCreation />
                <div>
                  <h1 className="flex flex-col justify-center items-center text-4xl font-bold text-main uppercase">
                    <FaUniversity className="text-center text-8xl" /> VaultNet Bank
                  </h1>
                  <h2 className="text-xs text-gray-600 font-semibold py-1">
                    Open Your Bank Account With VaultNet
                  </h2>
                </div>
              </div>
            ) : (
              <>
                <FaUserCircle size={60} className="mx-auto mb-4 text-gray-500" />
                <h2 className="text-xl font-semibold mb-2">Open Your Bank Account</h2>
                <p className="text-gray-600 mb-6">
                  Join VaultNet Bank and enjoy secure, fast, and reliable banking services.
                </p>
                <button
                  onClick={handleCreateAccount}
                  disabled={loadings}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  {loadings ? "Creating..." : "Create Bank Account"}
                </button>
              </>
            )}
          </motion.div>
        )}
    </div>
    <Footer/>
    </>
  );
}
