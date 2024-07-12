// eslint-disable-next-line no-unused-vars
import React from "react";
import { assets } from "../../assets/assets";

const Contact = () => {

  
  return (
    <div className="mb-28">
      <div className="flex justify-center items-center py-5 relative flex-col w-8/12	m-auto text-center ">
        <h6 className="text-[20px] font-normal m-auto tracking-[-0.4px] leading-[24px]">
          Customer Support
        </h6>
        <h1 className="text-[46px] font-bold tracking-[-0.92px] leading-[55.2px]">
          QUESTIONS? WE HAVE ANSWERS...
        </h1>

        <div className="relative w-[836.150px] h-[353.837px] mt-10">
          <img src={assets.content_4} alt="" loading="lazy" className="" />
        </div>
      </div>

      <div className="mt-10">
        <div className="grid justify-center text-start text-[18px] font-normal leading-[28px]">
          Customer satisfaction is a top priority at FPet. If you’re ever
          unsatisfied with your purchase, please contact our customer service
          team <br /> and we’ll be happy to assist you. <br />
          <br />
          Just have a question about the product? Below we have answers to
          common questions we receive. Take a look, if you don’t find what you{" "}
          <br />
          are looking for, fill out the form and we will get back to you as soon
          as possible!
        </div>
      </div>
      {/*  */}
      
      {/*  */}
    </div>
  );
};

export default Contact;
