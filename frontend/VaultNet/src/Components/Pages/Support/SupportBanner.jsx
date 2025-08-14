import React from "react";
import { BiSupport } from "react-icons/bi";

export default function SupportBanner() {
  return (
    <div className="bg-main text-white uppercase py-12 md:py-20 px-5 md:px-30 flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 flex gap-3">
        <BiSupport className="text-4xl md:text-6xl"/>Support Center
      </h1>
      <p className="text-sm text-gray-300  text-center mb-4 leading-relaxed">
        Welcome to our Support Center — your one-stop destination for assistance and answers.  
        Whether you need help managing your account, resolving transaction issues, or understanding our services, we are here to provide prompt, reliable support tailored to your needs.
      </p>
    </div>
  );
}
