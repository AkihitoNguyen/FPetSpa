// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const ServiceContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full max-w-7xl m-auto py-5 px-4 lg:px-0 relative">
      <div className="pb-4 text-center">
        <h6 className="text-[16px] sm:text-[20px] font-normal leading-6 max-w-full tracking-tight">
          Tailored care for your furry friend. No frills, just pampering.
        </h6>
        <h2 className="text-[28px] sm:text-[36px] md:text-[46px] font-bold tracking-tighter">
          Pampering made simple. Indulge your pet
          <br className="hidden md:block" />
          without the hassle
        </h2>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-y-10 md:gap-y-0 md:gap-x-12 lg:gap-x-24">
        <div className="grid place-items-center">
          <img
            onClick={() => {
              navigate("/booking");
            }}
            src={assets.Soapy}
            alt="Bath service"
            className="w-48 h-48 md:w-my-width md:h-my-height cursor-pointer hover:p-10 transition-all ease-in-out duration-300"
          />
          <div className="text-center">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold">Bath</h3>
            <div className="text-[14px] sm:text-[16px] md:text-[18px] font-normal">
              Deep-cleansing shampoo.
            </div>
          </div>
        </div>
        <div className="grid place-items-center">
          <img
            onClick={() => {
              navigate("/booking");
            }}
            src={assets.grooming}
            alt="Grooming service"
            className="w-48 h-48 md:w-my-width md:h-my-height cursor-pointer hover:p-10 transition-all ease-in-out duration-300"
          />
          <div className="text-center">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold">Grooming</h3>
            <div className="text-[14px] sm:text-[16px] md:text-[18px] font-normal">
              Nail trim, cut and style.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceContent;
