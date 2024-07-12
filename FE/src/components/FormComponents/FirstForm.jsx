import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const FirstForm = ({ formValues, onChange, services, userPets }) => {
  const today = dayjs().format("YYYY-MM-DD"); // Ngày hiện tại dùng cho min của input date
  const currentTime = dayjs().format("HH:mm:ss"); // Thời gian hiện tại dùng để disable các khung giờ trong quá khứ

  // State để lưu trữ số slot còn lại
  const [remainingSlots, setRemainingSlots] = useState([]);

  // Hàm sinh danh sách các khung giờ từ 08:00 đến 19:00 cách nhau 30 phút
  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = dayjs().hour(8).minute(0).second(0);
    const endTime = dayjs().hour(19).minute(0).second(0);

    while (currentTime.isBefore(endTime)) {
      slots.push(currentTime.format("HH:mm:ss"));
      currentTime = currentTime.add(60, "minute");
    }

    return slots;
  };

  // Hàm gọi API để lấy dữ liệu booking
  const fetchBookings = async () => {
    try {
      const response = await fetch(
        "https://fpetspa.azurewebsites.net/api/Order/GetAllOrderService"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const bookings = await response.json();
      return bookings;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  };

  // Hàm tính toán số slot còn lại dựa trên dữ liệu từ API
  const calculateRemainingSlots = async () => {
    try {
      const bookings = await fetchBookings();

      const remaining = generateTimeSlots().map((timeSlot) => {
        // Tính tổng số lượng đã đặt cho từng khung giờ
        const bookedCount = bookings
          .filter(
            (booking) =>
              booking.bookingDate === formValues.date &&
              booking.timeSlot === timeSlot
          )
          .reduce((total, booking) => total + booking.quantity, 0);

        const remainingSlots = 10 - bookedCount; // Giả sử mỗi khung giờ có tối đa 10 slot

        return { timeSlot, remaining: remainingSlots };
      });

      setRemainingSlots(remaining);
    } catch (error) {
      console.error("Error calculating remaining slots:", error);
    }
  };

  // Sử dụng useEffect để tính toán số slot còn lại khi ngày hoặc khung giờ thay đổi
  useEffect(() => {
    calculateRemainingSlots();
  }, [formValues.date, formValues.timeSlot]);

  // Xử lý sự kiện thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra ngày không được trong quá khứ
    if (name === "date" && value < today) {
      alert("Ngày không thể là ngày trong quá khứ!");
      return;
    }

    // Kiểm tra khung giờ không được trong quá khứ nếu ngày là hôm nay
    if (name === "timeSlot" && formValues.date === today && value < currentTime) {
      alert("Khung giờ không thể trong quá khứ!");
      return;
    }

    // Truyền sự kiện thay đổi lên component cha (nếu cần)
    onChange(e);
  };

  return (
    <div className="">
      {/* Phần thông tin thú cưng */}
      <div className="mx-auto max-w-2xl text-center mt-5">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-xl">
          Đặt dịch vụ
        </h3>
      </div>
      <div className="mx-auto mt-2 max-w-xl sm:mt-5">
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* Chọn thú cưng */}
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

          {/* Chọn ngày */}
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

          {/* Chọn khung giờ */}
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
                {remainingSlots.map((slot) => (
                  <option
                    key={slot.timeSlot}
                    value={slot.timeSlot}
                    disabled={formValues.date === today && slot.timeSlot < currentTime}
                  >
                    {`${slot.timeSlot} (${slot.remaining} slots left)`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chọn dịch vụ */}
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
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chọn phương thức thanh toán */}
          <div className="sm:col-span-2 mt-4">
            <label
              htmlFor="payment-method"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Phương thức thanh toán
            </label>
            <div className="mt-2.5">
              <select
                className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="payment-method"
                name="paymentMethod"
                onChange={handleInputChange}
                value={formValues.paymentMethod}
              >
                <option value="">Chọn phương thức thanh toán</option>
                <option value="VNPay">VNPay</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstForm;
