import { useState } from "react";
import "../Navbar/Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import { createAxiosInstance } from "../../createInstance";
import { logoutSuccess } from "../../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  let axiosJWT = createAxiosInstance(user, dispatch, logoutSuccess);

  const [menu, setMenu] = useState("menu");

  const handleLogout = () => {
    logoutUser(accessToken, id, dispatch, navigate, axiosJWT);
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
          <img src={assets.cart} alt="" className="cart" />
          <div className="dot"></div>
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
    </div>
  );
};

export default Navbar;
