// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";

const ThirdContent = () => {
  return (
    <div className="mx-auto mt-10 flex flex-col justify-center max-w-fit ">
      <div className="mb-5">
        <h6 className="block mb-0 text-[20px] font-normal text-center">
          Exclusive to Fpet
        </h6>
        <h2 className="block  text-[42px] font-bold text-center pb-2">
          Something for everyone, shop our
          <br /> exclusive product lines for pets
        </h2>
      </div>
      <div className="flex gap-x-[80px]">
        <div className="bg-[#4FC4BB] mb-[32px] ">
          <img src={assets.rawble} alt="" className="w-[584px] h-[463.359px]" />
          <div className="relative bottom-10 ml-10">
            <h5 className="text-[60px] font-normal tracking-tighter">
              RAWBBLE
            </h5>
            <div className="text-[18px] font-normal">
              Raw food nutrition designed with single sources of real, <br />
              fresh meat blended with layers of highly digestible <br />{" "}
              ingredients for the pickiest, most colorful palate.
            </div>
            <div className="flex justify-start gap-10 py-4">
              <button className="border rounded-full bg-white text-black py-2.5 px-12 text-[16px] font-semibold">
                Shop Dog
              </button>
              <button className="border rounded-full  bg-white text-black py-2.5 px-12 text-[16px] font-semibold">
                Shop Cat
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#44B9E3] mb-[32px] ">
          <img
            src={assets.rawble_1}
            alt=""
            className="w-[584px] h-[352.188px] mt-3.5 "
          />
          <div className="ml-7">
            <h5 className="text-[60px] font-normal tracking-tighter mt-7">
              LIBERTY
            </h5>
            <div className="text-[18px] font-normal">
              Artfully crafted with clean, thoughtfully sourced <br />{" "}
              ingredients starting with real, fresh meat. Offered in <br />{" "}
              grain-free and grain-friendly recipes for well-rounded <br />
              nutrition.
            </div>
            <div className="flex justify-start gap-10 py-4">
              <button className="border rounded-full bg-white text-black py-2.5 px-12 text-[16px] font-semibold">
                Shop Dog
              </button>
              <button className="border rounded-full  bg-white text-black py-2.5 px-12 text-[16px] font-semibold">
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
