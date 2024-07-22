import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showBookingDropdown, setShowBookingDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleServicesDropdown = () => {
    setShowServicesDropdown(!showServicesDropdown);
  };

  const toggleBookingDropdown = () => {
    setShowBookingDropdown(!showBookingDropdown);
  };

  const toggleProductDropdown = () => {
    setShowProductDropdown(!showProductDropdown);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="min-h-screen w-[286px] my-4 ml-4 bg-[#FFFFFF] border rounded-xl text-white">
      <div className="flex justify-center items-center gap-3 p-4 font-bold text-lg border-b">
        <img src={assets.logo} alt="" className="w-16" />
        <div>FPet Spa</div>
      </div>
      <ul className="flex flex-col mt-2 p-2 gap-y-5">
        <Link to="/layout/dashboards" className="hover:text-[#607D8B]">
          <li
            className={`flex gap-3 py-3 pl-2.5 pr-3 ml-2 mr-4 text-[16px] font-medium cursor-pointer hover:bg-[#FC819E] hover:py-1 hover:rounded-lg ${
              activeLink === "/layout/dashboards"
                ? "bg-[#FC819E] text-white rounded-lg hover:text-white"
                : "text-[#607D8B]"
            }`}
            onClick={() => handleLinkClick("/layout/dashboards")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-inherit">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
            </svg>
            Dashboards
          </li>
        </Link>
        <Link to="/layout/account-info" className="hover:text-[#607D8B]">
          <li
            className={`flex gap-3 py-3 pl-2.5 pr-3 ml-2 mr-4 text-[16px] font-medium cursor-pointer hover:bg-[#FC819E] hover:py-1 hover:rounded-lg ${
              activeLink === "/layout/account-info"
                ? "bg-[#FC819E] text-white rounded-lg hover:text-white"
                : "text-[#607D8B]"
            }`}
            onClick={() => handleLinkClick("/layout/account-info")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-inherit">
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"></path>
            </svg>
            Customer
          </li>
        </Link>

        <li className="relative">
          <div
            className={`flex gap-3 py-3 pl-2.5 pr-3 ml-2 mr-4 text-[16px] font-medium cursor-pointer justify-between items-center hover:bg-[#FC819E] hover:py-1 hover:rounded-lg ${
              activeLink === "/layout/product-info" ||
              activeLink === "/layout/add-product"
                ? "bg-[#FC819E] text-white rounded-lg hover:text-white"
                : "text-[#607D8B]"
            }`}
            onClick={() => (
              toggleProductDropdown(), handleLinkClick("/layout/product-info")
            )}>
            Product Manager
            <svg
              className={`transform transition-transform duration-300 ${
                showProductDropdown ? "rotate-180" : ""
              }`}
              width="12"
              height="12"
              viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 14l-8-8h16z" />
            </svg>
          </div>
          {showProductDropdown && (
            <ul className="bg-[#FFFFFF] text-[#607D8B] mt-1 text-[16px] font-medium transform transition-transform duration-500">
              <Link to="/layout/product-info" className="hover:text-[#607D8B]">
                <li className={`py-3 pl-2.5 pr-3 ml-2 mr-4 cursor-pointer `}>
                  Product
                </li>
              </Link>
              <Link to="/layout/add-product" className="hover:text-[#607D8B]">
                <li className={`py-3 pl-2.5 pr-3 ml-2 mr-4 cursor-pointer `}>
                  Add Product
                </li>
              </Link>
            </ul>
          )}
        </li>

        <li className="relative">
          <div
            className={`flex gap-3 py-3 pl-2.5 pr-3 ml-2 mr-4 text-[16px] font-medium cursor-pointer justify-between items-center hover:bg-[#FC819E] hover:py-1 hover:rounded-lg ${
              activeLink === "/layout/view-service" ||
              activeLink === "/layout/add-service" ||
              activeLink === "/layout/edit-service/:servicesId"
                ? "bg-[#FC819E] text-white rounded-lg hover:text-white"
                : "text-[#607D8B]"
            }`}
            onClick={() => (
              toggleServicesDropdown(), handleLinkClick("/layout/view-service")
            )}>
            Services Management
            <svg
              className={`transform transition-transform duration-300 ${
                showServicesDropdown ? "rotate-180" : ""
              }`}
              width="12"
              height="12"
              viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 14l-8-8h16z" />
            </svg>
          </div>
          {showServicesDropdown && (
            <ul className="bg-[#FFFFFF] text-[#607D8B] mt-1 text-[16px] font-medium transform transition-transform duration-500">
              <Link to="/layout/view-service" className="hover:text-[#607D8B]">
                <li className={`p-4 cursor-pointer`}>Services</li>
              </Link>
              <Link to="/layout/add-service" className="hover:text-[#607D8B]">
                <li
                  className={`p-4 cursor-pointer`}
                  onClick={() => handleLinkClick("/layout/add-service")}>
                  Add Service
                </li>
              </Link>
              <Link
                to="/layout/edit-service/:servicesId"
                className="hover:text-[#607D8B]">
                <li
                  className={`p-4 cursor-pointer `}
                  onClick={() =>
                    handleLinkClick("/layout/edit-service/:servicesId")
                  }>
                  Edit Service
                </li>
              </Link>
            </ul>
          )}
        </li>

        <li className="relative">
          <div
            className={`flex gap-3 py-3 pl-2.5 pr-3 ml-2 mr-4 text-[16px] font-medium cursor-pointer justify-between items-center hover:bg-[#FC819E] hover:py-1 hover:rounded-lg ${
              activeLink === "/layout/booking-info" ||
              activeLink === "/layout/add-booking"
                ? "bg-[#FC819E] text-white rounded-lg hover:text-white"
                : "text-[#607D8B]"
            }`}
            onClick={() => (
              toggleBookingDropdown(), handleLinkClick("/layout/booking-info")
            )}>
            Booking Manager
            <svg
              className={`transform transition-transform duration-300 ${
                showBookingDropdown ? "rotate-180" : ""
              }`}
              width="12"
              height="12"
              viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 14l-8-8h16z" />
            </svg>
          </div>
          {showBookingDropdown && (
            <ul className="bg-[#FFFFFF] text-[#607D8B] mt-1 text-[16px] font-medium transform transition-transform duration-500">
              <li
                className={`p-4 cursor-pointer`}
                onClick={() => handleLinkClick("/layout/service-info")}>
                <Link
                  to="/layout/service-info"
                  className="hover:text-[#607D8B]">
                  Bookings
                </Link>
              </li>
              <li
                className={`p-4 cursor-pointer `}
                onClick={() => handleLinkClick("/layout/add-booking")}>
                <Link to="/add-order/ORS1" className="hover:text-[#607D8B]">
                  Add Booking
                </Link>
              </li>
              <li
                className={`p-4 cursor-pointer `}
                onClick={() => handleLinkClick("/layout/booking-product")}>
                <Link to="/layout/booking-product" className="hover:text-[#607D8B]">
                  Order Product
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
