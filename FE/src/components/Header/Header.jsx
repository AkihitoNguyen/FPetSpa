// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <section className="max-h-screen">
      <div className="mx-auto grid max-w-full md:max-w-2xl lg:max-w-7xl grid-cols-1 lg:grid-cols-2 items-center gap-x-8 gap-y-16 px-4 py-8 sm:px-8 sm:py-16 lg:px-8">
        <div>
          <h6 className="text-[16px] sm:text-[20px] font-normal mt-4 text-gray-700">
            Sample for Dogs and Cats
          </h6>
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-custom_1 font-bold tracking-tight text-gray-900">
            Relaxing retreat for
            <br className="hidden md:block" /> furry friends
          </h1>
          <div className="flex gap-x-4 py-4">
            <button
              onClick={() => {
                navigate("/service");
              }}
              className="border rounded-full bg-black text-white py-2.5 px-8 sm:px-16"
            >
              Service
            </button>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <img src={assets.Soapy} alt="Header Image" className="w-5/6 lg:w-full" />
        </div>
      </div>
    </section>
  );
};

export default Header;
