// NotFound.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
