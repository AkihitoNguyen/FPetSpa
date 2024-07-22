import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import { createAxiosInstance } from "../../createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { ShopContext } from "../../components/Context/ShopContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
 
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [showBanner,setShowBanner] = useState(false);

  const toggleAvatarDropdown = () => {
    setShowAvatarDropdown(!showAvatarDropdown);
  };

  const toggleShowBanner = () => {
    setShowBanner(!showBanner);
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
    
      <div className="sticky top-0 z-10 flex items-center justify-between p-[12px] bg-white shadow-md ">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="w-14 cursor-pointer"
      />
      <div className="hidden md:flex justify-center items-center flex-grow">
        <div className="max-w-3xl w-full">
          <ul className="flex justify-center gap-10 m-0 text-gray-900 font-normal">
            <li
              onClick={() => navigate("/service")}
              className="cursor-pointer text-[#262626] text-[16px] hover:text-[#FC819E]"
            >
              Service
            </li>
            <li
              onClick={() => navigate("/product")}
              className="cursor-pointer text-[#262626] text-[16px] hover:text-[#FC819E]"
            >
              Product
            </li>
            <li
              onClick={() => navigate("/about-us")}
              className="cursor-pointer text-[#262626] text-[16px] hover:text-[#FC819E]"
            >
              About us
            </li>
            <li
              onClick={() => navigate("/contact-us")}
              className="cursor-pointer text-[#262626] text-[16px] hover:text-[#FC819E]"
            >
              Contact us
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <SearchProduct onResultSelect={(result) => console.log(result)} />
        </div>
        {user ? (
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleAvatarDropdown(!showAvatarDropdown)}
            >
              <div className="w-10 h-10 rounded-full bg-[#FC819E] flex items-center justify-center">
                <span className="text-white">{stringAvatar(user.fullName).children}</span>
              </div>
            </div>
            {showAvatarDropdown && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => toggleAvatarDropdown(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/booking-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => toggleAvatarDropdown(false)}
                  >
                    Booking history
                  </Link>
                  {role === "Admin" && (
                    navigate("/layout/dashboards"),
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => toggleAvatarDropdown(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleAvatarDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="flex gap-2">
              <img src={assets.user} alt="" className="w-6" />
              <button className="text-[16px] text-[#FC819E] font-semibold border-1 border-[#FC819E] rounded-xl px-4 py-1 transition duration-300  hover:bg-[#FC819E] hover:text-white" onClick={() => navigate("/login")}>Login</button>
            </Link>
          </div>
        )}
        <div className="relative">
          <Link to="/cart" className="relative">
            <img src={assets.cart} alt="" className="w-6" />
            <div className="absolute -right-4 -top-2 w-6 h-5 flex items-center justify-center text-sm bg-[#FC819E] text-white rounded-full">{getTotalCartItems()}</div>
          </Link>
        </div>
      </div>
      <div className="md:hidden flex items-center">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={() => toggleShowBanner(!showBanner)}
          >
            <span className="text-gray-700">☰</span>
          </div>
          {showBanner && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Link
                  to="/service"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => toggleShowBanner(false)}
                >
                  Service
                </Link>
                <Link
                  to="/product"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => toggleShowBanner(false)}
                >
                  Product
                </Link>
                <Link
                  to="/about-us"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => toggleShowBanner(false)}
                >
                  About us
                </Link>
                <Link
                  to="/contact-us"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => toggleShowBanner(false)}
                >
                  Contact us
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
   
    
  );
};

export default Navbar;
