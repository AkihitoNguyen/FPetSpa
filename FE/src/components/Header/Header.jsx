import React from "react";
import { assets } from "../../assets/assets";
const Header = () => {
  return (
    <section class="max-h-screen">
      <div class="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 sm:px-48 sm:py-16 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h6 class="text-[20px] font-normal mt-4 text-gray-700">
            Sample Boxes for Dogs and Cats
          </h6>
          <h1 class="text-custom_1 font-bold tracking-tight text-gray-900 sm:text-6xl">
            Take the Tail-
            <br /> Wagging Taste Test
          </h1>
          <div class="flex gap-x-4 py-4">
            <div>
            <button class="border rounded-full bg-black text-white py-2.5 px-16">
              <a href="">Shop</a>
            </button>
            </div>
            <div>
              <button class="border rounded-full bg-myPink text-white py-2.5 px-16">
              <a href="">Service</a>
            </button>
            </div>
          </div>
        </div>
        <div>
          <img src={assets.header_img} alt="" class="w-5/6" />
        </div>
      </div>
    </section>
  );
};

export default Header;
