// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";

const SecondContent = () => {
  return (
    <div className="flex justify-center py-5 relative flex-col m-auto">
      <div className="pb-4">
        <h6 className="m-auto text-[20px] font-normal text-center leading-6 max-w-full tracking-tight">
          Everything they need. Nothing they don’t.
        </h6>
        <h2 className="m-auto text-[46px] font-bold text-center tracking-tighter ">
          Your pet’s nutrition doesn’t need to be
          <br /> hard.
        </h2>
      </div>
      <div className="flex justify-center items-center gap-x-8 ">
        <div className="grid">
          <img
            src={assets.content_1}
            alt=""
            className="w-my-width h-my-height"
          />
          <div className="text-center">
            <h3 className="text-[32px] font-bold">Treats</h3>
            <div className="text-[18px] font-normal">
              No boring biscuits allowed.
            </div>
          </div>
          <div className="flex justify-center gap-10 py-4 ">
            <button className="border rounded-full bg-black text-white py-2.5 px-12">
              Shop Dog
            </button>
            <button className="border rounded-full bg-myPink text-white py-2.5 px-12">
              Shop Cat
            </button>
          </div>
        </div>
        <div>
          <img
            src={assets.content_2}
            alt=""
            className="w-my-width h-my-height"
          />
          <div className="text-center">
            <h3 className="text-[32px] font-bold">Food</h3>
            <div className="text-[18px] font-normal">
              Nutrition they need, the flavor they want.
            </div>
          </div>
          <div className="flex justify-center gap-10 py-4">
            <button className="border rounded-full bg-black text-white py-2.5 px-12 ">
              Shop Dog
            </button>
            <button className="border rounded-full bg-myPink text-white py-2.5 px-12">
              Shop Cat
            </button>
          </div>
        </div>
        <div>
          <img
            src={assets.content_3}
            alt=""
            className="w-my-width h-my-height"
          />
          <div className="text-center">
            <h3 className="text-[32px] font-bold">Supplements</h3>
            <div className="text-[18px] font-normal">
              Nutrition they need, the flavor they want.
            </div>
          </div>
          <div className="flex justify-center gap-10 py-4">
            <button className="border rounded-full bg-black text-white py-2.5 px-12 ">
              Shop Dog
            </button>
            <button className="border rounded-full bg-myPink text-white py-2.5 px-12">
              Shop Cat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondContent;
