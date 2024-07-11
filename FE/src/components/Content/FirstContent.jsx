// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";

const FirstContent = () => {
  return (
    <section className="max-h-screen">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 sm:px-48 sm:py-16 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h6 className="text-[20px] font-normal mt-4 text-gray-700">
            Sample for Dogs and Cats
          </h6>
          <h1 className="text-custom_1 font-bold tracking-tight text-gray-900 sm:text-6xl">
            Take the Tail-
            <br /> Wagging Taste Test
          </h1>
          <div className="flex gap-x-4 py-4">
            <div>
              <button className="border rounded-full bg-black text-white py-2.5 px-16">
                <a href="">Shop Dog</a>
              </button>
            </div>
            <div>
              <button className="border rounded-full bg-black text-white py-2.5 px-16">
                <a href="">Shop Cat</a>
              </button>
            </div>
          </div>
        </div>
        <div>
          <img src={assets.header_img} alt="" className="w-5/6" />
        </div>
      </div>
    </section>
  );
};

export default FirstContent;
