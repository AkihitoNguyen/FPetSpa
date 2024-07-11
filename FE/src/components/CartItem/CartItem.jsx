// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = () => {
  const {
    getTotalCartAmount,
    cartItems,
    removeFromCart,
    addToCart,
    loading,
    error,
    products,
  } = useContext(ShopContext);

  const isLoggedIn = useSelector((state) => state.auth.login?.currentUser);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

const cartProducts = Array.isArray(products) ? products.filter(product => cartItems[product.productId] > 0) : [];
console.log(cartProducts);
  return (
    <div className="bg-gray-100 min-h-screen py-8 flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        {Object.keys(cartItems).length === 0 ? (
          <p>Your cart is empty. <Link to="/product" style={{ color: 'red', textDecoration: 'underline' }}>Shop now</Link></p>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="md:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4 overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold">Product</th>
                      <th className="text-left font-semibold">Price</th>
                      <th className="text-left font-semibold">Quantity</th>
                      <th className="text-left font-semibold">Total</th>
                      <th className="text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((product) => (
                      <tr key={product.productId}>
                        <td className="py-4">
                          <div className="flex items-center">
                            <img className="h-24 w-32 mr-4" src={product.pictureName} alt={product.name} />
                            <span className="font-semibold">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4">${product.price}</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <button
                              className="border rounded-md py-2 px-4 mr-2"
                              onClick={() => addToCart(product.productId, -1)}
                              disabled={cartItems[product.productId] <= 1}
                            >-</button>
                            <span className="text-center w-1">{cartItems[product.productId]}</span>
                            <button
                              className="border rounded-md py-2 px-4 ml-2"
                              onClick={() => addToCart(product.productId, 1)}
                            >+</button>
                          </div>
                        </td>
                        <td className="py-4">${product.price * cartItems[product.productId]}</td>
                        <td className="py-4"><DeleteIcon className="cursor-pointer" onClick={() => removeFromCart(product.productId)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
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
                {isLoggedIn ? (
                  <Link to='/checkout'><button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Checkout</button></Link>
                ) : (
                  <Link to="/login" className="bg-red-500 text-white py-2 px-4 rounded mt-4">Login to Checkout</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
