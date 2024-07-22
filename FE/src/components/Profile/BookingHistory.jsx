import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Loading from "../Loading";

const API_BASE_URL = "https://fpetspa.azurewebsites.net/api";

const BookingHistory = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!currentUser || !currentUser.accessToken) {
          console.error("Bạn cần đăng nhập để xem thông tin đơn hàng.");
          setError("Bạn cần đăng nhập để xem thông tin đơn hàng.");
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
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        setError("Đã xảy ra lỗi khi lấy dữ liệu đơn hàng. Vui lòng thử lại.");
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
      toast.success("Đơn hàng đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      setError("Đã xảy ra lỗi khi xóa đơn hàng. Vui lòng thử lại.");
      toast.error("Đã xảy ra lỗi khi xóa đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleRebooking = async (orderId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      };

      if (!orderId || !currentUser || !currentUser.accessToken) {
        setError("Thiếu thông tin cần thiết để đặt lại đơn hàng.");
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/Order/ReBooking?orderId=${orderId}&paymentMethod=VNPay`,
        {},
        config
      );

      const paymentUrl = response.data; // Assuming response.data contains the payment URL
      window.location.href = paymentUrl; // Redirect to the payment URL

    } catch (error) {
      console.error("Lỗi khi đặt lại đơn hàng:", error);
      setError("Đã xảy ra lỗi khi đặt lại đơn hàng. Vui lòng thử lại.");
      toast.error("Đã xảy ra lỗi khi đặt lại đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleOpenDeleteModal = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
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
      <h1 className="text-2xl font-bold mb-4">Danh Sách Đơn Hàng</h1>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">
          Status:
        </label>
        <select
          id="filter"
          value={filterStatus}
          onChange={handleFilterChange}
          className="px-2 py-1 border border-gray-300 rounded">
          <option value="all">All</option>
          <option value="0">Pending</option>
          <option value="2">Check-in</option>
          <option value="1">Staff Accepted</option>
          <option value="3">Completed</option>
          <option value="5">Failed</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <div>Không có đơn hàng nào.</div>
      ) : (
        <div className="rounded-md border">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border">
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
                  Transaction Id
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Status
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
                    {order.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.status === 0 ? (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-yellow-600 bg-yellow-100">
                        Pending
                      </span>
                    ) : order.status === -1 ? (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-gray-600 bg-gray-100">
                        Expired
                      </span>
                    ) : order.status === 1 ? (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-blue-600 bg-blue-100">
                        Staff Accepted
                      </span>
                    ) : order.status === 2 ? (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-yellow-600 bg-yellow-100">
                        Check-in
                      </span>
                    ) : order.status === 3 ? (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-green-600 bg-green-100">
                        Completed
                      </span>
                    ) : order.status === 5 ? (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-red-600 bg-red-100">
                        Failed
                      </span>
                    ) : (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-gray-600 bg-gray-100">
                        Unknown
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleOpenDeleteModal(order)}
                      className="text-red-600 hover:text-red-900 mr-4"
                    >
                      Delete
                    </button>
                    {order.status === 5 && (
                      <button
                        onClick={() => handleRebooking(order.orderId)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Re-book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg z-10">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể
              hoàn tác.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
