import {  useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "../../axiosInstance"; // or your axios config file path
import { toast } from "react-toastify";
import { RiAccountBoxFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { IoWarning } from "react-icons/io5";

// Removed framer-motion import
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
import { MdBlock, MdChangeCircle } from "react-icons/md";
import { SquarePen } from "lucide-react";
import AtmCard from "./Payments/AtmCard";
import MiniAtmService from "./Payments/MiniAtmService";
import BankAccountCreation from "./AccountCreation/BankAccountCreation";
import SetAtmPinPage from "./AccountCreation/SetAtmPinPage";
import Footer from "../Home/Footer";

export default function BankAccountPage() {
  const { user, loading} = useContext(AuthContext);
  const { account } = useContext(AuthContext);
  const [loadings, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const handleCreateAccount = () => {
    setLoading(true);
  };

  const handleSend = async () => {
  const toastId = toast.loading("Sending ATM card to your email...");

  try {
    const response = await axios.get(
      "/customer/get-atm-card", // relative URL if axiosInstance has baseURL set to localhost:8080
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // add auth if required
        },
      }
    );

    toast.update(toastId, {
      render: response.data.message || "ATM card sent successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  } catch (err) {
    toast.update(toastId, {
      render:
        err.response?.data?.message || "Failed to send ATM card. Please try again.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
    console.error(err);
  }
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
      <div className="pt-5 lg:pt-5 pb-20 space-y-8">
        {/* HEADER */}
        {account?.pinSet ? (
          <div
            className="flex items-center justify-between bg-main text-white p-4 rounded-sm shadow-md"
            // removed motion props
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
          </div>
        ) : (
          <></>
        )}

        {user.accountCreated && account ? (
          account.pinSet ? (
            <>
              <p className="px-5 md:px-24  text-xs italic text-gray-500">
                ***Below are your registered account details. Please review them
                regularly to ensure they are accurate and up-to-date. Keeping your
                information current helps us provide better service and ensures the
                security of your account. If you notice any discrepancies or
                outdated information, please use the available update options
                promptly to make necessary changes. Regularly verifying your details
                also helps prevent unauthorized access and potential fraud. Your
                proactive attention to maintaining accurate account information is
                essential for a smooth and secure banking experience.***
              </p>
              {/* Account Details & Personal Info */}
              <div className="grid md:grid-cols-2 gap-10 px-5 md:px-10 lg:px-20">
                {/* ACCOUNT DETAILS */}
                <div
                  className="bg-sec p-6 shadow-sm space-y-5"
                  // removed motion props
                >
                  <h2 className="text-xl font-bold uppercase text-main mb-4">
                    Account Details{" "}
                  </h2>
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
                      {showAccountNumber ? (
                        <FaEyeSlash className="pt-1 text-lg" />
                      ) : (
                        <FaEye className="pt-1 text-lg" />
                      )}
                    </button>
                  </p>

                  <p className="text-xs lg:text-base">
                    <strong>Account Holder Name:</strong> {account.cardHolderName}
                  </p>
                  <p className="text-xs lg:text-base">
                    <strong>Account Type:</strong> Savings Account
                  </p>
                  <p className="text-xs lg:text-base">
                    <strong>Issued At:</strong>{" "}
                    {new Date(account.issuedAt).toLocaleDateString()}
                  </p>
                  <hr className="text-main mt-4 md:mt-7" />
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
                        {showBalance ? <FaEyeSlash className="pt-1" /> : <FaEye className="pt-1" />}
                      </button>
                    </p>

                    <div className="font-bold text-main py-1">
                      {user.emailVerified ? (
                        <p className="flex gap-2 text-lg">
                          Account Verified{" "}
                          <FaCheckCircle
                            className="text-green-500 pt-1 text-xl"
                            title="Verified"
                          />
                        </p>
                      ) : (
                        <Link to={user.verificationLink}>Get Verify</Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* PERSONAL INFO */}
                <div
                  className="bg-gray-200 p-6 shadow-sm"
                  // removed motion props
                >
                  <div className="flex flex-row md:flex-col lg:flex-row justify-between">
                    <h2 className="text-sm  md:text-xl uppercase font-bold text-gray-800 mb-4 flex items-center gap-2">
                      Personal Information{" "}
                    </h2>
                    <button className="text-sm  md:text-xs lg:text-sm font-semibold text-sec px-2 py-2 md:px-3 rounded-xs hover:bg-sec hover:text-gray-800 duration-300 cursor-pointer bg-main mb-4 flex items-center gap-1 lg:gap-2">
                      {<SquarePen className="w-3 h-3 lg:w-5 lg:h-5" />}
                      Edit Details
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 space-x-0 space-y-4 md:space-y-2 lg:space-y-4 text-sm">
                    <p>
                      <strong>First Name:</strong> {user.firstName}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {user.lastName}
                    </p>
                    <p>
                      <strong>Date Of Birth:</strong> {user.dob}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Phone Number:</strong> +91 {user.phone}
                    </p>
                  </div>
                  <hr className="text-sec my-4" />
                  <p className="my-4 text-sm">
                    <strong>Address:</strong>
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 space-x-0 space-y-4 md:space-y-2 lg:space-y-4 text-sm">
                    <p>
                      <strong>Street:</strong> {user.address?.addressLine}
                    </p>
                    <p>
                      <strong>City:</strong> {user.address?.city}
                    </p>
                    <p>
                      <strong>State:</strong> {user.address?.state} -{" "}
                      {user.address?.postalCode}
                    </p>
                    <p>
                      <strong>Country:</strong> {user.address?.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD DETAILS */}
              <div
                className="bg-white rounded-sm py-0 mt-20"
                // removed motion props
              >
                <div className="flex justify-between items-center p-4 mb-4 bg-main">
                  <h2 className="text-xl px-10 font-bold text-white uppercase">
                    Card Details
                  </h2>
                </div>
                <div className="px-5">
                  <div>
                    <p className="px-5 md:px-20 pb-5 text-gray-600 italic text-xs">
                      ***For your security and privacy, your full ATM card details
                      are concealed by default to prevent unauthorized access or
                      fraud. To view your card information, you will need to verify
                      your identity by entering the last 4 digits of your registered
                      phone number. This verification step adds an important layer of
                      protection, ensuring that only you—or someone authorized—can
                      access sensitive information related to your card. Please keep
                      this information confidential and never share your verification
                      details with anyone. If you suspect any unauthorized activity,
                      contact customer support immediately.***
                    </p>
                    <AtmCard />
                  </div>
                  {/* DOWNLOAD CARD BUTTON */}
                  <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-10 py-10">
                    <button className="bg-main text-white hover:opacity-80 cursor-pointer duration-300 px-4 py-2 flex items-center gap-2 justify-center"
                    onClick={handleSend}
                    >
                      <FaDownload /> Download Virtual Card (via Email)
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="bg-sec  mt-10"
                // removed motion props
              >
                <div className="bg-main py-5 text-xl font-semibold px-5 md:px-20 text-white uppercase ">
                  <h1>Mini ATM Service</h1>
                </div>
                <p className="px-5 md:px-24 text-xs italic text-gray-700 py-5">
                  ***Managing your finances is easy and secure with our withdrawal
                  and deposit services. Whether you need cash for everyday expenses
                  or want to add funds to your account, our platform ensures fast
                  and reliable transactions. Always double-check your account
                  details before confirming a withdrawal or deposit to avoid errors.
                  For your safety, keep your banking credentials confidential and
                  report any unauthorized transactions immediately. Our goal is to
                  provide you with convenient access to your money anytime, anywhere.
                  ***
                </p>
                <div className="flex flex-col lg:flex-row justify-between gap-10 items-center py-10 md:py-20 lg:py-10 lg:pt-0 lg:px-64">
                  <h1 className="flex flex-col justify-center items-center text-3xl lg:text-5xl font-bold text-main uppercase">
                    {<FaUniversity className="text-center text-5xl md:text-8xl" />}
                    VaultNet Bank
                  </h1>
                  <MiniAtmService />
                </div>
              </div>
            </>
          ) : (
            <SetAtmPinPage />
          )
        ) : user.accountCreated ? (
          // 2️⃣ Account created but no account object yet
          <p className="font-bold text-main text-center">
            {user.emailVerified ? (
              <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
              <span className="ml-3 font-normal"></span>
            </div>
            ) : (
              <>
              <h1 className="text-xl font-semibold  py-5 px-5 md:px-20 text-white bg-main uppercase flex gap-2 items-center mb-5"><RiAccountBoxFill className="text-4xl pt-1"/>Account Verification</h1>
              <div className="flex flex-col justify-center items-center py-10 md:py-30 px-5 md:px-10">
                <h1 className="flex flex-col lg:flex-row  gap-2 items-center text-xs md:text-lg font-semibold"> <IoWarning className="text-2xl lg:text-2xl"/>Please check your email indox, please click on verify button and verify your account. Or <span className="italic underline  transition-transform duration-300 hover:scale-110">
                <Link to={`/vaultnet-verify-account?token=${user.verificationToken}`}>Click here!</Link>
                </span></h1>
              </div>
              </>
            )}
          </p>
        ) : (
          // 3️⃣ Create Account Prompt
          <div
            className="bg-white rounded-sm"
            // removed motion props
          >
            {loadings ? (
              <div className="">
                <h1 className="text-xl font-semibold  py-5 px-5 md:px-20 text-white bg-main uppercase flex gap-2 items-center"><RiAccountBoxFill className="text-4xl pt-1"/>Open VaultNet Bank Account</h1>
                <BankAccountCreation />
              </div>
            ) : (
              <>
                <div className="p-6 flex flex-col justify-between items-center">
                  <FaUserCircle size={60} className="mx-auto mb-4 text-gray-500" />
                <h2 className="text-xl font-semibold mb-2 text-center">Open Your Bank Account</h2>
                <p className="text-gray-600 mb-6 text-center">
                  Join VaultNet Bank and enjoy secure, fast, and reliable banking
                  services.
                </p>
                <button
                  onClick={handleCreateAccount}
                  disabled={loadings}
                  className="bg-main hover:opacity-70 cursor-pointer duration-300 text-white px-6 py-2 text-center"
                >
                  {loadings ? "Creating..." : "Create Bank Account"}
                </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
