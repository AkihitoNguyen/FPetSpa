import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboards = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [transactionData, setTransactionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const [orderCountResponse, totalRevenueResponse, transactionsResponse] = await Promise.all([
        axios.get('https://localhost:7055/api/DashBoard/order-count'),
        axios.get('https://localhost:7055/api/DashBoard/total-revenue'),
        axios.get('https://localhost:7055/api/DashBoard')
      ]);

      setOrderCount(orderCountResponse.data);
      setTotalRevenue(totalRevenueResponse.data);

      const sortedTransactions = transactionsResponse.data.sort((a, b) => {
        const dateA = parseDate(a.transactionDate);
        const dateB = parseDate(b.transactionDate);
        return dateB - dateA;
      });
      setTransactionData(sortedTransactions);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year, time] = dateString.split(/[/\s:]/);
    return new Date(`${year}-${month}-${day}T${time}:00`);
  };

  useEffect(() => {
    fetchData(); // Fetch data initially

    const intervalId = setInterval(() => {
      fetchData(); // Fetch data periodically
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const totalPages = Math.ceil(transactionData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = transactionData.slice(startIndex, startIndex + itemsPerPage);

  const fetchOrderDetails = async (orderId) => {
    try {
      const apiUrl = orderId.startsWith('ORP')
        ? `https://localhost:7055/api/ProductOrderDetail/getOrderById?orderId=${orderId}`
        : `https://localhost:7055/api/ServiceOrderDetail/getServiceDetailByOrderId?orderId=${orderId}`;
      
      const response = await axios.get(apiUrl);
      // console.log('Order Details Response:', response.data); 

      if (orderId.startsWith('ORP')) {
        setSelectedProduct(response.data[0]);
        setShowDetailModal(true);
      } else {
        setSelectedService(response.data[0]);
        setShowServiceDetailModal(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
    setShowServiceDetailModal(false);
    setSelectedService(null);
  };

  return (
    <div className="mt-12 ml-5">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Card Total Revenue */}
        <div className="w-[273.8px] relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 shadow-sm">
          <div className="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-12 w-12 place-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-6 h-6 text-white"
            >
              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
              <path
                fillRule="evenodd"
                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                clipRule="evenodd"
              ></path>
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
            </svg>
          </div>
          <div className="p-3 text-right">
            <p className="m-0 block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
              Total Revenue
            </p>
            <h4 className="m-0 block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
              ${totalRevenue}
            </h4>
          </div>
        </div>

        {/* Card Order */}
        <div className="w-[273.8px] relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 shadow-sm">
          <div className="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-12 w-12 place-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-6 h-6 text-white"
            >
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.118v-.004zM14.25 19.128a7.15 7.15 0 012.43-4.896 6.623 6.623 0 00-2.931-.682h-.003a6.633 6.633 0 00-2.932.682 7.15 7.15 0 012.43 4.896v.003z"></path>
              <path d="M18.75 18.624a4.124 4.124 0 114.125 4.125 4.13 4.13 0 01-4.125-4.125z"></path>
            </svg>
          </div>
          <div className="p-3 text-right">
            <p className="m-0 block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
              Order
            </p>
            <h4 className="m-0 block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
              {orderCount}
            </h4>
          </div>
        </div>
      </div>

   <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Transaction Date</th>
              <th className="px-4 py-2">Payment Method</th>
              {/* <th className="px-4 py-2">Status</th> */}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((transaction, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{transaction.customerName}</td>
                <td className="border px-4 py-2">${transaction.total}</td>
                <td className="border px-4 py-2">{transaction.transactionDate}</td>
                <td className="border px-4 py-2">{transaction.paymentMethod}</td>
                {/* <td className="border px-4 py-2">{transaction.status}</td> */}
                <td className="border px-4 py-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => fetchOrderDetails(transaction.orderId)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDetailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Product Order Details</h2>
            {selectedProduct ? (
                  <div className="bg-white px-6 py-5 sm:p-8">
                    <div className="sm:flex sm:items-start">
                        <div className="sm:flex-shrink-0">
                            <img src={selectedProduct.pictureName} alt={selectedProduct.productName} className="w-64 h-64 object-cover rounded-lg shadow-sm"/>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-6 sm:text-left w-full">
                            <div className="mt-3 text-gray-700">
                                <p className="mt-2"><strong className="text-gray-900">Product Name:</strong> {selectedProduct.productName}</p>
                                <p className="mt-2"><strong className="text-gray-900">Product ID:</strong> {selectedProduct.productId}</p>
                                <p className="mt-2"><strong className="text-gray-900">Quantity:</strong> {selectedProduct.productQuantity}</p>
                                <p className="mt-2"><strong className="text-gray-900">Price:</strong> ${selectedProduct.price}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
              <p>Loading...</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showServiceDetailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Service Order Details</h2>
            {selectedService ? (
      <div className="bg-white px-6 py-5 sm:p-8">
                    <div className="sm:flex sm:items-start">
                        <div className="sm:flex-shrink-0">
                            <img src={selectedService.pictureServices} alt={selectedService.serviceName} className="w-64 h-64 object-cover rounded-lg shadow-sm"/>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-6 sm:text-left w-full">
                            <div className="mt-3 text-gray-700">
                                <p className="mt-2"><strong className="text-gray-900">Service Name:</strong> {selectedService.serviceName}</p>
                                <p className="mt-2"><strong className="text-gray-900">Price:</strong> ${selectedService.price}</p>
                                <p className="mt-2"><strong className="text-gray-900">Transaction Date:</strong> {selectedService.transactionDate}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
              <p>Loading...</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`mx-1 px-4 py-2 rounded-md ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboards;
