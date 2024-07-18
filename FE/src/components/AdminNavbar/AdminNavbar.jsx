import React, { useState } from "react";
import { HiOutlineBell, HiOutlineChatAlt, HiOutlineSearch } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/apiRequest";
import { createAxiosInstance } from "../../createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  const userId = user?._userId;
  let axiosJWT = createAxiosInstance(user, dispatch, logoutSuccess);

  const handleLogout = () => {
    logoutUser(accessToken, userId, dispatch, navigate, axiosJWT)
      .then(() => {
        toast.success("Logout successful!");
      })
      .catch((error) => {
        toast.error("Logout failed. Please try again.");
        console.error("Logout error:", error);
      });
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200">
      <div className="relative">
        <HiOutlineSearch
          fontSize={20}
          className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
        />
        <input
          type="text"
          placeholder="Search..."
          className="text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 rounded-sm pl-11 px-[20px]"
        />
      </div>
      <div className="flex items-center ml-[35rem] gap-2 mr-2 relative">
        <HiOutlineChatAlt fontSize={24} />
        <HiOutlineBell fontSize={24} />
        {user ? (
          <div className="relative">
            <div>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 focus:outline-none"
              >
                <span className="text-sm font-semibold">{user.fullName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition duration-300 ease-in-out ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out
                    onClick={closeDropdown}`}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Link to="/login" className="text-sm font-semibold mr-4">Login</Link>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

const MenuItem = ({ link, text, onClose }) => {
  return (
    <div className="py-1">
      <Link
        to={link}
        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out"
        onClick={onClose}
      >
        {text}
      </Link>
    </div>
  );
};

export default AdminNavbar;
