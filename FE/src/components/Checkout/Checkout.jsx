import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../../assets/assets';

const Checkout = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const [userId, setUserId] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: 'United States',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
  });

  // Fetch current user ID if logged in
  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.userId);
    } else {
      console.error('User is not logged in.');
    }
  }, [currentUser]);

  // Function to initiate the checkout process
  const fetchProducts = async (customerId, paymentMethod, voucherId) => {
    try {
      console.log('API Call with:', { customerId, paymentMethod, voucherId }); // Log the data being sent
      const response = await axios.post('https://localhost:7055/api/Order/StartCheckoutProduct', {
        customerId,
        paymentMethod,
        voucherId
      });
      const paymentUrl = response.data; // Assuming response.data contains the payment URL
      window.location.href = paymentUrl; // Redirect to the payment URL
    } catch (error) {
      console.error('Error fetching cartId:', error.response ? error.response.data : error.message);
    }
  };

  // Fetch available vouchers on component mount
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get('https://localhost:7055/api/Voucher');
        setVouchers(response.data);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers();
  }, []);

  // Handle checkout button click
  const handleCheckout = (paymentMethod) => {
    if (userId) {
      const voucherId = selectedVoucher ? selectedVoucher.voucherId : null;
      fetchProducts(userId, paymentMethod, voucherId);
    } else {
      console.error('User is not logged in.');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const { products, cartItems, getTotalCartAmount } = useContext(ShopContext);
  const cartProducts = Array.isArray(products) ? products.filter(product => cartItems[product.productId] > 0) : [];

  // Calculate discounted total
  const getDiscountedTotal = () => {
    const total = getTotalCartAmount();
    const discount = selectedVoucher ? total * parseFloat(selectedVoucher.description) : 0;
    return (total - discount).toFixed(2);
  };

  // Handle voucher selection
  const handleVoucherClick = (voucherId) => {
    const selected = vouchers.find(voucher => voucher.voucherId === voucherId);
    setSelectedVoucher(selected);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="md:w-11/12">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 overflow-auto">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                      First name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                      Last name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
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
                        value={form.email}
                        onChange={handleInputChange}
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
                        value={form.country}
                        onChange={handleInputChange}
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
                    <label htmlFor="streetAddress" className="block text-sm font-medium leading-6 text-gray-900">
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="streetAddress"
                        id="streetAddress"
                        value={form.streetAddress}
                        onChange={handleInputChange}
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                </div>
                <button
                  onClick={() => handleCheckout('VNPay')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center mt-3"
                >
                  <img
                    src={assets.Icon_VNPAY_QR}
                    alt="VNPay Logo"
                    className="w-6 h-6 mr-2"
                  />
                  Pay with VNPay
                </button>
                <div className="md:w-full mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-4 overflow-auto">
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => handleVoucherClick('V01')}
                        className="group relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                      >
                        Voucher Discount 30%
                      </button>
                      <button
                        onClick={() => handleVoucherClick('V02')}
                        className="group relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                      >
                        Voucher Discount 50%
                      </button>
                    </div>
                  </div>
                </div>
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
                <span>${(getTotalCartAmount() * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Voucher</span>
                <span>${selectedVoucher ? (getTotalCartAmount() * parseFloat(selectedVoucher.description)).toFixed(2) : '0.00'}</span>
              </div>

              <hr className="my-2" />
              
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${getDiscountedTotal()}</span>
              </div>
              
              <div className="mt-4">
                <label htmlFor="voucherSelect" className="block text-sm font-medium leading-6 text-gray-900">
                  Select Voucher
                </label>
                <select
                  id="voucherSelect"
                  name="voucherSelect"
                  value={selectedVoucher ? selectedVoucher.voucherId : ''}
                  onChange={(e) => {
                    const selected = vouchers.find(voucher => voucher.voucherId === e.target.value);
                    setSelectedVoucher(selected);
                  }}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="">No Voucher</option>
                  {vouchers.map((voucher) => (
                    <option key={voucher.voucherId} value={voucher.voucherId}>
                      {voucher.description} - {voucher.voucherId}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
