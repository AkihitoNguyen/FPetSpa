// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ShopContext } from '../Context/ShopContext';

const Checkout = () => {
  const isLoggedIn = useSelector((state) => state.auth.login?.currentUser);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      setUserId(isLoggedIn.userId);
    } else {
      console.error('User is not logged in.');
    }
  }, [isLoggedIn]);

  
  const fetchProducts = async (customerId, paymentMethod) => {
    try {
      const response = await axios.post('https://fpetspa.azurewebsites.net/api/Order/StartCheckoutProduct', {
        customerId, 
        paymentMethod 
      });
      const paymentUrl = response.data; // Assuming response.data contains the payment URL
      window.location.href = paymentUrl; // Redirect to the payment URL
    } catch (error) {
      console.error('Error fetching cartId:', error);
    }
  };

  const handleCheckout = (paymentMethod) => {
    if (userId) {
      fetchProducts(userId, paymentMethod);
    } else {
      console.error('User is not logged in.');
    }
  };


const {products, cartItems, getTotalCartAmount}= useContext(ShopContext);


const cartProducts = Array.isArray(products) ? products.filter(product => cartItems[product.productId] > 0) : [];


  return (
    <div>

<div className="bg-gray-100 min-h-screen py-8 flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="md:w-5/6">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4 overflow-auto">
                
                <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <button onClick={() => handleCheckout('VNPay')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2">
        Pay with VNPay
      </button>
        </div>
                
              </div>
            </div>
            <div className="md:w-2/4">
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-lg font-semibold mb-4">Summary</h2>
    
    <table className="w-full text-left">
      <tbody>
        {cartProducts.map((product) => (
          <tr key={product.productId}>
            <td className="py-4">
              <div className="flex items-center">
                <img className="h-24 w-32 mr-4" src={product.pictureName} alt={product.name} />
                <span className="font-semibold">{product.name}</span>
              </div>
            </td>
            <td className="py-4">{product.productName}</td>
          </tr>
        ))}
      </tbody>
    </table>
    
    <div className="flex justify-between mb-2">
      <span>Subtotal</span>
      <span>${getTotalCartAmount()}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>Taxes</span>
      <span>${getTotalCartAmount()}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>Shipping</span>
      <span>$0.00</span>
    </div>
    <hr className="my-2" />
    <div className="flex justify-between mb-2">
      <span className="font-semibold">Total</span>
      <span className="font-semibold">${getTotalCartAmount()}</span>
    </div>
  </div>
</div>
          </div>
        
      </div>
    </div>
    </div>
  );
}

export default Checkout;
