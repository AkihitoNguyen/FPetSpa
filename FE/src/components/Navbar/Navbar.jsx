// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import { createAxiosInstance } from "../../createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { ShopContext } from "../../components/Context/ShopContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { assets } from "../../assets/assets";
import "../Navbar/Navbar.css";


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userId = user?._userId;
  const accessToken = user?.accessToken;
  let axiosJWT = createAxiosInstance(user, dispatch, logoutSuccess);
  const { getTotalCartItems } = useContext(ShopContext) || {
    getTotalCartItems: () => 0,
  };

  const [anchorEl, setAnchorEl] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl("");
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
    <div className="navbar">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="logo"
      />
      <ul className="navbar-menu">
        <li onClick={() => navigate("/service")}>Service</li>
        <li onClick={() => navigate("/product")}>Product</li>
        <li onClick={() => navigate("/cart")}>About us</li>
        <li onClick={() => navigate("/contact-us")}>Contact us</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search} alt="" className="search" />
        {user ? (
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}>
              <Stack direction="row" spacing={2}>
                <Avatar {...stringAvatar(user.fullName)} />
                {/* <Avatar {...stringAvatar(user.id)} /> */}
              </Stack>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}>
              <MenuItem onClick={handleClose}>
                <Link to="/profile">Profile</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/booking-history">Booking history</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  to="/logout"
                  className="navbar-logout"
                  onClick={handleLogout}>
                  Logout
                </Link>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Link to="/login" className="navbar-login">
              <img src={assets.user} alt="" className="user" />
              <button onClick={() => navigate("/login")}>Login</button>
            </Link>
          </div>
        )}

        <div className="navbar-cart-icon">
          <Link to="/cart">
            <img src={assets.cart} alt="" className="cart" />
            <div className="nav-cart-count">{getTotalCartItems()}</div>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
