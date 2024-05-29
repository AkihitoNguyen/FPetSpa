// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
// import {useDispatch} from "react-redux"
import { useSelector } from 'react-redux'
// import { logOut } from '../../redux/apiRequest'
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
        <li onClick={() => { navigate("/"); setMenu("home") }} className={menu === "home" ? "active" : ""}>home</li>
        <li onClick={() => { navigate("/"); setMenu("about-us") }} className={menu === "about-us" ? "active" : ""}>about us</li>
        <li onClick={() => { navigate("/"); setMenu("service") }} className={menu === "service" ? "active" : ""}>service</li>
        <li onClick={() => { navigate("/product"); setMenu("product") }} className={menu === "product" ? "active" : ""}>product</li>
        <li onClick={() => { navigate("/"); setMenu("blog") }} className={menu === "blog" ? "active" : ""}>blog</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search} alt="" className='search' />
        <div className="navbar-search-icon">
          <img src={assets.cart} alt="" className='cart' />
          <div className="dot"></div>
        </div>
        {user ? (
          <>
          <p className='navbar-user'>Hi,<span>{user.name}</span></p>
          <Link to='/logout' className='navbar-logout' onClick={handleLogout}>Log out</Link>
          </>
        ):(
          <Link to='/login'>Login</Link>
        )}
        
      </div>
    </div>
  )
}

export default Navbar