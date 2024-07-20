// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";

const ThirdContent = () => {
  return (
    <div className="mx-auto mt-10 flex flex-col justify-center max-w-7xl px-4">
      <div className="mb-5">
        <h6 className="block mb-0 text-[16px] sm:text-[20px] font-normal text-center">
          Exclusive to Fpet
        </h6>
        <h2 className="block text-[28px] sm:text-[36px] md:text-[42px] font-bold text-center pb-2">
          Something for everyone, shop our
          <br className="hidden md:block" /> exclusive product lines for pets
        </h2>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 flex-wrap">
        <div className="bg-[#4FC4BB] mb-8 w-full md:w-auto flex flex-col items-center text-center md:text-left">
          <img
            src={assets.rawble}
            alt="RAWBBLE"
            className="w-full h-auto md:w-[584px] md:h-[463.359px]"
          />
          <div className="p-6 md:p-10 relative md:bottom-10">
            <h5 className="text-[40px] sm:text-[50px] md:text-[60px] font-normal tracking-tighter">
              RAWBBLE
            </h5>
            <div className="text-[14px] sm:text-[16px] md:text-[18px] font-normal">
              Raw food nutrition designed with single sources of real, <br />
              fresh meat blended with layers of highly digestible <br />{" "}
              ingredients for the pickiest, most colorful palate.
            </div>
            <div className="flex justify-center md:justify-start gap-4 sm:gap-10 py-4">
              <button className="border rounded-full bg-white text-black py-2.5 px-8 sm:px-12 text-[14px] sm:text-[16px] font-semibold">
                Shop Dog
              </button>
              <button className="border rounded-full bg-white text-black py-2.5 px-8 sm:px-12 text-[14px] sm:text-[16px] font-semibold">
                Shop Cat
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#44B9E3] mb-8 w-full md:w-auto flex flex-col items-center text-center md:text-left">
          <img
            src={assets.rawble_1}
            alt="LIBERTY"
            className="w-full h-auto md:w-[584px] md:h-[352.188px] mt-3.5"
          />
          <div className="p-6 md:p-10 relative md:ml-7">
            <h5 className="text-[40px] sm:text-[50px] md:text-[60px] font-normal tracking-tighter mt-7">
              LIBERTY
            </h5>
            <div className="text-[14px] sm:text-[16px] md:text-[18px] font-normal">
              Artfully crafted with clean, thoughtfully sourced <br />{" "}
              ingredients starting with real, fresh meat. Offered in <br />{" "}
              grain-free and grain-friendly recipes for well-rounded <br />
              nutrition.
            </div>
            <div className="flex justify-center md:justify-start gap-4 sm:gap-10 py-4">
              <button className="border rounded-full bg-white text-black py-2.5 px-8 sm:px-12 text-[14px] sm:text-[16px] font-semibold">
                Shop Dog
              </button>
              <button className="border rounded-full bg-white text-black py-2.5 px-8 sm:px-12 text-[14px] sm:text-[16px] font-semibold">
                Shop Cat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdContent;
