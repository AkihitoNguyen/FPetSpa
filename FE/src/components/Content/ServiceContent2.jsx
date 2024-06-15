import axios from "axios";
import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";

const ServiceContent2 = () => {
  const [service, setService] = useState([]);

  useEffect(() => {
    axios
      .get("https://fpetspa.azurewebsites.net/api/services")
      .then((res) => {
        setService(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="flex flex-col mx-auto">
      <div>
        <h2 className="text-[42px] font-bold text-center">Our Services</h2>
      </div>
      <div>
        <div className="flex justify-center items-center gap-20 text-[18px] text-center font-medium ">
          {service.map((item) => (
            <div className="" key={item.serviceId}>
                <img src={assets.Soapy} alt="" />
                <p className="">{item.serviceName}</p>
                <p className="">${item.price}</p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default ServiceContent2;
