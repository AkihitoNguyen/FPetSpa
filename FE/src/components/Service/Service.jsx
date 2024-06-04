// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import './Service.css'
import { getAllServices } from '../../api/apiService.js'
import { assets } from '../../assets/assets';


const Service = () => {

  // const [serviceList, setServiceList] = useState([]);

  // useEffect(() => {
  //   fetchServices();
  // }, []);

  // const fetchServices = async () => {
  //   try {
  //     const response = await getAllServices();
  //     setServiceList(response);
  //   } catch (error) {
  //     console.error("Error", error);
  //   }
  // };

  return (
    <div className='service' id='service'>
      <h1>Our <span>Service</span></h1>
      <p>We offer high-class care services and activities for your pets. No matter what accommodation type you choose, your pet will always receive premium meals, daily exercise and play time and constant care from our professional trained team of pet welfare staff.</p>
      <div className="service-list">
<<<<<<< HEAD
          <div className="service-list-items">
              <img src={assets.happy} alt="" />
              <h2>Dog Grooming</h2>
              <p>All breeds and sizes welcome, specialising in an
                <br /> express service because sometimes you want
                <br /> a clean fur baby without the extra fuss.</p>
                <button>View More</button>
          </div>
          <div className="service-list-items-1">
              <img src={assets.cat_happy} alt="" />
              <h2>Cat Grooming</h2>
              <p>We look after all pets and can do a quick visit
                <br /> where we will feed and water your pets, give
                <br /> them a quick cuddle and a smooch.</p>
                <button>View More</button>
          </div>
          <div className="service-list-items-2">
              <img src={assets.scissor} alt="" />
              <h2>Matts and Knots</h2>
              <p>Are you too busy to take the fur kids out
                 <br />everyday? We can help. Dogs get bored just like
                  <br />we do and need a change of scenery.</p>
                  <button>View More</button>
          </div>
=======
{serviceList && serviceList.length > 0 &&
        serviceList.map((item, index) => {
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
>>>>>>> abfc65b35d26ddc59245c52a27bffd53b0dd3d47

      </div>

    </div>
  )
}

export default Service