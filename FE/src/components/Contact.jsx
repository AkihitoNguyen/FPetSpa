import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-1/2 mx-auto divide-x-2 gap-10 h-96 items-start">
      <div className="flex justify-between gap-32">
        <div className="space-y-4 items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact</h1>
          <p>
            Chúng tôi luôn cống hiến hết mình mỗi ngày để cung cấp đến
            <br /> người nuôi thú cưng cũng như đối tác những sản phẩm chất
            <br /> lượng và tốt nhất cho sức khoẻ của thú cưng. Để biết thêm
            <br /> thông tin chi tiết về các loại sản phẩm hay các nhu cầu cần
            <br /> được hỗ trợ khác, vui lòng liên hệ với chúng tôi để được phục
            vụ
            <br /> tốt nhất.
          </p>
          <button className="border-solid border border-myPink rounded-md px-3.5 py-2.5 text-sm shadow-sm hover:bg-myPink">Support center</button>
        </div>
        <div className="flex flex-col gap-10 ">
          <div className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">CONTACT DETAILS</div>
          <div className="flex gap-2">
            <img src={assets.phone} alt="" className="w-5"/> +0123 456 789
          </div>
          <div className="flex gap-2">
            <img src={assets.email} alt="" className="w-5"/> fpet@gmail.com
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Contact;
