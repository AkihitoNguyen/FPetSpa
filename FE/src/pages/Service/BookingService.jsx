import React, { useState, useEffect } from "react";
import FirstForm from "../../components/FormComponents/FirstForm";
import SecondForm from "../../components/FormComponents/SecondForm";
import axios from "axios";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const API_BASE_URL = "https://localhost:7055/api";

const BookingService = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [petData, setPetData] = useState([]);
  const formList = ["FirstForm"];
  const formLength = formList.length;

  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLoadingInPopup, setShowLoadingInPopup] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [page, setPage] = useState(0);
  const [values, setValues] = useState({
    date: "",
    timeSlot: "",
    serviceId: [], 
    petId: "",
    customerId: currentUser?.userId || "",
  });
  const [services, setServices] = useState([]);
  const [selectedServicePrice, setSelectedServicePrice] = useState("");

  useEffect(() => {
    if (!currentUser || !currentUser.accessToken) {
      console.error("You need to log in to view pet information.");
      return;
    }
    fetchPetData();
  }, [currentUser]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/services/Search`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services data:", error);
      });
  }, []);

  useEffect(() => {
    const storedServiceIds = localStorage.getItem("selectedServiceIds");
    if (storedServiceIds) {
      try {
        // Parse the JSON string into an array of service IDs
        const serviceIds = JSON.parse(storedServiceIds);
        if (Array.isArray(serviceIds)) {
          setValues((prevValues) => ({
            ...prevValues,
            serviceId: serviceIds,
          }));
        }
      } catch (error) {
        console.error("Error parsing data from localStorage:", error);
      }
    }
  }, []);

  const fetchPetData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      };
      const response = await axios.get(
        `${API_BASE_URL}/Pet?customerId=${currentUser.userId}`,
        config
      );
      const petInfo = response.data;
      const filteredPets = petInfo.filter(
        (pet) => pet.customerId === currentUser.userId
      );
      setPetData(filteredPets);
    } catch (error) {
      console.error("Error fetching pet data:", error);
      setPetData([]);
    }
  };

  const handleServiceSelection = (serviceId) => {
    setValues((prevValues) => {
      const updatedServiceIds = new Set(prevValues.serviceId);
      if (updatedServiceIds.has(serviceId)) {
        updatedServiceIds.delete(serviceId);
      } else {
        updatedServiceIds.add(serviceId);
      }
      return {
        ...prevValues,
        serviceId: Array.from(updatedServiceIds),
      };
    });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name !== "serviceId") {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handlePrev = () => {
    setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : formLength - 1));
  };

  const handleNext = () => {
    setPage((prevPage) => (prevPage < formLength - 1 ? prevPage + 1 : 0));
  };

  const canProceed = () => {
    return (
      values.date !== "" &&
      values.timeSlot !== "" &&
      values.petId !== ""
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const datetime = dayjs(
      `${values.date} ${values.timeSlot}`,
      "DD/MM/YYYY HH:mm:ss"
    ).format("DD/MM/YYYY HH:mm:ss");
    const requestData = {
      customerId: values.customerId,
      petId: values.petId,
      serviceId: values.serviceId, 
      bookingDatetime: datetime,
    };
    console.log("Request data before sending:", requestData); // Check data
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Order/StartCheckoutServices`,
        requestData
      );
      console.log("Booking created:", response.data);
      setShowSuccessPopup(true);
      setShowSuccessIcon(true);
      setLoading(false);
    } catch (error) {
      console.error("Error creating booking:", error.response || error.message);
      setLoading(false);
    }
  };

  const handleConfirmSuccess = () => {
    setShowSuccessPopup(false);
    setShowSuccessIcon(false);
    window.location.reload();
  };

  const handleForms = () => {
    switch (page) {
      case 0:
        return (
          <FirstForm
            formValues={{
              ...values,
              datetime: dayjs(
                `${values.date} ${values.timeSlot}`,
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss"),
            }}
            onChange={onChange}
            userPets={petData}
            onServiceSelection={handleServiceSelection}
          />
        );
      case 1:
        return (
          <SecondForm
            formValues={values}
            onChange={onChange}
            services={services}
            selectedServicePrice={selectedServicePrice}
            onServiceSelection={handleServiceSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#EEEEEE] mb-10">
      <div className="w-full max-w-lg">
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            <div className="relative bg-white rounded-lg px-8 py-6">
              {showLoadingInPopup ? (
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center mb-4">
                  {showSuccessIcon ? (
                    <svg
                      className="h-8 w-8 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : null}
                </div>
              )}
              <h2 className="text-lg font-bold mb-4">Booking Successful! <br />
               Please wait for the staff to confirm</h2>
              {!showLoadingInPopup && (
                <button
                  onClick={handleConfirmSuccess}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
          </div>
        )}
        {handleForms()}
        <div className="w-[464px] flex justify-center ml-6 bg-white mb-10 pb-3">
          {page === formLength - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              className={`bg-[#FC819E] hover:bg-[#f5698a] text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline ${
                canProceed() ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!canProceed()}
            >
              Confirm
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Next
            </button>
          )}
          {page > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingService;
