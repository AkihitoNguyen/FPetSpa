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
  const [deliveryOption, setDeliveryOption] = useState('SHIPPING');
  const [showAddressField, setShowAddressField] = useState(true);
  const [shipCost, setShipCost] = useState(0); // Add ship cost state
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    streetAddress: ''
  });

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.userId);
    } else {
      console.error('User is not logged in.');
    }
  }, [currentUser]);

  const fetchProducts = async (customerId, paymentMethod, voucherId, deliveryOption, shipCost) => {
    try {
      console.log('API Call with:', { customerId, paymentMethod, voucherId, deliveryOption, shipCost });
      const response = await axios.post('https://localhost:7055/api/Order/StartCheckoutProduct', {
        customerId,
        paymentMethod,
        voucherId,
        deliveryOption,
        shipCost
      });
      
      const paymentUrl = response.data; // Assuming response.data contains the payment URL
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error fetching cartId:', error.response ? error.response.data : error.message);
      alert('An error occurred while fetching the cartId. Please try again.');
    }
  };

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

  const handleCheckout = (paymentMethod) => {
    if (userId) {
      const voucherId = selectedVoucher ? selectedVoucher.voucherId : null;
      fetchProducts(userId, paymentMethod, voucherId, deliveryOption, shipCost);
    } else {
      console.error('User is not logged in.');
    }
  };

  const fetchShippingCost = async (toDistrict) => {
    try {
      const response = await axios.get(`https://localhost:7055/ShipCost/GetCostShippingGoogleMap?ToDistrict=${toDistrict}`);
      const { cost } = response.data;
      setShipCost(cost);
      setIsAddressConfirmed(true); // Địa chỉ đã được xác nhận
    } catch (error) {
      console.error('Error fetching shipping cost:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
    if (e.target.value === 'SHIPPING') {
      setShowAddressField(true);
    } else {
      setShowAddressField(false);
      setShipCost(0); // Reset shipping cost when not selecting Shipping
    }
  };

  const { products, cartItems, getTotalCartAmount } = useContext(ShopContext);
  const cartProducts = Array.isArray(products) ? products.filter(product => cartItems[product.productId] > 0) : [];

  const getDiscountedTotal = () => {
    const total = getTotalCartAmount();
    const discount = selectedVoucher ? total * parseFloat(selectedVoucher.description) : 0;
    return (total - discount + shipCost).toFixed(2);
  };

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
                  <div className="sm:col-span-full">
                    <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={form.fullName}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-full">
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

                  {showAddressField && (
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
                      <button
                        onClick={() => fetchShippingCost(form.streetAddress)}
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        Confirm Address
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label htmlFor="deliveryOption" className="block text-sm font-medium leading-6 text-gray-900">
                    Delivery Option
                  </label>
                  <select
                    id="deliveryOption"
                    name="deliveryOption"
                    value={deliveryOption}
                    onChange={handleDeliveryOptionChange}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="SHIPPING">Shipping</option>
                    <option value="PICKUP">Pickup</option>
                  </select>
                </div>

                {isAddressConfirmed && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleCheckout('VNPay')}
                      className="hover:bg-blue-400 font-bold py-2 px-4 rounded flex items-center justify-center h-20 w-48"
                    >
                      <img
                        src={assets.Icon_VNPAY_QR}
                        alt="VNPay Logo"
                        className="h-14"
                      />
                    </button>
                    <button
                      onClick={() => handleCheckout('PayPal')}
                      className="hover:bg-yellow-400 font-bold py-2 px-4 rounded flex items-center justify-center h-20 w-48"
                    >
                      <img
                        src={assets.PayPal_Logo}
                        alt="PayPal Logo"
                        className="h-14"
                      />
                    </button>
                  </div>
                )}

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
                <span>Shipping</span>
                <span>${shipCost.toFixed(2)}</span>
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