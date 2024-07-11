import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'

const ServiceContent2 = () => {

  const [service, setService] = useState([]);

  useEffect(() =>{
    axios.get('https://fpetspa.azurewebsites.net/api/services')
      .then(res =>{
        setService(res.data); 
      })
      .catch(error =>{
        console.error(error);
      })
  }, []);

  return (
    <div className='mx-auto mt-20'>
      <div>
        <h2 className='text-[42px] font-bold text-center'>Our Services</h2>
      </div>
      <div>
          <ul className='flex justify-center items-center'>
          {service.map(item =>(
            <li key={item.serviceId}>{item.serviceName}</li>
          ))}
          </ul>
      </div>
    </div>
  )
}

export default ServiceContent2