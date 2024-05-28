import React, { useEffect, useState } from 'react'
import './Service.css'
import { getAllServices } from '../../api/apiService.js'
import { assets } from '../../assets/assets';


const Service = () => {

  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getAllServices();
      setServiceList(response);
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div className='service' id='service'>
      <h1>Our <span>Service</span></h1>
      <div className="service-list">

        {serviceList.map((item, index) => {
          return (
            <div key={item.serviceId} className="service-list-item">
              <div className='service-img'>
              <img src={assets.food_3} alt="" />
              </div>
            
                <div className='name'>
                <h3>{item.serviceName}</h3>
                </div>
                <p className='price'>${item.price}</p>
                
              </div>

          )

        })}

      </div>

    </div>
  )
}

export default Service