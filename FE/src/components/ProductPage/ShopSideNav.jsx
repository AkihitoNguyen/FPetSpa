
// import { useNavigate } from 'react-router-dom'
// import { useState } from 'react'

import '../ProductPage/CSS/ShopSideNav.css'
import { NavLink } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { getAllProduct } from '../../api/apiService';
import { assets } from '../../assets/assets';




const ShopSideNav = () => {
    // const navigate = useNavigate();


    const [productList, setproductList] = useState([]);

    useEffect(() => {
      fetchproduct();
    }, []);
  
    const fetchproduct = async () => {
      try {
        const response = await getAllProduct();
        setproductList(response);
      } catch (error) {
        console.error("Error", error);
      }
    };

  return (
    <div className="product-banner ">
      
        <div className='product-slide'>
            <div className='title'>Searh Product</div>
            <div className='product-detail'>
            <NavLink to="/faq" activeClassName="selected">Dog Food</NavLink><br/>
            <NavLink to="/faq" activeClassName="selected">Cat Food</NavLink><br/>
            <NavLink to="/faq" activeClassName="selected">Toy</NavLink><br/>
            <NavLink to="/faq" activeClassName="selected">FAQs</NavLink><br/>
            </div>
        </div>
      
        <div className='product-list-main'>
          <div className='sort-product'>
            Sort product
          </div>
          <div className="group">
  <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
    <g>
      <path
        d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
      ></path>
    </g>
  </svg>
  <input className="input-search" type="search" placeholder="Search" />
</div>
          <div className="product-list">
{productList && productList.length > 0 && 
        productList.map((item, index) => {
          return (
            <div className="product-list-item" key={`table-user-${index}`}>
              <div className='product-img'>
              <img src={assets.food_4} alt="" />
              </div>
                <div className='name'>
                <h3>{item.productName}</h3>
                </div>
                <p className='price'>${item.price}</p>    
              </div>
          )
        })}
      </div>
        </div>
    </div>   
  )
}

export default ShopSideNav
