import  { useContext } from 'react';
import { useSelector } from 'react-redux';
import '../CartItem/CartItem.css';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItems = () => {
  const { getTotalCartAmount, products, cartItems, removeFromCart, addToCart } = useContext(ShopContext);
  const isLoggedIn = useSelector((state) => state.auth.login?.currentUser);

  // Filter products that are in the cart
  const cartProducts = products.filter(product => cartItems[product.productId] > 0);

  return (
    <div className="bg-gray-100 min-h-screen py-8 flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
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
                    <th className="text-left font-semibold">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map(product => (
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
                          <span className="text-center w-8">{cartItems[product.productId]}</span>
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
                <Link to="/checkout" className="Btn">
                  <button className="Btn">
                    Pay
                    <svg className="svgIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                  </button>
                </Link>
              ) : (
                <p>
                  Please <Link to="/login" style={{ color: 'red', textDecoration: 'underline' }}>Login</Link> to proceed with payment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
