import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ServiceContent2 = () => {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.login?.currentUser);

  const handleBookingClick = () => {
    if (isLoggedIn) {
      navigate("/booking");
    } else {
      alert("Please log in to book a service.");
      navigate("/login", { state: { returnTo: "/service" } });
    }
  };

  const services = [
    {
      serviceName: "Cắt móng - Mài móng",
      price: "50",
      description: "Dịch vụ cắt móng và mài móng cho thú cưng của bạn.",
      imageUrl:
        "https://top10tphcm.com/wp-content/uploads/2024/02/spa-cho-meo-binh-chanh.jpg",
    },
    {
      serviceName: "Cắt tỉa mặt",
      price: "50",
      description: "Dịch vụ cắt tỉa mặt cho thú cưng của bạn.",
      imageUrl:
        "https://dongphucnadi.com/wp-content/uploads/2023/12/cat-grooming-scaled-1.webp",
    },
    {
      serviceName: "Vệ sinh tai - Nhổ lông tai",
      price: "60",
      description: "Dịch vụ vệ sinh tai và nhổ lông tai cho thú cưng của bạn.",
      imageUrl:
        "https://btmpetshop.com/wp-content/uploads/2021/01/word-image-10.jpeg",
    },
    {
      serviceName: "Cạo vệ sinh: Bụng, Hậu môn - Lông bàn chân",
      price: "70",
      description: "Dịch vụ cạo vệ sinh bụng, hậu môn và lông bàn chân.",
      imageUrl:
        "https://go.yolo.vn/wp-content/uploads/2022/05/nen-cho-cho-meo-su-dung-dich-vu-spa-thu-cung.png",
    },
  ];

  return (
    <div className="mx-auto mt-20 max-w-5xl mb-10">
      <h2 className="text-4xl font-bold text-center mb-8">
        Pet Trimming and Cleaning Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {services.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.serviceName}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h3 className="text-[19px] font-bold mb-4">{item.serviceName}</h3>
              <div className="flex items-center mb-4">
                <span className="text-gray-600 font-semibold mr-2">Price:</span>
                <span className="text-red-600">${item.price}</span>
              </div>
              <p className="text-gray-700 mb-4">{item.description}</p>
              <div className="flex justify-end">
                <button
                  onClick={handleBookingClick}
                  className="border rounded-full bg-black text-white py-2.5 px-8">
                  Booking
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceContent2;
