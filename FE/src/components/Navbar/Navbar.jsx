import { useState, useContext } from "react";
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
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  let axiosJWT = createAxiosInstance(user, dispatch, logoutSuccess);
  const { getTotalCartItems } = useContext(ShopContext);
  const [menu, setMenu] = useState("menu");

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
            <p className="navbar-user">
              Hi, <span>{user.fullName}</span>
            </p>
            <Link to="/logout" className="navbar-logout" onClick={handleLogout}>
              Log out
            </Link>
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
            {" "}
            <img src={assets.cart} alt="" className="cart" />
          </Link>
        </div>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
