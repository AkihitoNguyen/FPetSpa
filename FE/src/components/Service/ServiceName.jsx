import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://localhost:7055/api";

const ServiceName = () => {
  const [services, setServices] = useState([]);
  
  useEffect(() => {
    // Fetch services data when the component mounts
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services/search`);
        console.log("Fetched services:", response.data); // Log the fetched data
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="max-w-[965px] mx-auto my-[55px] font-light">
      <div className="max-w-[954px] py-0 px-[15px] m-auto w-full bg-[#f5f5f7] lg:max-w-[1024px] md:max-w-[768px] sm:max-w-[640px]">
        <div>
          <div className="flex items-end justify-between md:pb-[20px]">
            <div>
              <div className="pl-[15px] text-[26px] font-bold uppercase text-[#FC819E]">
                Our service
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mx-[10px]">
          {services.map((service) => (
            <div key={service.serviceId} className="flex flex-col overflow-auto rounded-xl border-none cursor-pointer shadow-xl bg-[#fff]">
              <a href={`/service/${service.serviceId}`}>
                <div className="relative overflow-hidden rounded-[4px]">
                  <img
                    src={service.pictureServices} // Assuming pictureUrl is part of the response
                    alt={service.serviceName}
                    className="w-full h-[200px] object-cover"
                  />
                </div>
                <div className="w-full py-2 px-4">
                  <div className="font-bold text-base leading-5 text-center overflow-hidden line-clamp-3 mb-1 text-[#FC819E]">
                    {service.serviceName}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceName;
