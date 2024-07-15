import React, { useState, useEffect } from "react";
import { IoBagHandle } from "react-icons/io5";

const getCurrentMonthYear = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  const currentYear = currentDate.getFullYear();
  return `${currentMonth}-${currentYear}`;
};

const getPreviousMonthYear = () => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  const previousMonth = currentDate.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  const previousYear = currentDate.getFullYear();
  return `${previousMonth}-${previousYear}`;
};

const Dashboards = () => {
  const [totalOrders, setTotalOrders] = useState(null);
  const [revenueData, setRevenueData] = useState({ month1: 0, month2: 0 });
  const [month1Input, setMonth1Input] = useState(getPreviousMonthYear());
  const [month2Input, setMonth2Input] = useState(getCurrentMonthYear());
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const response = await fetch("https://fpetspa.azurewebsites.net/api/DashBoard/order-count");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTotalOrders(data);
      } catch (error) {
        console.error('Error fetching total orders:', error);
      }
    };

    const fetchRevenueData = async (month1, month2) => {
      try {
        const response = await fetch(`https://fpetspa.azurewebsites.net/api/DashBoard/compare-revenue?month1=${month1}&month2=${month2}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setRevenueData({
          month1: data.month1 || 0,
          month2: data.month2 || 0
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    const fetchOrderData = async () => {
      try {
        const response = await fetch("https://fpetspa.azurewebsites.net/api/DashBoard/date-range");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrderData(data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchTotalOrders();
    fetchRevenueData(month1Input, month2Input);
    fetchOrderData();
  }, [month1Input, month2Input]);

  const handleMonthInputChange = (event, field) => {
    const { value } = event.target;
    if (field === 'month1') {
      setMonth1Input(value);
    } else if (field === 'month2') {
      setMonth2Input(value);
    }
  };

  return (
    <div className="flex gap-4 w-full flex-wrap">
      <div className="bg-white rounded-md p-4 flex-1 border border-gray-200 flex items-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
          <IoBagHandle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Total Sales</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              ${revenueData.month2.toFixed(2)}
            </strong>
            <span className={`text-sm ${revenueData.month2 >= revenueData.month1 ? 'text-green-500' : 'text-red-500'} pl-2`}>
              {revenueData.month2 >= revenueData.month1 ? `+${(revenueData.month2 - revenueData.month1).toFixed(2)}` : `-${(revenueData.month1 - revenueData.month2).toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-4 flex-1 border border-gray-200 flex items-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-500">
          <IoBagHandle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Total Orders</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalOrders}
            </strong>
            <span className="text-sm text-green-500 pl-2">+234</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-4 flex-1 border border-gray-200 flex items-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-500">
          <IoBagHandle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Total Expenses</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              $3452.60
            </strong>
            <span className="text-sm text-green-500 pl-2">+234</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-4 flex-1 border border-gray-200 flex items-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-500">
          <IoBagHandle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Total Sales</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              $3452.60
            </strong>
            <span className="text-sm text-green-500 pl-2">+234</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex-1 bg-white rounded-md p-4 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Order Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Count</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.map((order, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.productCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboards;
