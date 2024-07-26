import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

const SecondForm = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(true); // State cho loading
  const navigate = useNavigate();

  // State lưu trữ dịch vụ đã được thêm
  const [addedServices, setAddedServices] = useState([]);

  // Hàm xử lý khi bấm chuyển hướng đến trang "/booking"
  const handleClick = () => {
    // Lưu danh sách dịch vụ đã chọn vào localStorage
    localStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    
    // Lưu chỉ các serviceId vào localStorage
    const selectedServiceIds = selectedServices.map(service => service.servicesId);
    localStorage.setItem("selectedServiceIds", JSON.stringify(selectedServiceIds));

    navigate("/booking");
  };

  // Hàm xử lý khi bấm "Add" để thêm hoặc xóa dịch vụ khỏi danh sách đã chọn
  const handleAddService = (item) => {
    let updatedServices;
    if (addedServices.includes(item.servicesId)) {
      updatedServices = selectedServices.filter(service => service.servicesId !== item.servicesId);
      setTotalCost(totalCost - item.price);
      setAddedServices(addedServices.filter(servicesId => servicesId !== item.servicesId));
    } else {
      updatedServices = [...selectedServices, item];
      setTotalCost(totalCost + item.price);
      setAddedServices([...addedServices, item.servicesId]);
    }
    setSelectedServices(updatedServices);
    
    // Cập nhật localStorage với danh sách các dịch vụ đã chọn
    const selectedServiceIds = updatedServices.map(service => service.servicesId);
    localStorage.setItem("selectedServiceIds", JSON.stringify(selectedServiceIds));
    
    // Cập nhật localStorage với danh sách dịch vụ đã chọn
    localStorage.setItem("selectedServices", JSON.stringify(updatedServices));
  };

  // Sử dụng useEffect để fetch danh sách dịch vụ từ API khi component mount
  useEffect(() => {
    // Fetch các dịch vụ từ API
    fetch("https://localhost:7055/api/services/search")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);

        // Lấy danh sách các servicesId từ localStorage và tìm các dịch vụ đã chọn
        const savedServiceIds = JSON.parse(localStorage.getItem("selectedServiceIds")) || [];
        const savedServices = data.filter(service => savedServiceIds.includes(service.servicesId));
        
        setSelectedServices(savedServices);
        setAddedServices(savedServiceIds);
        setTotalCost(savedServices.reduce((total, service) => total + service.price, 0));
        
        setLoading(false); // Dừng loading khi fetch thành công
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false); // Dừng loading nếu có lỗi
      });
  }, []);

  return (
    <>
      {loading ? ( // Hiển thị loading khi đang fetch dữ liệu
        <Loading />
      ) : (
        <div className="flex flex-col justify-center items-center px-[10px] py-[12px] bg-[#EEEEEE]">
          {/* Header */}
          <div className="flex items-center justify-between py-3 px-2.5 pointer gap-56" onClick={handleClick}>
            <img
              src="https://30shine.com/static/media/icon_arrow_left_blue.000f72bd.svg"
              alt="/first-form"
              role="presentation"
              className="cursor-pointer"
            />
            <span className="text-center text-[#FC819E] font-semibold">Services</span>
            <div className="flex gap-1"></div>
          </div>

          {/* Main Content */}
          <div className="bg-white mb-[15px]">
            <div className="p-2.5 pt-[15px]">
              {/* Service List */}
              <div className="text-[#FC819E] flex flex-wrap items-baseline gap-y-2.5 pb-2.5">
                <div className="text-[14px] font-semibold pr-2.5">Trimming, Grooming, Spa</div>
              </div>
              <div className="grid gap-4 grid-cols-2">
                {services.map((item) => (
                  <div
                    className="h-full flex flex-col gap-1.5 rounded-[10px] overflow-hidden pb-[14px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)]"
                    key={item.servicesId}
                  >
                    <div role="presentation" className="relative border">
                      <img src={item.pictureServices} alt="Grooming" className="w-64" />
                    </div>
                    <div className="flex items-baseline justify-between gap-x-[3px] px-[5px]" role="presentation">
                      <div className="text-[#FC819E] font-semibold line-clamp-2 pr-2 md:pr-4 text-sm">
                        {item.serviceName}
                      </div>
                    </div>
                    <div className="text-[#5F5F5F] text-[12px] line-clamp-3 min-h-[48[x] px-[5px]" role="presentation">
                      {item.description}
                    </div>
                    {/* price */}
                    <div className="px-[5px] flex gap-[5px]">
                      <div className="flex-1 flex flex-col relative rounded-[5px] py-1 cursor-pointer lg:hover:bg-[#F0F8FF]" aria-hidden="true">
                        <div className="px-2 lg:px-3 text-[#FC819E] text-[10px] lg:text-[12px] font-semibold text-center line-clamp-1">
                          Standard
                        </div>
                        <div className="mt-auto text-sm font-semibold text-[#3D3D3D] text-center">${item.price}</div>
                      </div>
                    </div>
                    {/* button */}
                    <div
                      className={`mx-[5px] h-[37.6px] cursor-pointer flex items-center justify-center border border-[#FC819E] rounded-[5px] transition-all py-2 px-4 text-sm font-semibold ${
                        addedServices.includes(item.servicesId)
                          ? "bg-[#D3D3D3] text-[#FFFFFF] cursor-not-allowed"
                          : "bg-[#FC819E] text-white lg:hover:bg-[#F0F8FF] lg:hover:text-[#15397F]"
                      }`}
                      onClick={() => handleAddService(item)}
                      role="presentation"
                    >
                      {addedServices.includes(item.servicesId) ? "Added" : "Add"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer - Selected Services and Total Cost */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[560px] flex items-center justify-between px-4 pt-3 bg-white pb-3">
            <div className="underline text-[#FC819E] text-sm cursor-pointer" role="presentation">
              Selected {selectedServices.length} service
            </div>
            <div className="text-right text-sm pr-2.5 ml-[232.663px]">
              Cost
              <div className="flex items-center justify-end gap-1">
                <div className="text-[18px] font-semibold text-right">${totalCost}</div>
              </div>
            </div>
            <div
              className="text-[16px] font-semibold py-[13px] px-[18px] rounded-[5px] bg-[#FC819E] text-white hover:bg-[#F0F8FF] hover:text-[#FC819E] cursor-pointer"
              onClick={handleClick} // Chuyển hướng khi bấm "Done"
              role="presentation"
            >
              <span>Done</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecondForm;
