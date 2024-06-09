// eslint-disable-next-line no-unused-vars
import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'
const Header = () => {
  return (
    <div className='header'>
      <div>
        <div className="header-contents">
          <h1>Your Pet Care</h1>
          <h2>Center</h2>
          <p>Lorem ipsum available, but the majority
            <br />have suffered alteration in some form.</p>

          <img src={assets.cat} alt="" className='cat-item-1' />
          <img src={assets.cat_2} alt="" className='cat-item-2' />
          <img src={assets.cat_3} alt="" className='cat-item-3' />



          <button>Show Now</button>

          <img src={assets.phone} alt="" className='phone' />
          <p className='call'>Schedule a Call</p>

          <img src={assets.icon_1} alt="" className='prod-item-1' />
          <img src={assets.icon_2} alt="" className='prod-item-2' />
          <img src={assets.icon_3} alt="" className='prod-item-3' />
        </div>
      </div>

    </div>
  )
}

export default Header