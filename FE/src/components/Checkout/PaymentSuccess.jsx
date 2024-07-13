// PaymentSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleReturnToShop = () => {
    navigate('/'); // Navigate back to the shop page or any other page you want
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h2>
        <p className="text-gray-700 mb-6">Thank you for your purchase. Your order has been processed successfully.</p>
        <button 
          onClick={handleReturnToShop} 
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
