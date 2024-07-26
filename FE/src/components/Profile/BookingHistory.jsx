import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../Loading";

const API_BASE_URL = "https://localhost:7055/api";

const BookingHistory = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderToPay, setOrderToPay] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner during status update

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!currentUser || !currentUser.accessToken) {
          console.error("You need to log in to view order information.");
          setError("You need to log in to view order information.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        };

        const response = await axios.get(
          `${API_BASE_URL}/Order/GetAllOrderService`,
          config
        );

        const ordersData = response.data
          .filter((order) => order.customerId === currentUser.userId)
          .map((order) => {
            if (isDateExpired(order.requiredDate)) {
              return {
                ...order,
                status: -1,
              };
            }
            return order;
          })
          .sort((a, b) => b.orderId.localeCompare(a.orderId));

        setOrders(ordersData);
      } catch (error) {
        console.error("Error retrieving order data:", error);
        setError(
          "An error occurred while retrieving order data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const isDateExpired = (requiredDate) => {
    const currentDate = new Date();
    const required = new Date(requiredDate);
    return currentDate > required;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/Order/UpdateOrderStatus`,
        null,
        {
          params: {
            OrderId: orderId,
            status: newStatus,
          },
        }
      );

      console.log("Order status updated successfully:", response.data);

      // Refresh the orders after updating the order status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      };

      await axios.delete(
        `${API_BASE_URL}/Order/DeleteOrderByOrderId?orderId=${orderToDelete.orderId}`,
        config
      );

      setOrders(
        orders.filter((order) => order.orderId !== orderToDelete.orderId)
      );
      setShowDeleteModal(false);
      toast.success("Order has been successfully deleted!");
    } catch (error) {
      console.error("Error when deleting order:", error);
      setError("An error occurred while deleting the order. Please try again.");
      toast.error(
        "An error occurred while deleting the order. Please try again."
      );
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleOpenDeleteModal = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleOpenPaymentModal = (order) => {
    setOrderToPay(order);
    setShowPaymentModal(true);
  };

  const handlePayment = async (method) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      };

      if (!orderToPay || !currentUser || !currentUser.accessToken) {
        setError("Missing information needed to process payment.");
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/Order/ReBooking?orderId=${orderToPay.orderId}&paymentMethod=${method}`,
        {},
        config
      );

      const paymentUrl = response.data;
      // Store transaction information or payment status temporarily or check the status upon return

      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("An error occurred while processing payment. Please try again.");
      toast.error(
        "An error occurred while processing payment. Please try again."
      );
    } finally {
      setShowPaymentModal(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") {
      return true;
    } else {
      return order.status === parseInt(filterStatus);
    }
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Booking History</h1>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">
          Status:
        </label>
        <select
          id="filter"
          value={filterStatus}
          onChange={handleFilterChange}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="all">All</option>
          <option value="0">Pending</option>
          <option value="2">Check-in</option>
          <option value="1">Staff Accepted</option>
          <option value="3">Completed</option>
          <option value="-1">Expired</option>
          <option value="4">Failed</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <div>There are no orders.</div>
      ) : (
        <div className="rounded-lg border">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b-[1px]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Order Id
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Required Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Staff Assign
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Transaction Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.requiredDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.staffName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.status === 2 ? (
                      <span className="text-yellow-600 font-semibold px-2 py-1 rounded bg-yellow-100">
                        Check-in
                      </span>
                    ) : order.status === -1 ? (
                      <span className="text-gray-500 font-semibold px-2 py-1 rounded bg-gray-100">
                        Expired
                      </span>
                    ) : order.status === 0 ? (
                      <span className="text-yellow-600 font-semibold px-2 py-1 rounded bg-yellow-100">
                        Pending
                      </span>
                    ) : order.status === 1 ? (
                      <span className="text-blue-600 font-semibold px-2 py-1 rounded bg-blue-100">
                        Staff Accepted
                      </span>
                    ) : order.status === 3 ? (
                      <span className="text-green-600 font-semibold px-2 py-1 rounded bg-green-100">
                        Completed
                      </span>
                    ) : order.status === 4 ? (
                      <span className="text-red-600 font-semibold px-2 py-1 rounded bg-red-100">
                        Failed
                      </span>
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.transactionStatus === 1 ? (
                      <span className="text-yellow-600 font-semibold px-2 py-1 rounded bg-yellow-100">
                        Not Paid
                      </span>
                    ) : order.transactionStatus === 0 ? (
                      <span className="text-green-600 font-semibold px-2 py-1 rounded bg-green-100">
                        Paid
                      </span>
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.status === 1 && order.transactionStatus === 1 && (
                      <button
                        onClick={() => handleOpenPaymentModal(order)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Payment
                      </button>
                    )}
                    {order.status !== 3 && order.status !== 4 && (
                      <>
                        {/* <button
                          onClick={() => updateOrderStatus(order.orderId, 3)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Mark as Complete
                        </button> */}
                        <button
                          onClick={() => updateOrderStatus(order.orderId, "Cancel")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg z-10">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this order?</p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteOrder}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg z-10">
            <h2 className="text-lg font-semibold mb-4">
              Choose Payment Method
            </h2>
            <div className="flex justify-end">
              <button
                onClick={() => handlePayment("VNPay")}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Pay with VNPay
              </button>
              <button
                onClick={() => handlePayment("PayPal")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Pay with PayPal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
