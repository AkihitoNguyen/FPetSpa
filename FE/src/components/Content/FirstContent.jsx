// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";

const FirstContent = () => {
  return (
    <section className="max-h-screen">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 sm:px-8 md:px-12 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h6 className="text-[16px] sm:text-[20px] font-normal mt-4 text-gray-700">
            Sample for Dogs and Cats
          </h6>
          <h1 className="text-[24px] sm:text-[36px] md:text-[48px] lg:text-custom_1 font-bold tracking-tight text-gray-900">
            Take the Tail-
            <br className="hidden md:block" /> Wagging Taste Test
          </h1>
          <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 gap-x-4 py-4">
            <div>
              <button className="border rounded-full bg-black text-white py-2.5 px-8 sm:px-12 md:px-16">
                <a href="">Shop Dog</a>
              </button>
            </div>
            <div>
              <button className="border rounded-full bg-black text-white py-2.5 px-8 sm:px-12 md:px-16">
                <a href="">Shop Cat</a>
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <img src={assets.header_img} alt="" className="w-5/6 lg:w-full" />
        </div>
      </div>
    </section>
  );
};

export default FirstContent;
