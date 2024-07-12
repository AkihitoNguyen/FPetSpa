// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import PropTypes from 'prop-types'

const FirstForm = ({ formValues, onChange, services, userPets }) => {
  const today = dayjs().format("YYYY-MM-DD"); // Use ISO format for comparison
  const currentTime = dayjs().format("HH:mm:ss");

  // Function to generate time slots
  const generateTimeSlots = () => {
    const slots = ["Chọn khung giờ"];
    let currentTime = dayjs().hour(8).minute(0).second(0);
    const endTime = dayjs().hour(19).minute(0).second(0);

    while (currentTime.isBefore(endTime)) {
      slots.push(currentTime.format("HH:mm:ss"));
      currentTime = currentTime.add(30, "minute");
    }

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
                  <option key={service.serviceId} value={service.serviceId}>
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

FirstForm.propTypes = {
  formValues: PropTypes.shape({
    petId: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    timeSlot: PropTypes.string.isRequired,
    serviceId: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  services: PropTypes.arrayOf(PropTypes.shape({
    serviceId: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
  })).isRequired,
  userPets: PropTypes.arrayOf(PropTypes.shape({
    petId: PropTypes.string.isRequired,
    petName: PropTypes.string.isRequired,
  })).isRequired,
};

export default FirstForm;
