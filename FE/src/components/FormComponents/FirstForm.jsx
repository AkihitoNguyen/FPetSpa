import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const defaultFormValues = {
  petId: "",
  date: "",
  timeSlot: "",
  // add other form fields if necessary
};

const FirstForm = ({ formValues, onChange, userPets }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/second-form"); // Navigate to "/second-form" when clicking "View all services"
  };

  useEffect(() => {
    
    // Load initial data from local storage or use default values
    const storedSelectedServices = JSON.parse(localStorage.getItem("selectedServices")) || [];
    setSelectedServices(storedSelectedServices);
    setTotalAmount(storedSelectedServices.reduce((sum, service) => sum + service.price, 0));

    // Reset form values
    onChange({ target: { name: "petId", value: defaultFormValues.petId } });
    onChange({ target: { name: "date", value: defaultFormValues.date } });
    onChange({ target: { name: "timeSlot", value: defaultFormValues.timeSlot } });
  }, [onChange]);

  return (
    <div className="">
      <div>
        <div className="mx-auto max-w-2xl text-center mt-2">
          <h3 className="text-[18px] font-semibold tracking-tight text-[#FC819E] sm:text-xl">
            Schedule a reservation
          </h3>
        </div>
        {/* Pet Information */}
        <div className="bg-white mt-2">
          <div className="mx-auto mt-2 max-w-xl sm:mt-5 p-4">
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 sm:grid-cols-2">
              {/* Select Pet */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="pet-id"
                  className="block text-sm font-semibold leading-6 text-[#FC819E]">
                  1. Choose pets
                </label>
                <div className="mt-2.5">
                  <select
                    name="petId"
                    id="pet-id"
                    onChange={onChange}
                    value={formValues.petId}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <option value="" className="text-gray-300">Choose your pet</option>
                    {userPets.map((pet) => (
                      <option key={pet.petId} value={pet.petId}>
                        {pet.petName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Type */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="serviceId"
                  className="block text-sm font-semibold leading-6 text-[#FC819E]">
                  2. Choose services
                </label>
                <div
                  className="mt-2.5 cursor-pointer flex items-center bg-[#f7f7f7] h-11 rounded px-2.5"
                  aria-hidden="true"
                  onClick={handleClick}>
                  <div className="flex relative mr-2.5 md:mr-3.5">
                    <img
                      src="https://30shine.com/static/media/service.1f8993aa.svg"
                      alt=""
                      className="inline"
                    />
                  </div>
                  <div className="pr-0.5 overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-sm text-gray-400">
                    {selectedServices.length > 0
                      ? `Selected (${selectedServices.length}) services`
                      : "View all services"}
                  </div>
                  <div className="ml-auto w-2.5">
                    <img
                      src="https://30shine.com/static/media/caretRight.1e56cad1.svg"
                      alt=""
                    />
                  </div>
                </div>
                <div>
                  <div className="mt-4">
                    <div className="flex flex-wrap -mx-1.5">
                      {selectedServices.map((service, index) => (
                        <div key={index} className="mx-1.5 mb-2.5 rounded px-1.5 border border-gray-500 text-sm cursor-default">
                          <div>{service.serviceName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-[#11B14B]">
                  Total amount to be paid:
                  <span className="font-normal"> {totalAmount}$</span>
                </div>
              </div>

              {/* Date */}
              <div className="">
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold leading-6 text-[#FC819E]">
                  3. Date
                </label>
                <div className="mt-2.5">
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="date"
                    id="date"
                    name="date"
                    onChange={onChange}
                    value={formValues.date}
                  />
                </div>
              </div>

              {/* Time Slot */}
              <div className="">
                <label
                  htmlFor="time-slot"
                  className="block text-sm font-semibold leading-6 text-[#FC819E]">
                  4. Time Slot
                </label>
                <div className="mt-2.5">
                  <select
                    name="timeSlot"
                    id="time-slot"
                    onChange={onChange}
                    value={formValues.timeSlot}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <option value="">Choose a time slot</option>
                    {/* Populate time slots */}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstForm;
