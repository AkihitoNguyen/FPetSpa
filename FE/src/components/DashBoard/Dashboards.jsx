import { Bar, Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

// Đăng ký các thành phần của ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const Dashboards = () => {
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(null);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState(null);
  const [percentChange, setPercentChange] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [salesThisMonth, setSalesThisMonth] = useState(null);

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#17C653",
        borderColor: "#17C653",
        data: [],
      },
    ],
  });

  const goal = 100;

  useEffect(() => {
    const getCurrentAndPreviousMonthDates = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const previousMonthDate = new Date(currentYear, currentMonth - 2, 1);
      const currentDateFormatted = `${currentMonth}-${currentDate.getDate()}-${currentYear}`;
      const previousMonthDateFormatted = `${
        previousMonthDate.getMonth() + 1
      }-1-${previousMonthDate.getFullYear()}`;
      return { currentDateFormatted, previousMonthDateFormatted };
    };

    const fetchRevenueData = async () => {
      try {
        const { currentDateFormatted, previousMonthDateFormatted } =
          getCurrentAndPreviousMonthDates();
        const response = await axios.get(
          `https://fpetspa.azurewebsites.net/api/DashBoard/compare-revenue`,
          {
            params: {
              month1: previousMonthDateFormatted,
              month2: currentDateFormatted,
            },
          }
        );
        const data = response.data;

        console.log("Response from API:", data); // Log API response

        if (data.month1 !== undefined && data.month2 !== undefined) {
          setCurrentMonthRevenue(data.month2);
          setPreviousMonthRevenue(data.month1);
          const change = ((data.month2 - data.month1) / data.month1) * 100;
          setPercentChange(change.toFixed(2));

          const currentMonthLabel = `(${new Date().toLocaleDateString('en-US', { month: 'short' })})`;
          const previousMonthLabel = `(${new Date(previousMonthDateFormatted).toLocaleDateString('en-US', { month: 'short' })})`;
          // Cập nhật dữ liệu biểu đồ dòng
          setLineData({
            labels: [previousMonthLabel, currentMonthLabel],
            datasets: [
              {
                label: "Revenue",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "#17C653",
                borderColor: "#17C653",
                data: [data.month1, data.month2],
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  useEffect(() => {
    axios
      .get("https://fpetspa.azurewebsites.net/api/DashBoard/total-revenue")
      .then((response) => {
        setSalesThisMonth(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });

    axios
      .get("https://fpetspa.azurewebsites.net/api/DashBoard/order-count")
      .then((response) => {
        setOrderCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order count:", error);
      });
  }, []);

  const orderProgress = orderCount !== null ? (orderCount / goal) * 100 : 0;
  const remainingOrders = goal - (orderCount || 0);

  const barData = {
    labels: ["Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Expense",
        backgroundColor: "#f44336",
        data: [3490, 3000, 2000, 967.01
        ],
      },
      
    ],
  };

  return (
    <div className="bg-[#FCFCFC]">
      <div>
        <h1 className="text-[17.55px] text-[#071437] font-semibold">
          Fpet Dashboard
        </h1>
      </div>

      <div className="flex">
        {/* Left section */}
        <div className="px-[16.250px]">
          <div className="flex flex-col gap-y-9">
            {/* Widget 1 */}
            <div className="w-[272.575px] h-[230.225px] flex flex-col pt-[16.250px] px-[29.250px] bg-[#FFFFFF] rounded-lg shadow-sm">
              <div className="">
                <div className="flex items-center ">
                  <span className="text-[35.239px] text-[#071437] font-semibold mr-[6.500px]">
                    {orderCount !== null ? orderCount : "Loading..."}
                  </span>
                  <span className="w-[55.612px] h-[23.4px] py-[4.225px] px-[6.5px] leading-[13px] text-[13px] text-nowrap	 font-semibold text-[#F8285A] bg-[#FFEEF3] rounded-md">
                    - 2.2%
                  </span>
                </div>
                <span className="pt-[3.250px] text-[13.975px] text-[#99A1B7] font-medium leading-[20.9625px]">
                  Orders This Month
                </span>
              </div>
              <div className="mt-[70.750px]">
                <div className="flex flex-col items-end">
                  <div className="flex justify-between items-start pt-1.5 text-sm text-[#99A1B7] font-medium leading-normal w-full">
                    <span className="mb-[6.500px] text-[#071437] font-bold">
                      {orderCount !== null
                        ? `${remainingOrders.toLocaleString()} to Goal`
                        : "Loading..."}
                    </span>
                    <span className="text-[12.9px] font-semibold">
                      {orderCount !== null
                        ? `${orderProgress.toFixed(2)}%`
                        : "Loading..."}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-md h-2">
                    <div
                      className="bg-[#17C653] h-2 rounded-md"
                      style={{ width: `${orderProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2 */}
            <div className="w-[272.575px] h-[230.225px] flex flex-col pt-[16.250px] px-[29.250px] bg-[#FFFFFF] rounded-lg shadow-sm">
              <div className="flex items-center ">
                <div className="flex items-start">
                  <span className="box-border leading-[40px] text-[16.25px] font-medium text-[#99A1B7] mr-[3.250px]">
                    $
                  </span>
                  <span className="text-[35.239px] text-[#071437] font-semibold">
                    {currentMonthRevenue !== null
                      ? `${currentMonthRevenue}`
                      : "Loading..."}
                  </span>
                </div>
                <span
                  className={`ml-[10px] w-[73px] h-[23.4px]  py-[4.225px] px-[6.5px] leading-[18px] text-[13px] text-nowrap font-semibold ${
                    percentChange !== null && percentChange < 0
                      ? "text-[#F8285A]"
                      : "text-[#0ACF83]"
                  } bg-[#FFEEF3] rounded-md`}
                >
                  {percentChange !== null ? `${percentChange}%` : "Loading..."}
                </span>
              </div>
              <span className="pt-[3.250px] text-[13.975px] text-[#99A1B7] font-medium leading-[20.9625px]">
                Revenue This Month
              </span>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="px-[16.250px] bg-[#FFFFFF] rounded-lg shadow-sm">
          <div className="">
            <h3 className="w-[579.25px] h-[56.600px] flex flex-col items-start px-[29.250px] ">
              <span className="text-[16.575px] font-semibold text-gray-900">
                Total Sales
              </span>
              <span className="mt-[3.250px] text-[13.975px] text-gray-500 font-medium">
                Users from all channels
              </span>
            </h3>
          </div>

          {/* Sales summary */}
          <div className="flex justify-between flex-col px-[29.250px] pt-[26px] pb-[3.25px]">
            <div className="flex">
              <span className="box-border leading-[24.375px] text-[16.25px] font-medium text-[#99A1B7] mr-[3.250px] ">
                $
              </span>
              <span className="text-[32.5px] leading-[32px] font-semibold text-gray-800 box-border">
                {salesThisMonth !== null
                  ? salesThisMonth.toFixed(2)
                  : "Loading..."}
              </span>
            </div>
            {/* <span className="text-[13.975px] font-medium">Sales</span> */}
          </div>

          {/* Transactions chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <strong className="text-lg font-semibold text-blue-900">
              Total Orders
            </strong>
            <Line data={lineData} />
          </div>

          {/* Income vs Expense chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <strong className="text-lg font-semibold text-blue-900">
            </strong>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboards;``