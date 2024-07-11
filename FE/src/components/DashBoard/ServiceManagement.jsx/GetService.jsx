import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const GetService = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dropdownState, setDropdownState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); // Số lượng đơn hàng trên mỗi trang
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://fpetspa.azurewebsites.net/api/Order/GetAllOrderService")
      .then((response) => {
        const allOrders = response.data;
        setOrders(allOrders);

        const orsOrders = allOrders.filter((order) =>
          order.orderId.includes("ORS")
        );
        setFilteredOrders(orsOrders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  // Tính toán danh sách đơn hàng hiển thị trên từng trang
  const indexOfLastOrder = currentPage * pageSize;
  const indexOfFirstOrder = indexOfLastOrder - pageSize;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        "https://fpetspa.azurewebsites.net/api/Order/UpdateOrderStatus",
        null,
        {
          params: {
            OrderId: orderId,
            status: newStatus,
          },
        }
      );

      console.log("Order status updated successfully:", response.data);

      // Cập nhật lại danh sách đơn hàng sau khi cập nhật thành công
      const updatedOrders = orders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      // Cập nhật lại danh sách đơn hàng đã lọc
      const updatedFilteredOrders = updatedOrders.filter(
        (order) => order.status === parseInt(currentStatus)
      );
      setFilteredOrders(updatedFilteredOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case 0:
        return "text-[#F6C000] bg-[#FFF8DD]";
      case 1:
        return "text-blue-600 bg-blue-100";
      case 2:
        return "text-green-600 bg-green-100";
      case 3:
        return "text-red-600 bg-red-100";
      case 4:
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-900";
    }
  };

  const statusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Staff Accepted";
      case 2:
        return "Completed";
      case 3:
        return "Cancelled";
      case 4:
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const filterOrdersByStatus = (status) => {
    const filtered = orders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    const orsOrders = orders.filter((order) => order.orderId.includes("ORS"));
    setFilteredOrders(orsOrders);
    setCurrentStatus("");
  };

  const toggleDropdown = (orderId) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const handleSelect = (status) => {
    if (status === "") {
      resetFilters();
    } else {
      filterOrdersByStatus(parseInt(status));
    }
    setCurrentStatus(status);
  };

  const handleAddOrder = () => {
    if (selectedOrders) {
      navigate(`/layout/add-order/${selectedOrders}`);
    } else {
      alert("Please select an order to add.");
    }
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter((id) => id !== orderId);
      } else {
        return [...prevSelected, orderId];
      }
    });
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      resetFilters();
    } else {
      const filtered = orders.filter((order) =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  // Chuyển đổi trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <h1 className="text-[17.592px] font-semibold mb-4">Booking Listing</h1>

      <div className="flex items-center space-x-4 mt-4 mb-1.5">
        <div>
          <input
            type="text"
            placeholder="Search Order"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="inline-flex items-center justify-between w-[222px] h-[41.57px] px-[13px] py-[10.075px] rounded-md text-[#99A1B7] outline-none bg-[#F9F9F9] text-sm font-medium hover:bg-gray-50"
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-[#1B84FF] text-white rounded-md ">
            Search
          </button>
        </div>

        <div className="relative inline-block text-left">
          <button
            onClick={() => toggleDropdown("statusDropdown")}
            className="inline-flex items-center justify-between w-[146px] rounded-md px-4 py-2 text-[#99A1B7] bg-[#F9F9F9] text-sm font-medium hover:bg-gray-50">
            <span>
              {currentStatus ? statusText(parseInt(currentStatus)) : "Status"}
            </span>
            <svg
              className="ml-2 -mr-1 h-5 w-5 mb-[3px] transform transition-transform duration-200"
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

          {dropdownState["statusDropdown"] && (
            <div className="absolute right-0 mt-2 w-[146px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <button
                onClick={() => handleSelect("")}
                className="block w-full px-4 py-2 text-[13px] font-normal text-left text-[#4B5675] hover:bg-gray-100 hover:text-gray-900">
                All
              </button>
              <button
                onClick={() => handleSelect(0)}
                className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                Pending
              </button>
              <button
                onClick={() => handleSelect(1)}
                className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                Staff Accepted
              </button>
              <button
                onClick={() => handleSelect(2)}
                className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                Completed
              </button>
              <button
                onClick={() => handleSelect(3)}
                className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                Cancelled
              </button>
              <button
                onClick={() => handleSelect(4)}
                className="block w-full px-4 py-2 text-[13px] text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                Failed
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleAddOrder}
          className="inline-flex items-center justify-center w-[109.5px] h-[40.3906px] px-[20.5px] py-[11.075px] text-[13.2px] font-medium text-white bg-[#1B84FF] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add Order
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-md mt-4">
        <thead>
          <tr>
            <th className="w-[20px] px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={() => {
                }}
                className="cursor-pointer"
              />
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Customer ID
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Required Date
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.orderId} className="border-b border-gray-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.orderId)}
                  onChange={() => handleCheckboxChange(order.orderId)}
                  className="cursor-pointer"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                {order.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                {order.customerId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold">
                <span
                  className={`text-[11.05px] font-semibold px-2 py-1 rounded ${statusClass(
                    order.status
                  )}`}>
                  {statusText(order.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-[#78829D]">
                ${order.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-[#78829D]">
                {order.requiredDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => toggleDropdown(order.orderId)}
                    className="inline-flex items-center justify-center w-full px-3.5 py-[8.15px] bg-[#F9F9F9] text-[12.35px] font-medium text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
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

                  {dropdownState[order.orderId] && (
                    <span className="absolute left-0 mt-11 w-32 rounded-md bg-white  z-10">
                      <button
                        onClick={() =>
                          updateOrderStatus(order.orderId, "SUCCESSFULLY")
                        }
                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left">
                        Done
                      </button>
                      <button
                        onClick={() =>
                          updateOrderStatus(order.orderId, "PROCESSING")
                        }
                        className="block px-4 py-2 text-sm text-gray-700  w-full text-left">
                        Processing
                      </button>
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Nút phân trang */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from(
          { length: Math.ceil(filteredOrders.length / pageSize) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default GetService;
