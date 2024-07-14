import axios from "axios";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [dropdownState, setDropdownState] = useState(false);

  const currentDate = dayjs();
  const nextDate = dayjs().add(1, 'day');

  const [searchParams, setSearchParams] = useState({
    count: 100,
    startId: "",
    minAmount: "",
    maxAmount: "",
    startDate: currentDate,
    endDate: nextDate,
    month: "",
    year: "",
  });

  const fetchTransactions = (params) => {
    const query = new URLSearchParams(params).toString();
    axios
      .get(`https://fpetspa.azurewebsites.net/api/Payment/ListTransactionPayPal?${query}`)
      .then((res) => {
        console.log(res.data);
        setTransactions(res.data);
        setFilteredTransactions(res.data);
      })
      .catch((error) => console.error("Error fetching data", error));
  };

  useEffect(() => {
    fetchTransactions(searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (filterStatus === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (transaction) => transaction.state === filterStatus
      );
      setFilteredTransactions(filtered);
    }
  }, [filterStatus, transactions]);

  const statusClass = (state) => {
    switch (state) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-900 bg-gray-100";
    }
  };

  const statusText = (state) => {
    switch (state) {
      case "approved":
        return "Approved";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const handleSelect = (status) => {
    setFilterStatus(status);
    setDropdownState(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleDateChange = (key, date) => {
    setSearchParams((prevParams) => ({ ...prevParams, [key]: date }));
  };

  const handleExecute = () => {
    fetchTransactions(searchParams);
  };

  const handleClear = () => {
    setSearchParams({
      count: 100,
      startId: "",
      minAmount: "",
      maxAmount: "",
      startDate: currentDate,
      endDate: nextDate,
      month: "",
      year: "",
    });
  };

  return (
    <div>
    <div className="flex justify-between">
      <div>
        <h1 className="text-[16.2696px] font-semibold">Transactions</h1>
      </div>
    </div>
    <div className="min-w-full bg-white border-1 rounded-md mt-4">
      <div className="flex justify-between items-center mt-4 ml-5">
        <div>
          <input
            type="text"
            placeholder="Search Order"
            className="inline-flex items-center justify-between w-[222px] h-[41.57px] px-[13px] py-[10.075px] rounded-md text-[#99A1B7] outline-none bg-[#F9F9F9] text-sm font-medium hover:bg-gray-50"
          />
          <button className="ml-3 px-4 py-2 bg-[#1B84FF] text-white rounded-md ">
            Search
          </button>
        </div>
        <div className="flex items-center mr-10">
          <div className="flex flex-row  gap-2 items-center p-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={searchParams.startDate}
                onChange={(date) => handleDateChange("startDate", date)}
              />
              <DatePicker
                label="End Date"
                value={searchParams.endDate}
                onChange={(date) => handleDateChange("endDate", date)}
              />
            </LocalizationProvider>
          </div>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setDropdownState(!dropdownState)}
              className="inline-flex items-center justify-between w-[146px] rounded-md px-[13px] py-[10.075px] text-[#99A1B7] bg-[#F9F9F9] text-[14.3px] font-medium hover:bg-gray-50"
            >
              <span>{filterStatus ? statusText(filterStatus) : "Status"}</span>
              <svg
                className={`ml-2 h-5 w-5 mb-[3px] transform transition-transform duration-200 ${
                  dropdownState ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {dropdownState && (
              <div className="absolute right-0 mt-2 w-[146px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => handleSelect("")}
                  className="block w-full px-4 py-2 text-[14.3px] font-medium text-left text-blue-500"
                >
                  All
                </button>
                <button
                  onClick={() => handleSelect("approved")}
                  className="block w-full px-4 py-2 text-[14.3px] font-medium text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500"
                >
                  Approved
                </button>
                <button
                  onClick={() => handleSelect("failed")}
                  className="block w-full px-4 py-2 text-[14.3px] font-medium text-left text-[#4B5675] hover:bg-gray-100 hover:text-blue-500"
                >
                  Failed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        <input
          type="number"
          name="count"
          value={searchParams.count}
          onChange={handleInputChange}
          placeholder="Count"
          className="w-[150px] p-2 border rounded-md"
        />
        <input
          type="text"
          name="startId"
          value={searchParams.startId}
          onChange={handleInputChange}
          placeholder="Start ID"
          className="w-[150px] p-2 border rounded-md"
        />
        <input
          type="number"
          name="minAmount"
          value={searchParams.minAmount}
          onChange={handleInputChange}
          placeholder="Min Amount"
          className="w-[150px] p-2 border rounded-md"
        />
        <input
          type="number"
          name="maxAmount"
          value={searchParams.maxAmount}
          onChange={handleInputChange}
          placeholder="Max Amount"
          className="w-[150px] p-2 border rounded-md"
        />
        <input
          type="number"
          name="month"
          value={searchParams.month}
          onChange={handleInputChange}
          placeholder="Month"
          className="w-[150px] p-2 border rounded-md"
        />
        <input
          type="number"
          name="year"
          value={searchParams.year}
          onChange={handleInputChange}
          placeholder="Year"
          className="w-[150px] p-2 border rounded-md"
        />
      </div>
      <div className="flex justify-end p-4">
        <button
          onClick={handleExecute}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Execute
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Clear
        </button>
      </div>
      {filteredTransactions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No transactions found.</div>
      ) : (
        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
                Order Id
              </th>
              <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
                Payment Id
              </th>
              <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
                Create Time
              </th>
              <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="border-0.5">
            {filteredTransactions.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                  {item.createTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                  ${item.amount} <span>{item.currency}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold">
                  <span
                    className={`text-[11.05px] font-semibold px-2 py-1 rounded ${statusClass(
                      item.state
                    )}`}
                  >
                    {statusText(item.state)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  );
};

export default Transactions;