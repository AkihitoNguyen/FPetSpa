import { useState,useContext } from "react";
import "../Navbar/Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import { createAxiosInstance } from "../../createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { ShopContext } from '../Context/ShopContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  let axiosJWT = createAxiosInstance(user, dispatch, logoutSuccess);
  const{getTotalCartItems} = useContext(ShopContext);
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
      <img onClick={() => navigate("/")} src={assets.logo} alt="" className="logo" />
      <ul className="navbar-menu">
        <li onClick={() => { navigate("/"); setMenu("home") }} className={menu === "home" ? "active" : ""}>home</li>
        <li onClick={() => { navigate("/"); setMenu("about-us") }} className={menu === "about-us" ? "active" : ""}>about us</li>
        <li onClick={() => { navigate("/"); setMenu("service") }} className={menu === "service" ? "active" : ""}>service</li>
        <li onClick={() => { navigate("/product"); setMenu("product") }} className={menu === "product" ? "active" : ""}>product</li>
        <li onClick={() => { navigate("/"); setMenu("blog") }} className={menu === "blog" ? "active" : ""}>blog</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search} alt="" className="search" />
        <div className="navbar-search-icon">
          <Link to='/cart'> <img src={assets.cart} alt=""  className="cart" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
        {user ? (
          <div>
            <p className="navbar-user">Hi, <span>{user.fullName}</span></p>
            <Link to="/logout" className="navbar-logout" onClick={handleLogout}>Log out</Link>
          </div>
        ) : (
          <div>
            <Link to="/login" className="navbar-login"><button onClick={() => navigate("/login")}>sign in</button></Link>
            
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
