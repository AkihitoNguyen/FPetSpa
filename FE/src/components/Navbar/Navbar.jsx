import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import { createAxiosInstance } from "../../createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { ShopContext } from "../../components/Context/ShopContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { assets } from "../../assets/assets";
import SearchProduct from "../../components/PageProduct/SearchProduct";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userId = user?._userId;
  const accessToken = user?.accessToken;
  const role = user?.role;
  let axiosJWT = createAxiosInstance(user, dispatch, logoutSuccess);
  const { getTotalCartItems } = useContext(ShopContext) || {
    getTotalCartItems: () => 0,
  };

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

  function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name) {
    if (!name || typeof name !== "string") {
      return {
        sx: {
          bgcolor: "#000000",
        },
        children: "",
      };
    }

    const nameParts = name.split(" ");
    if (nameParts.length < 2) {
      return {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: name.charAt(0),
      };
    }

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${nameParts[0][0]}${nameParts[1][0]}`,
    };
  }

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="w-16 cursor-pointer"
      />
      <div className="hidden md:flex flex-grow justify-center">
        <ul className="flex text-3xl  gap-6 text-gray-900 font-medium">
          <li onClick={() => navigate("/service")} className="cursor-pointer">Service</li>
          <li onClick={() => navigate("/product")} className="cursor-pointer">Product</li>
          <li onClick={() => navigate("/about-us")} className="cursor-pointer">About us</li>
          <li onClick={() => navigate("/contact-us")} className="cursor-pointer">Contact us</li>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <SearchProduct onResultSelect={(result) => console.log(result)} />
        </div>
        {user ? (
          <Menu as="div" className="relative">
            <Menu.Button>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white">{stringAvatar(user.fullName).children}</span>
                </div>
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex justify-between w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/booking-history"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex justify-between w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        Booking history
                      </Link>
                    )}
                  </Menu.Item>
                  {role === "Staff" && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex justify-between w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex justify-between w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="flex gap-2">
              <img src={assets.user} alt="" className="w-6" />
              <button className="text-sm font-medium transition duration-300" onClick={() => navigate("/login")}>Login</button>
            </Link>
          </div>
        )}
        <div className="relative">
          <Link to="/cart" className="relative">
            <img src={assets.cart} alt="" className="w-6" />
            <div className="absolute -right-4 -top-2 w-6 h-5 flex items-center justify-center text-sm bg-black text-white rounded-full">{getTotalCartItems()}</div>
          </Link>
        </div>
      </div>
      <div className="md:hidden flex items-center">
        <Menu as="div" className="relative">
          <Menu.Button>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-700">☰</span>
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/service"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex justify-between w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      Service
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/product"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex justify-between w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      Product
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/about-us"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex justify-between w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      About us
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/contact-us"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex justify-between w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      Contact us
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
