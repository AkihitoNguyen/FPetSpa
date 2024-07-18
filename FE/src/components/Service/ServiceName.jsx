import React from "react";
import { assets } from "../../assets/assets";

const ServiceName = () => {
  return (
    <div className="max-w-[965px] mx-auto my-[55px] font-light">
      <div className="max-w-[954px] py-0 px-[15px] m-auto w-full bg-[#f5f5f7] lg:max-w-[1024px] md:max-w-[768px] sm:max-w-[640px]">
        <div>
          <div className="flex items-end justify-between md:pb-[20px]">
            <div>
              <div className="pl-[15px] text-[26px] font-bold uppercase text-[#FC819E]">
                Trimming service
                {/* <span class=" absolute w-[5px] h-[22px] left-[19.5%] top-[119%] justify-center transform -translate-y-1/2 bg-[#eba9b8]"></span> */}
              </div>
            </div>
          </div>
        </div>  
      </div>

      {/*  */}
      <div>
        <div className="flex flex-wrap justify-center mx-[10px]">
          <div className="grid grid-cols-24 xs:col-span-8 md:col-span-8 lg:col-span-8 px-[10px]">
            <a href="/service">
              <div className="flex flex-col overflow-auto rounded-xl border-none cursor-pointer shadow-xl bg-[#fff]">
                <div className="w-fill-available h-full rounded-[4px] relative overflow-hidden">
                  <img
                    src={assets.team}
                    alt=""
                    className="w-[294.663px] h-[200px]"
                  />
                </div>
                <div className="w-full py-2 md:px-5">
                  <div className="font-bold text-base leading-5 md:leading-7 text-center md:text-left md:text-[24px] overflow-hidden line-clamp line-clamp-3 mb-1 text-[#FC819E]">
                    <div className="flex gap-y-2">
                      <span>Trimming</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-full md:flex-row">
                    <div className="flex items-center gap-1 text-[14px] md:text-sm text-[#FC819E] justify-center">
                      <span>Learn more</span>
                      <img
                        src="https://30shine.com/static/media/VectorRight.3c56adf3.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <div className="grid grid-cols-24 xs:col-span-8 md:col-span-8 lg:col-span-8 px-[10px]">
            <a href="/">
              <div className="flex flex-col overflow-auto rounded-xl border-none cursor-pointer shadow-xl bg-[#fff]">
                <div className="w-fill-available h-full rounded-[4px] relative overflow-hidden">
                  <img
                    src={assets.Grooming_dog}
                    alt=""
                    className="w-[294.663px] h-[200px]"
                  />
                </div>
                <div className="w-full py-2 md:px-5">
                  <div className="font-bold text-base leading-5 md:leading-7 text-center md:text-left md:text-[24px] overflow-hidden line-clamp line-clamp-3 mb-1 text-[#FC819E]">
                    <div className="flex gap-y-2">
                      <span>Cut and style</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-full md:flex-row">
                    <div className="flex items-center gap-1 text-[14px] md:text-sm text-[#FC819E] justify-center">
                      <span>Learn more</span>
                      <img
                        src="https://30shine.com/static/media/VectorRight.3c56adf3.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <div className="grid grid-cols-24 xs:col-span-8 md:col-span-8 lg:col-span-8 px-[10px]">
            <a href="/">
              <div className="flex flex-col overflow-auto rounded-xl border-none cursor-pointer shadow-xl bg-[#fff]">
                <div className="w-fill-available h-full rounded-[4px] relative overflow-hidden">
                  <img
                    src={assets.Grooming_dog}
                    alt=""
                    className="w-[294.663px] h-[200px]"
                  />
                </div>
                <div className="w-full py-2 md:px-5">
                  <div className="font-bold text-base leading-5 md:leading-7 text-center md:text-left md:text-[24px] overflow-hidden line-clamp line-clamp-3 mb-1 text-[#FC819E]">
                    <div className="flex gap-y-2">
                      <span>Trimming</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-full md:flex-row">
                    <div className="flex items-center gap-1 text-[14px] md:text-sm text-[#FC819E] justify-center">
                      <span>Learn more</span>
                      <img
                        src="https://30shine.com/static/media/VectorRight.3c56adf3.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceName;
