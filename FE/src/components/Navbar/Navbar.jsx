import { useState,useContext } from "react";
import "../Navbar/Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import { createAxiosInstance } from "../../createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { ShopContext } from "../Context/ShopContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  let axiosJWT = createAxiosInstance(user, dispatch, logoutSuccess);
  const { getTotalCartItems } = useContext(ShopContext);


  const handleLogout = () => {
    logoutUser(accessToken, id, dispatch, navigate, axiosJWT)
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

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="logo"
      />
      <ul className="navbar-menu">
        <li
          onClick={() => {
            navigate("/service");
          }}>
          Service
        </li>
        <li
          onClick={() => {
            navigate("/product");
          }}>
          Product
        </li>
        <li
          onClick={() => {
            navigate("/about-us");
          }}>
          About us
        </li>
        <li
          onClick={() => {
            navigate("/contact-us");
          }}>
          Contact us
        </li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search} alt="" className="search" />

        {user ? (
          <div>
            <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
       <Stack direction="row" spacing={2}>
             <Avatar {...stringAvatar(user.fullName)} />
            </Stack>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}><Link to="/logout" className="navbar-logout" onClick={handleLogout}>
              Logout
            </Link></MenuItem>
      </Menu>
          </div>
        ) : (
          <div className="">

            <Link to="/login" className="navbar-login">
              <img src={assets.user} alt="" className="user" />
              <button onClick={() => navigate("/login")}>Login</button>
            </Link>
          </div>
        )}
        <div className="navbar-search-icon">
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
