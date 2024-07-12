import React from "react";

const SidebarProfile = ({ setActiveSection }) => {


  return (
    <div className="min-h-screen  w-64 bg-gray-800 text-white">
      <div className="p-4 font-bold text-lg border-b border-gray-700">
        <img src="" alt="" />
      </div>
      <ul className="mt-2">
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => setActiveSection("account-info")}>
          Thông tin tài khoản
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => setActiveSection("pet-info")}>
          Thông tin thú cưng
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => setActiveSection("order-management")}>
          Quản lý đơn hàng
        </li>
      </ul>
    </div>
  );
};

export default SidebarProfile;
