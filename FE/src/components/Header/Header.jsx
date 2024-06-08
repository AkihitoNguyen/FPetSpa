import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'
import { Navigate, useNavigate } from 'react-router-dom'
const Header = () => {

  const navigate = useNavigate();

  return (
    <div className='header'>
      <div>
        <div className="header-contents">
          <h1>Your Pet Care</h1>
          <h2>Center</h2>
          <p>Lorem ipsum available, but the majority
            <br />have suffered alteration in some form.</p>

          <div className="items">
            <img src={assets.cat} alt="" className='cat-item-1' />
            <img src={assets.cat_2} alt="" className='cat-item-2' />
            <img src={assets.cat_3} alt="" className='cat-item-3' />
          </div>



          <button>Show Now</button>

          <div className="item-list">
            <div className='contact'>
              <img src={assets.phone} alt="" className='phone' />
              <p onClick={() =>{navigate("/contact-us")}} className='call'>Schedule a Call</p>
            </div>

            <img src={assets.icon_1} alt="" className='prod-item-1' />
            <img src={assets.icon_2} alt="" className='prod-item-2' />
            <img src={assets.icon_3} alt="" className='prod-item-3' />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Header