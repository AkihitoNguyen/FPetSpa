import React, { useState } from "react";

const SidebarProfile = ({ setActiveSection }) => {
  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setActiveSection(link);
  };

  return (
    <div className="min-h-screen w-64 my-4 ml-4 bg-[#FFFFFF] border rounded-xl text-white">
      <div className="p-4 font-bold text-lg border-b">
        <img src="" alt="" />
      </div>
      <ul className="mt-2 text-[#607D8B] text-[16px] font-medium">
        <li
          className={`p-4 cursor-pointer ${
            activeLink === "/account-info"
              ? "bg-[#FC819E] text-white rounded-lg"
              : ""
          }`}
          onClick={() => handleLinkClick("account-info")}
        >
          Profile
        </li>
        <li
          className={`p-4 cursor-pointer ${
            activeLink === "/pet-info"
              ? "bg-[#FC819E] text-white rounded-lg"
              : ""
          }`}
          onClick={() => handleLinkClick("pet-info")}
        >
          Pet Information
        </li>
        <li
          className={`p-4 cursor-pointer ${
            activeLink === "/order-management"
              ? "bg-[#FC819E] text-white rounded-lg"
              : ""
          }`}
          onClick={() => handleLinkClick("order-management")}
        >
          Order Management
        </li>
      </ul>
    </div>
  );
};

export default SidebarProfile;
