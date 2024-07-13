// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";

const SecondContent = () => {
  return (
    <div className="flex flex-col items-center py-5 relative w-full max-w-7xl m-auto px-4">
      <div className="pb-4">
        <h6 className="m-auto text-[16px] sm:text-[20px] font-normal text-center leading-6 max-w-full tracking-tight">
          Everything they need. Nothing they don’t.
        </h6>
        <h2 className="m-auto text-[28px] sm:text-[36px] md:text-[46px] font-bold text-center tracking-tighter">
          Your pet’s nutrition doesn’t need to be
          <br className="hidden md:block" /> hard.
        </h2>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 py-8 flex-wrap">
        <div className="flex flex-col items-center text-center">
          <img
            src={assets.content_1}
            alt="Treats"
            className="w-40 h-40 sm:w-60 sm:h-60 lg:w-my-width lg:h-my-height"
          />
          <div className="pt-4">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold">Treats</h3>
            <div className="text-[14px] sm:text-[16px] md:text-[18px] font-normal">
              No boring biscuits allowed.
            </div>
          </div>
          <div className="flex justify-center gap-4 sm:gap-10 py-4">
            <button className="border rounded-full bg-black text-white py-2.5 px-8 sm:px-12">
              Shop Dog
            </button>
            <button className="border rounded-full bg-myPink text-white py-2.5 px-8 sm:px-12">
              Shop Cat
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src={assets.content_2}
            alt="Food"
            className="w-40 h-40 sm:w-60 sm:h-60 lg:w-my-width lg:h-my-height"
          />
          <div className="pt-4">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold">Food</h3>
            <div className="text-[14px] sm:text-[16px] md:text-[18px] font-normal">
              Nutrition they need, the flavor they want.
            </div>
          </div>
          <div className="flex justify-center gap-4 sm:gap-10 py-4">
            <button className="border rounded-full bg-black text-white py-2.5 px-8 sm:px-12">
              Shop Dog
            </button>
            <button className="border rounded-full bg-myPink text-white py-2.5 px-8 sm:px-12">
              Shop Cat
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src={assets.content_3}
            alt="Supplements"
            className="w-40 h-40 sm:w-60 sm:h-60 lg:w-my-width lg:h-my-height"
          />
          <div className="pt-4">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold">Supplements</h3>
            <div className="text-[14px] sm:text-[16px] md:text-[18px] font-normal">
              Nutrition they need, the flavor they want.
            </div>
          </div>
          <div className="flex justify-center gap-4 sm:gap-10 py-4">
            <button className="border rounded-full bg-black text-white py-2.5 px-8 sm:px-12">
              Shop Dog
            </button>
            <button className="border rounded-full bg-myPink text-white py-2.5 px-8 sm:px-12">
              Shop Cat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondContent;
