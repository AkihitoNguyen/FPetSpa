import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import '../Profile/OrderManagement.css';
import axios from 'axios';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [error, setError] = useState(null);
    const currentUser = useSelector((state) => state.auth.login.currentUser);

    const fetchOrders = async (customerId) => {
        try {
            const response = await fetch(`https://fpetspa.azurewebsites.net/api/Order/OrderSearch?CustomeriD=${customerId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`https://fpetspa.azurewebsites.net/api/ProductOrderDetail/getOrderById?orderId=${orderId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrderDetails(data);
        } catch (error) {
            setError(error.message);
        }
    };
    const handleRebooking = async (orderId) => {
        try {
            const response = await axios.put(`https://localhost:7055/api/Order/ReBooking?orderId=${orderId}`);
            const paymentUrl = response.data; // Assuming response.data contains the payment URL
            window.location.href = paymentUrl;
            // Handle successful rebooking (e.g., show a success message or update state)
        } catch (error) {
            setError(error.message);
        }
    };
    

    useEffect(() => {
        if (currentUser && currentUser.userId) {
            fetchOrders(currentUser.userId);
        }
    }, [currentUser]);

    const handleOrderClick = (orderId) => {
        fetchOrderDetails(orderId);
        setSelectedOrderId(orderId);
    };

    const getStatusText = (status) => {
        return status === 0 ? 'Successfully' : status === 1 ? 'Pending' : '';
    };

    const getStatusTextClass = (status) => {
        return status === 0 ? 'status-text-green' : status === 1 ? 'status-text-yellow' : '';
    };

    const userOrders = orders.filter(order => order.customerId === currentUser.userId);

    return (
        <div>
            <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
            {error ? (
                <p className="mt-4 text-red-500">Error: {error}</p>
            ) : orders.length === 0 ? (
                <p className="mt-4">Loading...</p>
            ) : userOrders.length > 0 ? (
                <>
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Required Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Detail
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userOrders.map((order) => (
                                <tr key={order.orderId} className="border-b border-gray-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.orderId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.requiredDate}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {order.total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`ml-2 ${getStatusTextClass(order.transactionStatus)}`}>{getStatusText(order.transactionStatus)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`ml-2 ${getStatusTextClass(order.status)}`}>{getStatusText(order.status)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <button onClick={() => handleOrderClick(order.orderId)} className="text-blue-500 hover:underline">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Dialog className="relative z-10" open={!!selectedOrderId} onClose={() => setSelectedOrderId(null)}>
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        />
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl"
                                >
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Order Details
                                            </DialogTitle>
                                            <div className="mt-2">
                                                {orderDetails.length > 0 ? (
                                                    <table className="min-w-full bg-white border border-gray-200 mt-4">
                                                        <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="pr-6 pl-24 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Product
                                                                </th>
                                                                <th className="pr-6 pl-24 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Order ID
                                                                </th>
                                                                <th className="pr-6 pl-24 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Quantity
                                                                </th>
                                                                <th className="pr-6 pl-24 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Price
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {orderDetails.map((detail) => (
                                                                <tr key={detail.productId} className="border-b border-gray-200">
                                                                    <td className="pr-6 pl-24 whitespace-nowrap text-sm text-gray-500">
                                                                        <div className="flex items-center">
                                                                            <img className="h-24 w-32 mr-4" src={detail.pictureName} alt={detail.productName} />
                                                                            <span className="font-semibold">{detail.productName}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="pr-6 pl-24 whitespace-nowrap text-sm text-gray-500">
                                                                        {detail.orderId}
                                                                    </td>
                                                                    <td className="pr-6 pl-24 text-sm text-gray-500">
                                                                        {detail.productQuantity}
                                                                    </td>
                                                                    <td className="pr-6 pl-24 text-sm text-gray-500">
                                                                        {detail.price}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-sm text-gray-500">Loading...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedOrderId && orders.find(order => order.orderId === selectedOrderId && order.transactionStatus === 1) && (
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                                onClick={() => handleRebooking(selectedOrderId)}
                                            >
                                                Continue Payment
                                            </button>
                                        </div>
                                    )}
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={() => setSelectedOrderId(null)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>
                </>
            ) : (
                <p className="mt-4">Không có đơn hàng nào liên quan đến người dùng hiện tại.</p>
            )}
        </div>
    );
};

export default OrderManagement;
