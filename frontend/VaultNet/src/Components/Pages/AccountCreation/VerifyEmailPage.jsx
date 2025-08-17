import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../../axiosInstance"; // adjust path
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const executedRef = useRef(false); // ✅ persists across renders

  useEffect(() => {
    if (executedRef.current) return; // ✅ run only once
    executedRef.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      toast.error("Invalid verification link.");
      return;
    }

    // const loadingToastId = toast.loading("Verifying your email, please wait...");

    axios
      .get(`/auth/verify?token=${token}`)
      .then((res) => {
        setStatus("success");
        const successMsg = res.data || "Your email has been verified successfully!";
        setMessage(successMsg);
        // toast.dismiss(loadingToastId);
        toast.success(successMsg);
        setTimeout(() => {
        window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        setStatus("error");
        const errorMsg =
          err.response?.data || "Verification failed. Token may be invalid or expired.";
        setMessage(errorMsg);
        // toast.dismiss(loadingToastId);
        toast.error(errorMsg);
      });
  }, [searchParams]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 w-[400px] h-[150px] flex flex-col justify-center items-center">
        {status === "loading" && (
          <>
            <div className="animate-spin border-4 border-main border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your email, please wait...</p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-xl font-bold text-green-600 mb-2">Email Verified</h1>
            <p className="text-gray-700">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-xl font-bold text-red-600 mb-2"> Verification Failed</h1>
            <p className="text-gray-700">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
