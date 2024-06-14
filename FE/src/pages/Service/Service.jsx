import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import ServiceContent2 from "../../components/Content/ServiceContent2";
const Service = () => {
  const navigate = useNavigate();

  return (
    <div className="max-h-screen max-w-full mt-10">
      <div className="mx-auto flex items-center flex-row justify-center gap-x-20">
        <div className="">
          <h6 className="text-[20px] font-normal leading-6 mt-10 text-[#000000]">
            Discover Top-notch Pet Care Services
          </h6>
          <h1 className="text-[54px] font-bold leading-[64.8px] mb-8 text-[#000000]">
            High-end pet care
          </h1>
          <p>
            At Fpet, we understand that your pet is family, and we treat them as{" "}
            <br />
            such. With a range of services including pet sitting, and <br />
            personalized training, we're here to support you and your pet every{" "}
            <br />
            step of the way. Trust us to provide the care and attention your{" "}
            <br />
            furry friend deserves.
          </p>
          <button
            className="border rounded-full bg-black text-white py-2.5 px-16"
            onClick={() => {
              navigate("/booking");
            }}>
            Booking
          </button>
        </div>
        <div>
          <img src={assets.ser_1} alt="" className="w-[608px] h-[350.312px]" />
        </div>
      </div>
      {/*  */}
      <div className="bg-myCusColor">
        <ServiceContent2/>
      </div>
    </div>
  );
};

export default Service;
