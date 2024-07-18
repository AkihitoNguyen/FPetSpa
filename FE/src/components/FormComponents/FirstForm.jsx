import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { assets } from "../../assets/assets";
import axios from "axios"; // Import axios for API calls

const FirstForm = ({ formValues, onChange, services, userPets }) => {
  const today = dayjs().format("YYYY-MM-DD"); // Sử dụng định dạng ISO để so sánh
  const currentTime = dayjs().format("HH:mm:ss");
  const [bookingTimes, setBookingTimes] = useState([]);

  useEffect(() => {
    // Function to fetch booking times from API
    const fetchBookingTimes = async () => {
      try {
        const response = await axios.get(
          "https://fpetspa.azurewebsites.net/api/BookingTime/GetAllBookingTime"
        );
        setBookingTimes(response.data); // Lưu danh sách khung giờ từ API vào state
      } catch (error) {
        console.error("Error fetching booking times:", error);
      }
    };

    fetchBookingTimes(); // Gọi hàm fetch khi component được render
  }, []); // Dependency array rỗng để gọi API chỉ một lần khi component mount

  // Function to generate time slots
  const generateTimeSlots = () => {
    const slots = ["Chọn khung giờ"];
    
    bookingTimes.forEach((time) => {
      slots.push(time.time); // Thêm các khung giờ từ API vào danh sách slots
    });

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Enhanced onChange handler with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the date is today
    if (name === "date" && value < today) {
      alert("Ngày không thể là ngày trong quá khứ!");
      return;
    }

    // Check if the time slot is in the past for today's date
    if (name === "timeSlot" && formValues.date === today && value < currentTime) {
      alert("Khung giờ không thể trong quá khứ!");
      return;
    }

    // If valid, propagate the change
    onChange(e);
  };

  return (
    <div className="">
      {/* Pet Information */}
      <div className="mx-auto max-w-2xl text-center mt-5">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-xl">
          Booking Service
        </h3>
      </div>
      <div className="mx-auto mt-2 max-w-xl sm:mt-5">
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* Select Pet */}
          <div className="">
            <label
              htmlFor="pet-id"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Chọn thú cưng
            </label>
            <div className="mt-2.5">
              <select
                name="petId"
                id="pet-id"
                onChange={handleInputChange}
                value={formValues.petId}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Chọn thú cưng</option>
                {userPets.map((pet) => (
                  <option key={pet.petId} value={pet.petId}>
                    {pet.petName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="">
            <label
              htmlFor="date"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Ngày
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="date"
                id="date"
                name="date"
                onChange={handleInputChange}
                value={formValues.date}
                min={today}
              />
            </div>
          </div>

          {/* Time Slot */}
          <div className="">
            <label
              htmlFor="time-slot"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Chọn khung giờ
            </label>
            <div className="mt-2.5">
              <select
                name="timeSlot"
                id="time-slot"
                onChange={handleInputChange}
                value={formValues.timeSlot}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {timeSlots.map((timeSlot) => (
                  <option
                    key={timeSlot}
                    value={timeSlot}
                    disabled={formValues.date === today && timeSlot < currentTime}
                  >
                    {timeSlot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Type */}
          <div className="sm:col-span-2 mt-4">
            <label
              htmlFor="serviceId"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Chọn dịch vụ
            </label>
            <div className="mt-2.5">
              <select
                name="serviceId"
                id="serviceId"
                onChange={handleInputChange}
                value={formValues.serviceId}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Chọn dịch vụ</option>
                {services.map((service) => (
                  <option key={service.servicesId} value={service.servicesId}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="sm:col-span-2 mt-4">
            <label
              htmlFor="payment-method"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Phương thức thanh toán
            </label>
            <div className="mt-2.5 flex items-center">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  name="paymentMethod"
                  value="VNPay"
                  onChange={handleInputChange}
                  checked={formValues.paymentMethod === "VNPay"}
                />
                <img src={assets.Icon_VNPAY_QR1} alt="VNPay Logo" className="h-8 ml-2" />
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  name="paymentMethod"
                  value="PayPal"
                  onChange={handleInputChange}
                  checked={formValues.paymentMethod === "PayPal"}
                />
                <img src={assets.paypal_logo1} alt="PayPal Logo" className="h-8 ml-2" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstForm;
