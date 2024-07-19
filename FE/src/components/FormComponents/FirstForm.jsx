import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FirstForm = ({ formValues, onChange, userPets }) => {
  const [bookingTimes, setBookingTimes] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const navigate = useNavigate();
  const timeSlotsRef = useRef(null);

  const handleClick = () => {
    navigate("/second-form");
  };

  useEffect(() => {
    // Clear selectedServices from localStorage on page refresh
    const handleBeforeUnload = () => {
      localStorage.removeItem("selectedServices");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    fetch("https://fpetspa.azurewebsites.net/api/BookingTime/GetAllBookingTime")
      .then((response) => response.json())
      .then((data) => {
        const currentDateTime = new Date();
        const uniqueDates = [
          ...new Set(
            data
              .map((date) => date.date)
              .filter((date) => new Date(date) >= currentDateTime)
          ),
        ];
        setBookingTimes(data);
        setUniqueDates(uniqueDates);
      })
      .catch((error) => console.error("Error fetching booking times:", error));
  }, []);

  useEffect(() => {
    const storedSelectedServices =
      JSON.parse(localStorage.getItem("selectedServices")) || [];
    setSelectedServices(storedSelectedServices);
    setTotalAmount(
      storedSelectedServices.reduce((sum, service) => sum + service.price, 0)
    );
  }, [onChange]);

  const handleDateSelect = (date) => {
    onChange({ target: { name: "date", value: date } });
    setIsDropdownOpen(false);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    onChange({ target: { name: "timeSlot", value: timeSlot } });
    setSelectedTimeSlot(timeSlot);
  };

  const filteredTimeSlots = bookingTimes
    .filter((time) => time.date === formValues.date)
    .map((time) => time.time);

  const uniqueTimeSlots = [...new Set(filteredTimeSlots)];

  const scrollLeft = () => {
    if (timeSlotsRef.current) {
      timeSlotsRef.current.scrollLeft -= 150;
    }
  };

  const scrollRight = () => {
    if (timeSlotsRef.current) {
      timeSlotsRef.current.scrollLeft += 150;
    }
  };

  const isTimeSlotDisabled = (timeSlot) => {
    const currentDateTime = new Date();
    const slotDateTime = new Date(
      `${formValues.date}T${timeSlot}`
    );
    return slotDateTime < currentDateTime;
  };

  return (
    <div className="container mx-auto px-4 pt-4">
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
                  className="block text-sm font-semibold leading-6 text-[#FC819E]"
                >
                  1. Choose pets
                </label>
                <div className="mt-2.5">
                  <select
                    name="petId"
                    id="pet-id"
                    onChange={onChange}
                    value={formValues.petId}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
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
                  className="block text-sm font-semibold leading-6 text-[#FC819E]"
                >
                  2. Choose services
                </label>
                <div
                  className="mt-2.5 cursor-pointer flex items-center bg-[#f7f7f7] h-11 rounded px-2.5"
                  aria-hidden="true"
                  onClick={handleClick}
                >
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
                        <div
                          key={index}
                          className="mx-1.5 mb-3 py-1 rounded px-1.5 border border-gray-500 text-sm cursor-default"
                        >
                          <div className="">{service.serviceName}</div>
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
              <div className="w-full sm:col-span-2">
                <label
                  htmlFor="time-slot"
                  className="block text-sm font-semibold leading-6 text-[#FC819E]"
                >
                  3. Choose date & time
                </label>
                <div className="relative">
                  <div
                    className="cursor-pointer flex items-center bg-[#F7F7F7] h-11 rounded px-2.5"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-hidden="true"
                  >
                    <div className="flex relative mr-2 md:mr-3.5">
                      <img
                        src="https://30shine.com/static/media/calendar-2.6bb90547.svg"
                        alt=""
                      />
                    </div>
                    <div className="pr-0.5 overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-sm text-[#111111]">
                      <div className="w-full flex justify-center items-center">
                        <div>
                          {formValues.date ? (
                            <div className="cursor-default">
                              {
                                bookingTimes.find(
                                  (time) => time.date === formValues.date
                                )?.date
                              }
                            </div>
                          ) : (
                            <div className="text-gray-400">Choose a date</div>
                          )}
                        </div>
                        <div className="ml-auto w-2.5">
                          <img
                            src="https://30shine.com/static/media/caretRight.1e56cad1.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute mt-1 w-full bg-white shadow-md rounded-md z-10">
                      {uniqueDates.map((date, index) => (
                        <div
                          key={index}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onClick={() => handleDateSelect(date)}
                        >
                          {date}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Time Slot */}
              {formValues.date && (
                <div className="w-full sm:col-span-2 mt-1 relative">
                  <div className="relative flex items-center w-[480px]">
                    <button
                      onClick={scrollLeft}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l-md absolute left-[-40px] z-10"
                    >
                      &lt;
                    </button>
                    <div
                      ref={timeSlotsRef}
                      className="flex overflow-x-scroll no-scrollbar space-x-2 px-2"
                      style={{ scrollBehavior: "smooth", width: 'calc(100% - 80px)', margin: '0 ' }}
                    >
                      <div className="grid grid-flow-col grid-rows-3 gap-2">
                        {uniqueTimeSlots.map((timeSlot, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              !isTimeSlotDisabled(timeSlot) && handleTimeSlotSelect(timeSlot)
                            }
                            className={`px-3 py-3 rounded-[5px] border text-sm ${
                              selectedTimeSlot === timeSlot
                                ? "bg-[#FC819E] text-white"
                                : "bg-gray-200 text-gray-700"
                            } ${isTimeSlotDisabled(timeSlot) ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                            disabled={isTimeSlotDisabled(timeSlot)}
                          >
                            {timeSlot.slice(0, 5)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={scrollRight}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r-md absolute right-[-40px] z-10"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstForm;