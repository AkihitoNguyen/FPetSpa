import React from "react";
import Slide from "../../components/Slide/Slide";
import "./Home.css"; // Import the CSS file
import ServiceName from "../../components/Service/ServiceName";
import ServiceName2 from "../../components/Service/ServiceName2";

const Home = () => {
  return (
    <div className="bg-[#F5F5F7]">
      <div className="mb-[69px]">
        <Slide />
      </div>
      <div className="flex justify-center items-center">
        {/* left content */}
        <div className="w-[550px] flex flex-col mx-80 mr-[20px] mt-[23px] md:ml-1 lg:mr-4 text-white bg-[#DA7297] rounded-xl px-[28px] pt-[12px] pb-[16px]">
          <div>
            <div className="text-[18px] font-bold">
              MAKE AN APPOINTMENT IN ONLY 30 SECONDS
            </div>
            <div className="text-[18px] font-light py-0.5">
              Fast, convenient, and reliable pet grooming services.
            </div>
          </div>

          {/*  */}
          <div className="flex mt-3 gap-4">
            <a
              href="/booking"
              className="bg-gradient-to-r from-[#f0f9ff] via-[#cbebff] hover:text-[#262626] hover:from-[#f0f9ff] text-[#262626] text-[16px] font-semibold border-2  border-[#e5e7eb] rounded-lg px-4 py-2">
              BOOKING NOW
            </a>
          </div>
        </div>

        {/* right */}
        <div className="h-[125px] flex flex-col gap-y-1 mb-1.5 py-[20px] px-[12px] cursor-pointer bg-[#FFFFFF] rounded-lg">
          <div>
            <div className="text-[13px] leading-none font-bold text-[#FC819E]">YOUR FEEDBACK MATTERS</div>
          </div>
          <div className="block font-normal pt-1 text-[12px] text-gray-400">
            Your feedback helps us improve our service quality <br /> to better serve you
          </div>
          <div className="star-container">
            <span className="star">&#9733;</span>
            <span className="star">&#9733;</span>
            <span className="star">&#9733;</span>
            <span className="star">&#9733;</span>
            <span className="star">&#9733;</span>
          </div>
        </div>
      </div>
      <ServiceName/>
      <ServiceName2/>
    </div>
  );
};

export default Home;