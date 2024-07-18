import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../Loading";

const API_BASE_URL = "https://fpetspa.azurewebsites.net/api";

const BookingHistory = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // State để lưu trạng thái bộ lọc
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State để điều khiển việc hiển thị modal
  const [orderToDelete, setOrderToDelete] = useState(null); // State để lưu trữ thông tin đơn hàng đang được xác nhận để xóa

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
            // Kiểm tra nếu requiredDate đã hết hạn
            if (isDateExpired(order.requiredDate)) {
              // Nếu đã hết hạn, cập nhật trạng thái thành "Failed"
              return {
                ...order,
                status: -1, // Giả sử -1 là trạng thái Failed
              };
            }
            return order;
          })
          .sort((a, b) => b.orderId.localeCompare(a.orderId)); // Sắp xếp các đơn hàng theo orderId mới nhất

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
      setShowDeleteModal(false); // Đóng modal sau khi xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      setError("Đã xảy ra lỗi khi xóa đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Đóng modal nếu người dùng hủy bỏ hành động xóa
  };

  const handleOpenDeleteModal = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true); // Mở modal và thiết lập thông tin đơn hàng cần xóa
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") {
      return true; // Hiển thị tất cả các đơn hàng nếu không có bộ lọc
    } else {
      return order.status === parseInt(filterStatus); // Lọc theo trạng thái đã chọn
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
          <option value="1">Proccessing</option>
          <option value="2">Staff Accepted</option>
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
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-red-600 bg-red-100">
                        Failed
                      </span>
                    ) : order.status === 2 ? (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-blue-600 bg-blue-100">
                        Staff Accepted
                      </span>
                    )
                    : order.status === 1 ? (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-yellow-600 bg-yellow-100">
                        Processing
                      </span>
                    ) : (
                      <span className="text-[11.05px] font-semibold px-2 py-1 rounded text-green-600 bg-green-100">
                        Completed
                      </span>
                    )
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.status === 0 && (
                      <button
                        onClick={() => handleOpenDeleteModal(order)}
                        className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to cancel your order?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteOrder}
                className="bg-red-500 text-white px-4 py-2 rounded mr-4 hover:bg-red-600">
                Accept
              </button>
              <button
                onClick={handleCancelDelete}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-200">
                Cancle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
