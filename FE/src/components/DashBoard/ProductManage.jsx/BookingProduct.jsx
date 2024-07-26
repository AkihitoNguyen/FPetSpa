import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading";
const BookingProduct = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dropdownState, setDropdownState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); // Số lượng đơn hàng trên mỗi trang
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://localhost:7055/api/account/getAllCustomer');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7055/api/Order/GetAllOrder");
      const allOrders = response.data;
      setOrders(allOrders);
  
      const orsOrders = allOrders.filter((order) => order.orderId.includes("ORP")).sort((a, b) => b.orderId.localeCompare(a.orderId));
  
      // Fetch transaction statuses
      const ordersWithTransactionStatus = await Promise.all(
        orsOrders.map(async (order) => {
          const transactionStatus = await fetchTransactionStatus(order.transactionId);
          return { ...order, transactionStatus };
        })
      );
  
      setFilteredOrders(ordersWithTransactionStatus);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTransactionStatus = async (transactionId) => {
    try {
      const response = await axios.get(
        `https://localhost:7055/api/Transaction/getTransactionById?transactionId=${transactionId}`
      );
      return response.data.status;
    } catch (error) {
      console.error("Error fetching transaction status:", error);
      return "Unknown";
    }
  };
  

  // Tính toán danh sách đơn hàng hiển thị trên từng trang
  const indexOfLastOrder = currentPage * pageSize;
  const indexOfFirstOrder = indexOfLastOrder - pageSize;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const updateOrderStatus = async (orderId, newStatus) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        "https://localhost:7055/api/Order/UpdateStatusForOrderProduct",
        null,
        {
          params: {
            OrderId: orderId,
            status: newStatus,
          },
        }
      );
  
      console.log("Order status updated successfully:", response.data);
  
      // Refresh the page after updating the order status
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const statusClass = (status) => {
    switch (status) {
      case 0:
        return "text-[#F6C000] bg-[#FFF8DD]";
      case 1:
        return "text-blue-600 bg-blue-100";
      case 2:
        return "text-[#F6C000] bg-[#FFF8DD]";
      case 3:
        return "text-green-600 bg-green-100";
      case 4:
        return "text-green-600 bg-green-100";
        case 5:
            return "text-fuchsia-600 bg-fuchsia-100"; 
        case 6:
            return "text-green-600 bg-green-100";
            case 7:
              return "text-red-600 bg-green-100";
      default:
        return "text-gray-900";
    }
  };

  const statusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "PreparingOrder";
      case 2:
        return "Delivering";
      case 3:
        return "Shipped";
    case 4:
        return "Delivered"
    case 5: 
        return "ReadyForPickup";
    case 6:
        return "Succesfully"
    case 7: 
        return "Cancel"
      default:
        return "Unknown";
    }
  };

  const statusClass1 = (status) => {
    switch (status) {
      case 0:
        return "text-[#F6C000] bg-[#FFF8DD]";
      case 1:
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-900";
    }
  };

  const statusText1 = (status) => {
    switch (status) {
      case 0:
        return "Paid";
      case 1:
        return "Not Paid";
      default:
        return "Unknown";
    }
  };


  const filterOrdersByStatus = (status) => {
    const filtered = orders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    const orsOrders = orders.filter((order) => order.orderId.includes("ORP"));
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

const getCustomerName = (customerId) => {
    const customer = customers.find((customer) => customer.id === customerId);
    return customer ? customer.fullName : "Unknown";
  };

  const handleAutomaticStatusChange = (order) => {
    if (order.deliveryOption === "SHIPPING") {
      if (order.status === 1) {
        updateOrderStatus(order.orderId, "Delivering"); // PreparingOrder -> Delivering
      } else if (order.status === 2) {
        updateOrderStatus(order.orderId, "Shipped"); // Delivering -> Shipped
      }
    } else if (order.deliveryOption === "PICKUP") {
      if (order.status === 1) {
        updateOrderStatus(order.orderId, "ReadyForPickup"); // PreparingOrder  -> ReadyForPickup
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-[17.592px] font-semibold mb-4">Booking Listing</h1>

      {isLoading ? (
        <Loading />
      ) : (
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
                  PreparingOrder
                </button>
                <button
                  onClick={() => handleSelect(2)}
                  className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                  Delivering
                </button>
                <button
                  onClick={() => handleSelect(3)}
                  className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                  Shipped
                </button>
                <button
                  onClick={() => handleSelect(4)}
                  className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                  Delivered
                </button>
                <button
                  onClick={() => handleSelect(5)}
                  className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                  ReadyForPickup
                </button>
                <button
                  onClick={() => handleSelect(6)}
                  className="block w-full px-4 py-2 text-[13px] text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500">
                  Sussessfully
                </button>
                <button
                  onClick={() => handleSelect(7)}
                  className="block w-full px-4 py-2 text-[13px] text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Cancel
                </button>
              </div>
            )}
          </div>

    
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200 rounded-md mt-4">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
            DeliveryOption
            </th>
            <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
            Transaction
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
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                {order.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
              {getCustomerName(order.customerId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold">
                <span
                  className={`text-[11.05px] font-semibold px-2 py-1 rounded ${statusClass(
                    order.status
                  )}`}>
                  {statusText(order.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold">
                {order.deliveryOption}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold">
                  <span className={`text-[11.05px] font-semibold px-2 py-1 rounded ${statusClass1(order.transactionStatus)}`}>
                    {statusText1(order.transactionStatus)}
                  </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-[#78829D]">
                ${order.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-[#78829D]">
                {order.createTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => handleAutomaticStatusChange(order)}
                    className="inline-flex items-center justify-center w-full px-3.5 py-[8.15px] bg-[#F9F9F9] text-[12.35px] font-medium text-gray-700 rounded-md hover:bg-[#E9F3FF] hover:text-[#1B84FF]">
                    Change
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
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

export default BookingProduct;
