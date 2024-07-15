import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showBookingDropdown, setShowBookingDropdown] = useState(false);
  const [showProductDropdown,setshowProductDropdown] = useState(false);

  const toggleServicesDropdown = () => {
    setShowServicesDropdown(!showServicesDropdown);
  };

  const toggleBookingDropdown = () => {
    setShowBookingDropdown(!showBookingDropdown);
  };
  const toggleProductDropdown = () => {
    setshowProductDropdown(!showProductDropdown);
  };

  return (
    <div className="min-h-screen w-64 bg-neutral-900 text-white">
      <div className="flex justify-center items-center gap-3 p-4 font-bold text-lg border-b">
        <img src={assets.logo} alt="" className="w-16" />
        <div>FPet Spa</div>
      </div>
      <ul className="mt-2">
        <li className="p-4 text-[#9A9CAE] text-[13.975px] font-medium cursor-pointer hover:text-white">
          <Link to="/layout/dashboards">Dashboards</Link>
        </li>
        <li className="p-4 text-[#9A9CAE] text-[13.975px] font-medium cursor-pointer hover:text-white">
          <Link to="/layout/account-info">Customer</Link>
        </li>

        <li className="relative">
          <div
            className="p-4 text-[#9A9CAE] text-[13.975px] font-medium cursor-pointer hover:text-white flex justify-between items-center"
            onClick={toggleProductDropdown}>
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
            <ul className="bg-neutral-900 text-[#9A9CAE] mt-1 text-[13.975px] font-medium transform transition-transform duration-500">
              <li className="p-4 cursor-pointer hover:text-white">
                <Link to="/layout/product-info">Product</Link>
              </li>
              <li className="p-4 cursor-pointer hover:text-white">
                <Link to="/layout/add-product">Add Product</Link>
              </li>
             
            </ul>
          )}
        </li>

        <li className="relative">
          <div
            className="p-4 text-[#9A9CAE] text-[13.975px] font-medium cursor-pointer hover:text-white flex justify-between items-center"
            onClick={toggleServicesDropdown}>
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
            <ul className="bg-neutral-900 text-[#9A9CAE] mt-1 text-[13.975px] font-medium transform transition-transform duration-500">
              <li className="p-4 cursor-pointer hover:text-white">
                <Link to="/layout/view-service">Services</Link>
              </li>
              <li className="p-4 cursor-pointer hover:text-white">
                <Link to="/layout/add-service">Add Service</Link>
              </li>
              <li className="p-4 cursor-pointer hover:text-white">
                <Link to="/layout/edit-service/:servicesId">Edit Service</Link>
              </li>
            </ul>
          )}
        </li>
        <li className="relative">
          <div
            className="p-4 text-[#9A9CAE] text-[13.975px] font-medium cursor-pointer hover:text-white flex justify-between items-center"
            onClick={toggleBookingDropdown}>
            Booking Management
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
            <ul className="bg-neutral-900 text-[#9A9CAE] mt-1 text-[13.975px] font-medium transform transition-transform duration-500">
              <li className="p-4 cursor-pointer hover:text-white">
                <Link to="/layout/service-info">Booking Listing</Link>
              </li>
              <li className="p-4 cursor-pointer hover:text-white">
                <Link to="/layout/booking-product">Booking Product</Link>
              </li>
            </ul>
          )}
        </li>
        <li className="p-4 text-[#9A9CAE] text-[13.975px] font-medium cursor-pointer hover:text-white">
          <Link to="/layout/order-management">Order management</Link>
        </li>
        <li className="p-4 text-[#9A9CAE] text-[13.975px] font-medium cursor-pointer hover:text-white">
          <Link to="/layout/transaction">Transaction</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
