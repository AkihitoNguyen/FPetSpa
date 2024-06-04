// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

=======
import { Link } from 'react-router-dom'
// import {useDispatch} from "react-redux"
import { useSelector } from 'react-redux'
// import { logOut } from '../../redux/apiRequest'
>>>>>>> abfc65b35d26ddc59245c52a27bffd53b0dd3d47
const Navbar = () => {

  const navigate = useNavigate();
  // const dispath = useDispatch();
  // const accessToken = user?.accessToken;
  // const id = user?.id;
  const [menu, setMenu] = useState("menu");
  const user = useSelector((state)=>state.auth.login.currentUser);
  // const handleLogout = () =>{
  //   logOut(dispath,id,accessToken);
  // }

  return (
    <div className='navbar'>
      <img onClick={() => { navigate("/") }} src={assets.logo} alt="" className="logo" />
      <ul className="navbar-menu">
<<<<<<< HEAD
        <li onClick={() => { navigate("/"); setMenu("home") }}
          className={menu === "home" ? "active" : ""}>Home</li>

        <li onClick={() => { navigate("/about-us"); setMenu("about-us") }}
          className={menu === "about-us" ? "active" : ""}>About us</li>

        <li onClick={() => { navigate("/service"); setMenu("service") }}
          className={menu === "service" ? "active" : ""}>Service</li>

        <li onClick={() => { navigate("/"); setMenu("product") }}
          className={menu === "product" ? "active" : ""}>Product</li>

        <li onClick={() => { navigate("/contact-us"); setMenu("blog") }}
          className={menu === "contact-us" ? "active" : ""}>Contact us</li>
=======
        <li onClick={() => { navigate("/"); setMenu("home") }} className={menu === "home" ? "active" : ""}>home</li>
        <li onClick={() => { navigate("/"); setMenu("about-us") }} className={menu === "about-us" ? "active" : ""}>about us</li>

        <li onClick={() => { navigate("/service"); setMenu("service") }} className={menu === "service" ? "active" : ""}>service</li>
        <li onClick={() => { navigate("/"); setMenu("product") }} className={menu === "product" ? "active" : ""}>product</li>

        <li onClick={() => { navigate("/"); setMenu("blog") }} className={menu === "blog" ? "active" : ""}>blog</li>
>>>>>>> abfc65b35d26ddc59245c52a27bffd53b0dd3d47
      </ul>
      <div className="navbar-right">
        <img src={assets.search} alt="" className='search' />

        <div className="navbar-search-icon">
          <img onClick={() => { navigate("/cart") }} src={assets.cart} alt="" className='cart' />
          <div className="dot"></div>
        </div>
<<<<<<< HEAD


        <button onClick={() => {
          navigate("/login");
        }}>sign in</button>
=======
        {user ? (
          <>
          <p className='navbar-user'>Hi,<span>{user.name}</span></p>
          <Link to='/logout' className='navbar-logout'>Log out</Link>
          </>
        ):(
          <Link to='/login'>Login</Link>
        )}
        
>>>>>>> abfc65b35d26ddc59245c52a27bffd53b0dd3d47
      </div>
      {/* --------------------------------------- */}


    </div>

  )
}

export default Navbar