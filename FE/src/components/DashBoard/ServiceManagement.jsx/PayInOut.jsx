import React, { useState } from 'react';

const PayInOut = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://fpetspa.azurewebsites.net/api/Payment/PayPalInOut?StartDate=${startDate}&EndDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full sm:w-96">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Pay In/Out</h1>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          onClick={fetchData}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Fetch Data
        </button>
        {result && (
          <div className="mt-8 bg-gray-200 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Result</h2>
            <div className="flex justify-between">
              <p className="text-gray-700">Total In:</p>
              <p className="text-gray-700">${result.toTalIn}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Total Out:</p>
              <p className="text-gray-700">${result.toTalOut}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayInOut;
