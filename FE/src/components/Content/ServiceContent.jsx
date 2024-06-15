// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const ServiceContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center py-5 relative flex-col w-8/12	m-auto">
      <div className="pb-4">
        <h6 className="w-fit m-auto text-[20px] font-normal text-center leading-6 max-w-full tracking-tight">
          Tailored care for your furry friend. No frills, just pampering.
        </h6>
        <h2 className="w-fit m-auto text-[46px] font-bold text-center tracking-tighter ">
          Pampering made simple. Indulge your pet .
          <br />
          without the hassle
        </h2>
      </div>
      <div className="flex justify-center items-center gap-x-24">
        <div className="grid">
          <img
            onClick={() => {
              navigate("/booking");
            }}
            src={assets.Soapy}
            alt=""
            className="w-my-width h-my-height cursor-pointer hover:p-10 transition-all ease-in-out duration-300"
          />
          <div className="text-center">
            <h3 className="text-[32px] font-bold">Bath</h3>
            <div className="text-[18px] font-normal">
              Deep-cleansing shampoo.
            </div>
          </div>
        </div>
        <div>
          <img
            onClick={() => {
              navigate("/booking");
            }}
            src={assets.grooming}
            alt=""
            className="w-my-width h-my-height cursor-pointer hover:p-10 transition-all ease-in-out duration-300"
          />
          <div className="text-center">
            <h3 className="text-[32px] font-bold">Grooming</h3>
            <div className="text-[18px] font-normal">
              Nail trim, cut and style
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceContent;
