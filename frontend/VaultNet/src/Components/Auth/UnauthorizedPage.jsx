// src/Components/UnauthorizedPage.jsx
import { Link } from "react-router-dom";
import { IoMdLock } from "react-icons/io";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[92vh] text-center bg-gray-100 dark:bg-gray-900 px-5">
      <h1 className="text-2xl md:text-6xl font-bold text-main flex flex-col md:flex-row gap-3 items-center uppercase">
        <IoMdLock className="text-4xl md:text-7xl" />
        Unauthorized
      </h1>
      <p className="mt-4 text-base md:text-xl text-gray-700 dark:text-gray-300">
        Sorry! You don’t have permission to access this page.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-white bg-main shadow hover:bg-main/90"
      >
        Go Home
      </Link>
    </div>
  );
}
