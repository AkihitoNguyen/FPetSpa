import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();
  const [menu, setMenu] = useState("menu");



  return (
    <div className='navbar'>
      <img onClick={() => { navigate("/") }} src={assets.logo} alt="" className="logo" />
      <ul className="navbar-menu">
        <li onClick={() => { navigate("/"); setMenu("home") }} className={menu === "home" ? "active" : ""}>home</li>
        <li onClick={() => { navigate("/"); setMenu("about-us") }} className={menu === "about-us" ? "active" : ""}>about us</li>
        <li onClick={() => { navigate("/service"); setMenu("service") }} className={menu === "service" ? "active" : ""}>service</li>
        <li onClick={() => { navigate("/"); setMenu("product") }} className={menu === "product" ? "active" : ""}>product</li>
        <li onClick={() => { navigate("/"); setMenu("blog") }} className={menu === "blog" ? "active" : ""}>blog</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search} alt="" className='search' />
        <div className="navbar-search-icon">
          <img onClick={() =>{ navigate("/cart")}} src={assets.cart} alt="" className='cart' />
          <div className="dot"></div>
        </div>
        <button onClick={() => {
          navigate("/login");
        }}>sign in</button>
      </div>
      {/* --------------------------------------- */}

          
    </div>

  )
}

export default Navbar