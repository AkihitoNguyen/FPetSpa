import React, { useState } from 'react';

const PayInOut = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState(null);

  const fetchData = async () => {
    const response = await fetch(`https://fpetspa.azurewebsites.net/api/Payment/PayPalInOut?StartDate=${startDate}&EndDate=${endDate}`);
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h1>PayInOut</h1>
      <div>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <button onClick={fetchData}>Fetch Data</button>
      {result && (
        <div>
          <h2>Result</h2>
          <p>Total In: {result.toTalIn}</p>
          <p>Total Out: {result.toTalOut}</p>
        </div>
      )}
    </div>
  );
};

export default PayInOut;