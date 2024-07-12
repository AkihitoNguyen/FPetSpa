import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../Loading";

const ViewService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const dropdownRefs = useRef([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://fpetspa.azurewebsites.net/api/services/Search"
        );
        setServices(response.data);
        setLoading(false); // Dừng loading khi dữ liệu đã được fetch thành công
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false); // Dừng loading nếu có lỗi xảy ra
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://fpetspa.azurewebsites.net/api/services/${serviceToDelete}`
      );
      const updatedServices = services.filter(
        (service) => service.servicesId !== serviceToDelete
      );
      setServices(updatedServices);
      setServiceToDelete(null);
      setConfirmDelete(false);
      setSuccessMessage("Service deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const toggleDropdown = (index) => {
    dropdownRefs.current[index].classList.toggle("hidden");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto mt-4">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md">
          {successMessage}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl mb-4">Are you sure to delete this service?</h2>
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Service Name
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Service ID
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {services.map((service, index) => (
            <tr key={service.servicesId}>
              <td className="w-[314.812px] px-[9.75px] py-[16.25px] whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div>
                    <img
                      src={service.pictureServices}
                      alt={service.serviceName}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  </div>
                  <div className="text-[14.95px] font-semibold text-gray-900">
                    {service.serviceName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[14.95px] font-semibold text-[#78829D]">
                {service.servicesId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[14.95px] font-semibold text-[#78829D]">
                {service.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[14.95px] font-semibold text-[#78829D]">
                ${service.price}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="inline-flex items-center justify-center w-full px-3.5 py-[8.15px] bg-[#F9F9F9] text-[12.35px] font-medium text-gray-700 rounded-md hover:bg-[#E9F3FF] hover:text-[#1B84FF]">
                    Actions
                    <svg
                      className="-mr-1 ml-2 h-4 w-4 mb-[3px] transform transition-transform duration-200"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div
                    ref={(el) => (dropdownRefs.current[index] = el)}
                    className="hidden z-10 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1">
                    <div className="flex flex-col px-[9.75px] py-[8.45px] items-center gap-y-1">
                      <Link to={`/layout/edit-service/${service.servicesId}`}>
                        <button className="block px-[9.75px] py-[8.45px] text-sm text-gray-700 hover:bg-[#E9F3FF] rounded-md w-[120px] text-left">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setServiceToDelete(service.servicesId);
                          setConfirmDelete(true);
                        }}
                        className="block px-[9.75px] py-[8.45px] text-sm text-gray-700 hover:bg-[#E9F3FF] rounded-md w-[120px] text-left">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewService;
