import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../Loading";

const ServiceContent2 = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.login?.currentUser);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://localhost:7055/api/services/Search")
      .then((response) => {
        setServices(response.data);
        setIsLoading(false); // Dừng hiển thị loaders khi dữ liệu đã tải xong
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setIsLoading(false); // Dừng hiển thị loaders ngay cả khi có lỗi
      });
  }, []);

  const handleBookingClick = () => {
    if (isLoggedIn) {
      navigate("/booking");
    } else {
      alert("Please log in to book a service.");
      navigate("/login", { state: { returnTo: "/service" } });
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-5xl mb-10">
      <h2 className="text-4xl font-bold text-center mb-8">
        Pet Trimming and Cleaning Services
      </h2>
      {isLoading ? (
        <Loading/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={item.pictureServices}
                alt={item.serviceName}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-[19px] font-bold mb-4">
                  {item.serviceName}
                </h3>
                <div className="flex items-center mb-4">
                  <span className="text-gray-600 font-semibold mr-2">
                    Price:
                  </span>
                  <span className="text-red-600">${item.price}</span>
                </div>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <div className="flex justify-end">
                  <button
                    onClick={handleBookingClick}
                    className="border rounded-full bg-black text-white py-2.5 px-8"
                  >
                    Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceContent2;
